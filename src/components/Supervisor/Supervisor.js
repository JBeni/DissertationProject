import React, { Component } from 'react';
import { materialTableIcons } from './../sharedResources';
import Visibility from '@material-ui/icons/Visibility';
import { Typography, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import ViewRequest from './ViewRequest';
import EditRequest from './EditRequest';
import MaterialTable from '@material-table/core';
import { getSupervisorRequests } from '../applicationService';
import AllPagesPdf from '../PdfViewer/AllPagesPdf';

class Supervisor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editRequest: false,
            showPdf: false,
            viewRequest: false,
			recordForEdit: null,
            requests: [],
        };
    }

    componentDidMount() {
        this.getSupervisorRequests();
    }

    async getSupervisorRequests() {
        let data = await Promise.resolve(getSupervisorRequests(this.props));
        this.setState({ requests: data });
    }

    handleNewDataFromPopup(value) {
        this.setState({ editRequest: value });
    }

    setShowPdf = (value) => {
        this.setState({ showPdf: value });
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
        this.updateProjectRequest(
            data.index,
            data.comments,
            data.requestStatus,
            data.indexProjectRequest,
            data.projectStatus,
            data.projectAddress
        );
        resetForm();
        this.setRecordForEdit(null);
    }

    updateProjectRequest = async (_index, _comments, _requestStatus, _indexProjectRequest, _projectStatus, _projectAddress) => {
        await this.props.project.methods
			.updateRequest(
                Number(_index),
                _comments,
                Number(_requestStatus),
                Number(_indexProjectRequest),
                _projectStatus,
                _projectAddress
            ).send({ from: this.props.account }).then((receipt) => {
                this.getSupervisorRequests();
            });
	}

    render() {
        const tableRef = React.createRef();
        const columns = [
            { title: 'Title', field: 'title' },
            { title: 'Project Status', field: 'projectStatus' },
            { title: 'Request Status', field: 'requestStatus' },
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
					title="Requests For Supervisor"
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
                            }
						},						{
							icon: Visibility,
							tooltip: 'View Request',
							onClick: (event, rowData) => {
                                this.setViewRequest(true);
                                this.setRecordForEdit(rowData);
							},
						},
					]}
				/>

                <br/><br/>
                <AllPagesPdf showPdf={this.state.showPdf} />
            </>
        );
    }
}

export default Supervisor;
