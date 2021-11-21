import React, { Component } from 'react';
import { materialTableIcons } from './../sharedResources';
import Visibility from '@material-ui/icons/Visibility';
import Edit from '@material-ui/icons/Edit';
import { Typography, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ViewRequest from './ViewRequest';
import EditRequest from './EditRequest';
import MaterialTable from '@material-table/core';
import { getAllRequests } from '../applicationService';

class Supervisor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editRequest: false,
            viewRequest: false,
			recordForEdit: null,

            project: {},
            requests: [],
        };
    }

    componentDidMount() {
        this.getAllRequests();
    }

    async getAllRequests() {
        let data = await Promise.resolve(getAllRequests(this.props));
        this.setState({ requests: data });
        console.log(data);
    }

    handleNewDataFromPopup(value) {
        this.setState({ editRequest: value });
    }

    setEditRequest = (value) => {
		this.setState({ editRequest: value });
	}

    setViewRequest = (value) => {
        this.setState({ viewRequest: value });
    }

	setRecordForEdit = (data) => {
		this.setState({ recordForEdit: data });
	}

    addOrEdit = async (data, resetForm) => {
        this.createProjectRequest(
            data['title'],
            data['status'],
            data['requestStatus'],
            this.state.project.projectAddress
        );
        resetForm();
        this.setRecordForEdit(null);
        this.getAllProjectRequests();
    }

    updateProjectRequest = async (_title, _status, _requestStatus, _projectAddress) => {
        await this.props.project.methods
			.updateProjectRequest(_title, Number(_status), Number(_requestStatus), _projectAddress)
			.send({ from: this.props.account });
	}

    render() {
        const tableRef = React.createRef();
        const columns = [
            { title: 'Title', field: 'title' },
            { title: 'Request Status', field: 'requestStatus' },
            { title: 'Project Status', field: 'projectStatus' },
            { title: 'Project Address', field: 'projectAddress' },
            //{ title: 'User Address', field: 'userAddress' },
        ];

        return (
            <>
				<Dialog open={this.state.editRequest} maxWidth="md">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								Edit Request Form
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setEditRequest(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers style={{ width: '700px' }}>
                        <EditRequest handleNewDataFromPopup={this.handleNewDataFromPopup.bind(this)} recordForEdit={this.state.recordForEdit} addOrEdit={this.addOrEdit} />
                    </DialogContent>
				</Dialog>

				<Dialog open={this.state.viewRequest} maxWidth="md">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								View Request Form
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setViewRequest(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers style={{ width: '700px' }}>
                        <ViewRequest recordForEdit={this.state.recordForEdit} />
                    </DialogContent>
				</Dialog>

                <br />
				<MaterialTable
					title="Supervisor"
					tableRef={tableRef}
					icons={materialTableIcons}
					columns={columns}
					data={this.state.requests}
					options={{ exportButton: true, actionsColumnIndex: -1 }}
					actions={[
                        {
							icon: Edit,
							tooltip: 'Edit Request',
							onClick: (event, rowData) => {
                                this.setEditRequest(true);
                                this.setRecordForEdit(rowData);
							},
						},
						{
							icon: Visibility,
							tooltip: 'View Request',
							onClick: (event, rowData) => {
                                this.setViewRequest(true);
                                this.setRecordForEdit(rowData);
							},
						},
					]}
				/>
            </>
        );
    }
}

export default Supervisor;
