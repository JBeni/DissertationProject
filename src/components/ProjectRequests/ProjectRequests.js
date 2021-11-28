import React, { Component } from 'react';
import MaterialTable from '@material-table/core';
import * as applicationService from '../Services/applicationService';
import { DialogContent, Typography, DialogTitle, Dialog, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import Visibility from '@material-ui/icons/Visibility';
import { materialTableIcons } from '../sharedResources';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import AddProjectRequest from './AddProjectRequest';
import ViewProjectRequest from './ViewProjectRequest';
import { getRequestStatusById } from '../Services/dropdownService';
import ProjectReqStepper from './ProjectReqStepper';
import { getAddressZeroValue, getCompletedProjectStatus, getDefaultRequestStatus, getDefaultProjectStatus, getProjectStatusById } from '../Services/dropdownService';
import { Toaster } from 'react-hot-toast';
import * as toasterService from '../Services/toasterService';

class ProjectRequests extends Component {
	constructor(props) {
		super(props);
        this.state = {
			createRequestForm: false,
            viewRequestForm: false,
            requestNextStep: true,
            projectCompleted: false,

            recordForEdit: null,
            activeStep: -1,

            project: { index: '', name: '', status: '', ipfsFileCID: '', projectAddress: '', userAddress: '' },
            projectRequests: [],
		};
    }

    componentDidMount() {
        this.getProjectInfo();
        this.getAllProjectRequests();
        this.getLastProjectRequest(this.props.match.params.id);
    }

    getLastProjectRequest = async (projectAddress) => {
        const lastRequest = await this.props.project.methods.getLastProjectRequest(projectAddress).call()
            .then((result) => { return result; });
        
        const addressZero = getAddressZeroValue();
        /**
         * If at this time we don't have not a single request the method will
         * RETURN an array with an item initialized with default data
         */
        if (lastRequest._projectAddress === addressZero) {
            // This mean Project is Created
            const defProjectStatus = getDefaultProjectStatus();
            this.setState({ activeStep: Number(defProjectStatus.id) + 1 });
            return;
        }
        const requestStatus = getRequestStatusById(lastRequest._requestStatus);
        const projectStatus = getProjectStatusById(lastRequest._status);

        const unApprovedReqStatus = getDefaultRequestStatus();
        const completedProjectStatus = getCompletedProjectStatus();
        if (requestStatus.value === unApprovedReqStatus || projectStatus.value === completedProjectStatus) {
            this.setState({ requestNextStep: false });
        }
        this.setActiveStep(lastRequest);
    }

    setActiveStep = (lastRequest) => {
        if (Number(lastRequest._status) === 0) {
            // This mean Project is Created
            this.setState({ activeStep: Number(lastRequest._status) + 1 });
        }
        // Status with Approve Consent
        if (Number(lastRequest._status) > 0 && Number(lastRequest._requestStatus) === 0) {
            this.setState({ activeStep: Number(lastRequest._status) });
        }
        if (Number(lastRequest._status) > 0 && Number(lastRequest._requestStatus) === 2) {
            this.setState({ activeStep: Number(lastRequest._status) + 1 });
        }
        // Last Project Status
        if (Number(lastRequest._status) === 4 && Number(lastRequest._requestStatus) === 2) {
            this.setState({ activeStep: Number(lastRequest._status) + 1 });
            this.setState({ projectCompleted: true })
        }
    }

    getProjectInfo = async () => {
        let data = await applicationService.getProjectInfo(this.props, this.props.match.params.id);
        this.setState({ project: data });
    }

    getAllProjectRequests = async () => {
        let data = await applicationService.getAllProjectRequests(this.props, this.props.match.params.id);
        this.setState({ projectRequests: data });
    }

    handleNewDataFromPopup(value) {
        this.setState({ createRequestForm: value });
    }

    setCreateRequestForm = (value) => {
        this.setState({ createRequestForm: value });
    }

    setViewRequestForm = (value) => {
        this.setState({ viewRequestForm: value });
    }

	setRecordForEdit = (data) => {
		this.setState({ recordForEdit: data });
	}

    addOrEdit = async (data, resetForm) => {
        this.createProjectRequest(
            data.title,
            data.status,
            data.requestStatus,
            this.state.project.projectAddress
        );
        resetForm();
        this.setRecordForEdit(null);
    }

    signProjectRequest = (requestAddress) => {
        const userPrivateKey = prompt('Please enter your private key to sign the transaction....');
        return this.props.web3.eth.accounts.sign(requestAddress, '0x' + userPrivateKey);
    }

    createUniqueProjectReqAddress = async () => {
        const data = await Promise.resolve(applicationService.createUniqueProjectRequestAddress(this.props));
        return data;
    }

    createProjectRequest = async (_title, _status, _requestStatus, _projectAddress) => {
        const projectReqAddress = await this.createUniqueProjectReqAddress();
        const signatureData = this.signProjectRequest(projectReqAddress);

        await this.props.project.methods
			.createProjectRequest(
                this.props.web3.utils.utf8ToHex(_title),
                Number(_status), Number(_requestStatus), _projectAddress,
                projectReqAddress, signatureData.signature
            ).send({ from: this.props.account }).then((receipt) => {
                this.getAllProjectRequests();
                this.getLastProjectRequest(this.props.match.params.id);
            });
    }

    getProjectStatusSteps() {
        return ['Created', 'ToApprove', 'StartProject', 'FinalizationCheck', 'Completed'];
    }

    getProjectStatusStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return 'Medicine at manufacturing stage in the supply chain.';
            case 1:
                return 'Medicine collected by the Transporter is on its way to you.';
            case 2:
                return 'Wholesaler, the medicine is currently with you!';
            case 3:
                return 'Medicine is collected by the Transporter! On its way to the Distributor.';
            case 4:
                return 'Medicine is delivered to the Distributor';
            case 5:
                return 'Medicine is delivered to the Distributor';
            default:
                return 'Unknown stepIndex';
        }
    }

    notifyToastSuccess = () => {
        toasterService.notifyToastSuccess('User was stored successfully into the blockchain');
    }

    notifyToastError = () => {
        toasterService.notifyToastError('The user couldnt be saved into the blockchain');
    }

	render() {
		const tableRef = React.createRef();
		const columns = [
			{ title: 'Title', field: 'title' },
			{ title: 'Project Status', field: 'status' },
			{ title: 'Request Status', field: 'requestStatus' },
		];

		return (
			<div>
                <Link to={`/projects`}>Go back</Link>
                <br/><br/>

                {
                    this.state.requestNextStep === true ?
                        <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            this.setRecordForEdit(this.state.project);
                            this.setCreateRequestForm(true);
                        }}>Add Project Request</Button>
                    : this.state.projectCompleted === true ? <div>Project Steps Completed</div>
                    : <div>The Current Request must be approved or rejected to add another request</div>
                }

				<Dialog open={this.state.createRequestForm} maxWidth="md">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								Add Project Request Form
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setCreateRequestForm(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers style={{ width: '700px' }}>
                        <AddProjectRequest handleNewDataFromPopup={this.handleNewDataFromPopup.bind(this)} recordForEdit={this.state.recordForEdit} addOrEdit={this.addOrEdit} />
                    </DialogContent>
				</Dialog>

				<Dialog open={this.state.viewRequestForm} maxWidth="md">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								View Project Request Form
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setViewRequestForm(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers style={{ width: '700px' }}>
                        <ViewProjectRequest recordForEdit={this.state.recordForEdit} />
                    </DialogContent>
				</Dialog>

				<br /><br />
				<MaterialTable
					title="Project Requests"
					tableRef={tableRef}
					icons={materialTableIcons}
					columns={columns}
					data={this.state.projectRequests}
					options={{ exportButton: true, actionsColumnIndex: -1 }}
					actions={[
						{
							icon: Visibility,
							tooltip: 'View Request',
							onClick: (event, rowData) => {
                                this.setViewRequestForm(true);
                                this.setRecordForEdit(rowData);
							},
						},
					]}
				/>

                <br/><br/>
                <ProjectReqStepper
                    getSteps={this.getProjectStatusSteps}
                    activeStep={Number(this.state.activeStep)}
                    getStepContent={this.getProjectStatusStepContent}
                />

                <Toaster position="bottom-center" reverseOrder={false} />
			</div>
		);
	}
}

export default withRouter(ProjectRequests);
