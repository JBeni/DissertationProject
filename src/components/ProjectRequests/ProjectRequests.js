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
import * as dropdownService from '../Services/dropdownService';
import ProjectReqStepper from './ProjectReqStepper';
import { Toaster } from 'react-hot-toast';
import * as toasterService from '../Services/toasterService';
import * as eventService from '../Services/eventService';
import * as roleService from '../Services/roleService';

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

            currentStep: '',
            nextStep: '',

            project: { index: -1, name: '', status: '', ipfsFileCID: '', projectAddress: '', signerAddress: '' },
            projectRequests: [],
		};
    }

    async componentDidMount() {
        // Accessing path without the existence of the project
        const data = await eventService.checkProjectInEvents(this.props, this.props.match.params.id);
        if (data?.length === 0) {
            this.props.history.push('/projects');
            return;
        }

        this.getProjectInfo();
        this.getAllProjectRequests();
        this.getLastProjectRequest(this.props.match.params.id);
    }

    getLastProjectRequest = async (projectAddress) => {
        const requests = await eventService.getProjectRequestEvents(this.props, projectAddress);
        if (requests.length === 0) return;

        const lastRequest = await this.props.project.methods.getLastProjectRequest(projectAddress).call()
            .then((result) => { return result; });

        const addressZero = roleService.getAddressZeroValue();
        /**
         * If at this time we don't have a request the method will
         * RETURN an array with an item initialized with default data
         */
        if (lastRequest._projectAddress === addressZero) {
            // Project was Created
            const defProjectStatus = dropdownService.getDefaultProjectStatus();
            this.setState({ activeStep: Number(defProjectStatus.id) + 1 });
            this.setState({ currentStep: 'Project created', nextStep: 'Send approve request to Supervisor' });
            return;
        }
        const requestStatus = dropdownService.getRequestStatusById(lastRequest._requestStatus);
        const projectStatus = dropdownService.getProjectStatusById(lastRequest._status);

        const unApprovedReqStatus = dropdownService.getDefaultRequestStatus();
        const completedProjectStatus = dropdownService.getCompletedProjectStatus();
        const approvedReqStatus = dropdownService.getApprovedRequestStatus();
        if (requestStatus.value === unApprovedReqStatus.value) {
            this.setState({ requestNextStep: false });
        }
        if (projectStatus.value === completedProjectStatus.value && requestStatus.value === approvedReqStatus.value) {
            this.setState({ requestNextStep: false });
        }

        this.setActiveStep(lastRequest);
        this.setMessageNextStep(lastRequest);
    }

    setMessageNextStep = (lastRequest) => {
        // Approve Request was Sent
        if (Number(lastRequest._status) === 1 && Number(lastRequest._requestStatus) === 0) {
            this.setState({ currentStep: 'Approve Request was Sent', nextStep: 'Wait for Supervisor response' });
            return;
        }
        // Approve Request was Rejected
        if (Number(lastRequest._status) === 1 && Number(lastRequest._requestStatus) === 1) {
            this.setState({ currentStep: 'Approve Request was Rejected', nextStep: 'See the reason and make the adjustment' });
            return;
        }
        // Approve Request was Approved
        if (Number(lastRequest._status) === 1 && Number(lastRequest._requestStatus) === 2) {
            this.setState({ currentStep: 'Approve Request was Approved', nextStep: 'Send start project request to company.' });
            return;
        }

        // StartProject Request was Sent
        if (Number(lastRequest._status) === 2 && Number(lastRequest._requestStatus) === 0) {
            this.setState({ currentStep: 'StartProject Request was Sent', nextStep: 'Wait for Company response' });
            return;
        }
        // StartProject Request was Rejected
        if (Number(lastRequest._status) === 2 && Number(lastRequest._requestStatus) === 1) {
            this.setState({ currentStep: 'StartProject Request was Rejected', nextStep: 'See the reason and make the adjustment' });
            return;
        }
        // StartProject Request was Approved
        if (Number(lastRequest._status) === 2 && Number(lastRequest._requestStatus) === 2) {
            this.setState({ currentStep: 'StartProject Request was Approved', nextStep: 'Send check the progress before finalization request to Supervisor' });
            return;
        }

        // FinalizationCheck Request was Sent
        if (Number(lastRequest._status) === 3 && Number(lastRequest._requestStatus) === 0) {
            this.setState({ currentStep: 'FinalizationCheck Request was Sent', nextStep: 'Wait for Supervisor response' });
            return;
        }
        // FinalizationCheck Request was Rejected
        if (Number(lastRequest._status) === 3 && Number(lastRequest._requestStatus) === 1) {
            this.setState({ currentStep: 'FinalizationCheck Request was Rejected', nextStep: 'See the reason and make the adjustment' });
            return;
        }
        // FinalizationCheck Request was Approved
        if (Number(lastRequest._status) === 3 && Number(lastRequest._requestStatus) === 2) {
            this.setState({ currentStep: 'FinalizationCheck Request was Approved', nextStep: 'Send completed project request to Supervisor' });
            return;
        }

        // Completed Request was Sent
        if (Number(lastRequest._status) === 4 && Number(lastRequest._requestStatus) === 0) {
            this.setState({ currentStep: 'Completed Request was Sent', nextStep: 'Wait for Supervisor response' });
            return;
        }
        // Completed Request was Rejected
        if (Number(lastRequest._status) === 4 && Number(lastRequest._requestStatus) === 1) {
            this.setState({ currentStep: 'Completed Request was Rejected', nextStep: 'See the reason and make the adjustment' });
            return;
        }
        // Completed Request was Approved
        if (Number(lastRequest._status) === 4 && Number(lastRequest._requestStatus) === 2) {
            this.setState({ currentStep: 'Project Completed', nextStep: 'All steps completed.' });
            return;
        }
    }

    setActiveStep = (lastRequest) => {
        // Status with Approve Consent
        if (Number(lastRequest._status) > 0 && Number(lastRequest._requestStatus) < 2) {
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

    getProjectStatusSteps() {
        return [ 'Created', 'ToApprove', 'StartProject', 'FinalizationCheck', 'Completed'];
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

        if (userPrivateKey === null) {
            toasterService.notifyToastError('Valid Private KEY required to sign the transaction.');
            return null;
        }

        try {
            return this.props.web3.eth.accounts.sign(requestAddress, '0x' + userPrivateKey);
        } catch (error) {
            toasterService.notifyToastError('Valid Private KEY required to sign the transaction.');
            return null;
        }
    }

    createUniqueProjectReqAddress = async (_title, _index) => {
        const data = await Promise.resolve(applicationService.createUniqueProjectRequestAddress(this.props, _title, _index));
        return data;
    }

    createProjectRequest = async (_title, _status, _requestStatus, _projectAddress) => {
        const projectReqAddress = await this.createUniqueProjectReqAddress(_title, new Date().getTime());
        const signatureData = this.signProjectRequest(projectReqAddress);

        if (signatureData !== null) {
            await this.props.project.methods
                .createProjectRequest(
                    _title, Number(_status),
                    Number(_requestStatus), _projectAddress,
                    projectReqAddress, signatureData.signature
                ).send({ from: this.props.account })
                .then((response) => {
                    this.getAllProjectRequests();
                    this.getLastProjectRequest(this.props.match.params.id);
                    toasterService.notifyToastSuccess('Create Project Request operation was made successfully');
                })
                .catch((error) => {
                    toasterService.notifyToastError('Create Project Request operation has failed');
                });
        }
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
                    currentStep={this.state.currentStep}
                    nextStep={this.state.nextStep}
                />

                <Toaster position="bottom-center" reverseOrder={false} />
			</div>
		);
	}
}

export default withRouter(ProjectRequests);
