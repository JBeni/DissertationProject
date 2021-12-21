import React, { Component } from 'react';
import MaterialTable from '@material-table/core';
import * as applicationService from '../../Services/applicationService';
import { DialogContent, Typography, DialogTitle, Dialog, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import Visibility from '@material-ui/icons/Visibility';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import AddCompanyProjectRequest from './AddCompanyProjectRequest';
import ViewCompanyProjectRequest from './ViewCompanyProjectRequest';
import * as dropdownService from '../../Services/dropdownService';
import CompanyProjectRequestStepper from './CompanyProjectRequestStepper';
import { Toaster } from 'react-hot-toast';
import * as toasterService from '../../Services/toasterService';
import * as eventService from '../../Services/eventService';
import * as roleService from '../../Services/roleService';
import { materialTableIcons, setMessageNextStep, getProjectStatusSteps, setActiveStep, signEntityByUser, testUserPrivateKey } from './../../sharedResources';

class CompanyProjectRequests extends Component {
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
            lastProjectRequest: null,
            permission: null,

            project: { index: -1, name: '', status: '', ipfsFileCID: '', projectAddress: '', signerAddress: '' },
            requests: [],
		};
    }

    componentDidMount() {
        this.initialize();
    }

    initialize = async () => {
        // Accessing path without the existence of the project
        const data = await eventService.checkProjectInEvents(this.props, this.props.match.params.id);
        if (data?.length === 0) {
            this.props.history.push('/company');
            return;
        }
        await this.getProjectInfo();
        await this.getProjectRequests();

        const projectStatusId = dropdownService.getProjectStatusByValue(this.state.project.status);
        const roleId = dropdownService.getUserRoleByValue(this.props.currentUserRole);
        const permission = await this.props.serviceChain.methods
            .checkPermissionCompany(Number(projectStatusId.id), Number(roleId.id)).call({ from: this.props.account });
        this.setState({ permission: permission });

        if (this.state.requests?.length === 0) {
            const addressZero = await roleService.getAddressZeroValue(this.props);
            this.setState({ lastProjectRequest: addressZero });    
        }
        await this.getLastProjectRequest(this.props.match.params.id);
    }

    getProjectInfo = async () => {
        const data = await applicationService.getProjectInfo(this.props, this.props.match.params.id);
        if (data?.length === 0) return;
        this.setState({ project: data });
    }

    getProjectRequests = async () => {
        const data = await applicationService.getProjectRequests(this.props, this.props.match.params.id);
        if (data?.length === 0) return;
        this.setState({ requests: data, lastProjectRequest: data[data.length - 1].requestAddress });
    }

    getLastProjectRequest = async (_projectAddress) => {
        const lastRequest = await this.props.project.methods.getLastProjectRequest(_projectAddress, this.state.lastProjectRequest)
            .call({ from: this.props.account })
            .then((result) => { return result; }).catch((error) => {});
        const addressZero = await roleService.getAddressZeroValue(this.props);

        /**
         * If at this time we don't have a request the method will
         * RETURN an array with an item initialized with default data
         */
        if (lastRequest._projectAddress === addressZero) {
            const defProjectStatus = dropdownService.getDefaultProjectStatus();
            this.setState({ activeStep: Number(defProjectStatus.id) + 1 });
            this.setState({ currentStep: 'Project created', nextStep: 'Send approve request to Supervisor' });
            return;
        }
        const requestStatus = dropdownService.getRequestStatusById(lastRequest._requestStatus);
        const projectStatus = dropdownService.getProjectStatusById(lastRequest._projectStatus);

        const unApprovedReqStatus = dropdownService.getDefaultRequestStatus();
        const completedProjectStatus = dropdownService.getCompletedProjectStatus();
        const approvedReqStatus = dropdownService.getApprovedRequestStatus();
        if (requestStatus.value === unApprovedReqStatus.value) {
            this.setState({ requestNextStep: false });
        }
        if (projectStatus.value === completedProjectStatus.value && requestStatus.value === approvedReqStatus.value) {
            this.setState({ requestNextStep: false });
        }

        const activeStep = setActiveStep(lastRequest);
        this.setState({ activeStep: activeStep.activeStep, projectCompleted: activeStep.projectCompleted });

        const messageStep = setMessageNextStep(lastRequest);
        this.setState({ currentStep: messageStep.currentStep, nextStep: messageStep.nextStep });
    }

    getProjectStatusSteps = () => {
        return getProjectStatusSteps();
    }

    handleNewDataFromPopup = (value) => {
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
        this.createRequest(
            data.title,
            data.projectStatus,
            data.requestStatus,
            this.state.project.projectAddress
        );
        resetForm();
        this.setRecordForEdit(null);
    }

    createUniqueRequestAddress = async (_title, _index) => {
        const data = await Promise.resolve(applicationService.createUniqueRequestAddress(this.props, _title, _index));
        return data;
    }

    createRequest = async (_title, _projectStatus, _requestStatus, _projectAddress) => {
        const requestAddress = await this.createUniqueRequestAddress(_title, new Date().getTime());
        const signatureData = signEntityByUser(requestAddress, this.props);
        const verification = await testUserPrivateKey(this.props, _projectAddress, this.props.account, signatureData.signature);

        if (signatureData !== null && verification === true) {
            await this.props.project.methods
                .createRequest(
                    _title, Number(_projectStatus),
                    Number(_requestStatus), _projectAddress,
                    requestAddress, signatureData.signature
                ).send({ from: this.props.account })
                .then(async (response) => {
                    await this.getProjectRequests();
                    await this.getLastProjectRequest(this.props.match.params.id);
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
			{ title: 'Project Status', field: 'projectStatus' },
			{ title: 'Request Status', field: 'requestStatus' },
		];

		return (
			<div>
                <Link to={`/company`}>Go back</Link>
                <br/><br/>

                {
                    (this.state.requestNextStep === true && this.state.permission === true) ?
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
                        <AddCompanyProjectRequest
                            handleNewDataFromPopup={this.handleNewDataFromPopup.bind(this)}
                            recordForEdit={this.state.recordForEdit}
                            addOrEdit={this.addOrEdit}
                        />
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
                        <ViewCompanyProjectRequest recordForEdit={this.state.recordForEdit} />
                    </DialogContent>
				</Dialog>

				<br /><br />
				<MaterialTable
					title="Project Requests"
					tableRef={tableRef}
					icons={materialTableIcons}
					columns={columns}
					data={this.state.requests}
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
                <CompanyProjectRequestStepper
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

export default withRouter(CompanyProjectRequests);
