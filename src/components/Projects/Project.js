import React, { Component } from 'react';
import MaterialTable from '@material-table/core';
import * as applicationService from '../applicationService';
import { DialogContent, Typography, DialogTitle, Dialog, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import ViewProjectForm from './ViewProjectForm';
import AddProjectForm from './AddProjectForm';
import Visibility from '@material-ui/icons/Visibility';
import { materialTableIcons } from '../sharedResources';
import { Link } from 'react-router-dom';

export default class Project extends Component {
	constructor(props) {
		super(props);
		this.state = {
			createRequestForm: false,
            viewRequestForm: false,
			recordForEdit: null,
			projects: [],
		};
        this.getProjectRequests();
    }

    getProjectRequests = async () => {
        let allProjects = await applicationService.getAllProjects(this.props);
        this.setState({ projects: allProjects });
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

    createProject = async (_name, _description, _status, _ipfsFileCID) => {
		await this.props.project.methods
			.createProject(_name, _description, Number(_status), _ipfsFileCID)
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

				<Button
					variant="outlined"
					startIcon={<AddIcon />}
					onClick={() => {
						this.setCreateRequestForm(true);
						this.setRecordForEdit(null);
					}}>Add New Request</Button>

				<Dialog open={this.state.createRequestForm} maxWidth="md">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								Add Request Form
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setCreateRequestForm(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers style={{ width: '700px' }}>
                        <AddProjectForm />
                    </DialogContent>
				</Dialog>

				<Dialog open={this.state.viewRequestForm} maxWidth="md">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								View Request Form
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setOpenViewForm(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers style={{ width: '700px' }}>
                        <ViewProjectForm recordForEdit={this.state.recordForEdit} />
                    </DialogContent>
				</Dialog>

				<br /><br />
				<MaterialTable
					title="Project Requests"
					tableRef={tableRef}
					icons={materialTableIcons}
					columns={columns}
					data={this.state.projects}
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
