import React, { Component } from 'react';
import { materialTableIcons, signEntityByUser, downloadIpfsFile, testUserPrivateKey } from './../sharedResources';
import Visibility from '@material-ui/icons/Visibility';
import { Typography, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ViewRequest from './ViewRequest';
import EditRequest from './EditRequest';
import MaterialTable from '@material-table/core';
import * as applicationService from '../Services/applicationService';
import { Toaster } from 'react-hot-toast';
import * as toasterService from '../Services/toasterService';
import Edit from '@material-ui/icons/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

class Supervisor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editRequest: false,
            viewRequest: false,
			recordForEdit: null,
            requests: [],
        };
    }

    componentDidMount() {
        this.getSupervisorRequests();
    }

    getSupervisorRequests = async () => {
        const data = await Promise.resolve(applicationService.getSupervisorRequests(this.props));
        this.setState({ requests: data });
    }

    handleNewDataFromPopup = (value) => {
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
        this.updateRequest(
            data.comments,
            data.requestStatus,
            data.projectStatus,
            data.projectAddress,
            data.requestAddress
        );
        resetForm();
        this.setRecordForEdit(null);
    }

    updateRequest = async (_comments, _requestStatus, _projectStatus, _projectAddress, _requestAddress) => {
        const signatureData = signEntityByUser(_requestAddress, this.props);
        const verification = await testUserPrivateKey(this.props, _requestAddress, this.props.account, signatureData.signature);

        if (signatureData !== null && verification === true) {
            await this.props.project.methods
                .updateSupervisorRequest(
                    _comments,
                    _requestStatus, _projectStatus,
                    _projectAddress, _requestAddress,
                    signatureData.signature
                ).send({ from: this.props.account })
                .then((response) => {
                    toasterService.notifyToastSuccess('Update Request operation was made successfully');
                    this.getSupervisorRequests();
                })
                .catch((error) => {
                    toasterService.notifyToastError('Update Request operation has failed');
                });
        }
	}

    downloadFile = async (_projectAddress) => {
        const project = await applicationService.getProjectInfo(this.props, _projectAddress)
        downloadIpfsFile(project.name, project.ipfsFileCID);
    }

    render() {
        const tableRef = React.createRef();
        const columns = [
            { title: 'Title', field: 'title' },
            { title: 'Project Status', field: 'projectStatus' },
            { title: 'Request Status', field: 'requestStatus' },
            { title: 'Project Address', field: 'projectAddress' },
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
							icon: PictureAsPdfIcon,
							tooltip: 'Download Project File',
							onClick: (event, rowData) => {
                                this.downloadFile(rowData.projectAddress);
							},
						},
                        {
                            icon: Edit,
                            tooltip: 'Edit Request',
                            onClick: (event, rowData) => {
                                this.setEditRequest(true);
                                this.setRecordForEdit(rowData);
                            }
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

                <Toaster position="bottom-center" reverseOrder={false} />
            </>
        );
    }
}

export default Supervisor;
