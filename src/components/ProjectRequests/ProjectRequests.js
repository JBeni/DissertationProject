import React, { Component } from 'react';
import MaterialTable from '@material-table/core';
import * as applicationService from '../applicationService';
import { DialogContent, Typography, DialogTitle, Dialog, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import Visibility from '@material-ui/icons/Visibility';
import { materialTableIcons } from '../sharedResources';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import AddProjectRequest from './AddProjectRequest';
import ViewProjectRequest from './ViewProjectRequest';
import { getDefaultRequestStatus } from '../applicationService';

class ProjectRequests extends Component {
	constructor(props) {
		super(props);
        this.state = {
			createRequestForm: false,
            viewRequestForm: false,
			recordForEdit: null,
            currentRequestStatus: true,

            project: {},
            projectRequests: [],
		};
    }

    componentDidMount() {
        this.getProjectInfo();
        this.getAllProjectRequests();
    }

    getProjectInfo = async () => {
        let data = await applicationService.getProjectInfo(this.props, this.props.match.params.id);
        this.setState({ project: data });
    }

    getAllProjectRequests = async () => {
        let data = await applicationService.getAllProjectRequests(this.props, this.props.match.params.id);
        this.setState({ projectRequests: data });

        if (this.state.projectRequests.length > 0) {
            let index = this.state.projectRequests.length - 1;
            let requestStatus = getDefaultRequestStatus();
            if (this.state.projectRequests[index].requestStatus === requestStatus.value) {
                this.setState({ currentRequestStatus: false });
            }    
        }
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
            data['title'],
            data['description'],
            data['status'],
            data['requestStatus'],
            this.state.project.projectAddress
        );
        resetForm();
        this.setRecordForEdit(null);
        this.getAllProjectRequests();
    }

    createProjectRequest = async (_title, _description, _status, _requestStatus, _projectAddress) => {
        await this.props.project.methods
			.createProjectRequest(_title, _description, Number(_status), Number(_requestStatus), _projectAddress)
			.send({ from: this.props.account });
	}

	render() {
		const tableRef = React.createRef();
		const columns = [
			{ title: 'Title', field: 'title' },
			{ title: 'Description', field: 'description' },
			{ title: 'Project Status', field: 'status' },
			{ title: 'Request Status', field: 'requestStatus' },
		];

		return (
			<div>
                <Link to={`/projects`}>Go back</Link>
                <br/><br/>

                {
                    this.state.currentRequestStatus === true ?
                        <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            this.setRecordForEdit(this.state.project);
                            this.setCreateRequestForm(true);
                        }}>Add Project Request</Button>
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
			</div>
		);
	}
}

export default withRouter(ProjectRequests);
