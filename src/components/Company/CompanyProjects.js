import React, { Component } from 'react';
import { materialTableIcons } from '../sharedResources';
import Visibility from '@material-ui/icons/Visibility';
import Edit from '@material-ui/icons/Edit';
import { Typography, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ViewCompanyRequest from './ViewCompanyRequest';
import EditCompanyRequest from './EditCompanyRequest';
import MaterialTable from '@material-table/core';
import * as applicationService from '../Services/applicationService';
import { Toaster } from 'react-hot-toast';
import * as toasterService from '../Services/toasterService';

class CompanyProjects extends Component {
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
        this.getCompanyRequests();
    }

    async getCompanyRequests() {
        const data = await Promise.resolve(applicationService.getCompanyRequests(this.props));
        this.setState({ requests: data });
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
        this.updateProjectRequest(
            Number(data.index),
            data.comments,
            data.requestStatus,
            Number(data.indexProjectRequest),
            data.projectStatus,
            data.projectAddress,
            data.requestAddress
        );
        resetForm();
        this.setRecordForEdit(null);
    }

    signRequest = (_requestAddress) => {
        const userPrivateKey = prompt('Please enter your private key to sign the transaction....');

        if (userPrivateKey === null) {
            toasterService.notifyToastError('Valid Private KEY required to sign the transaction.');
            return null;
        }

        try {
            return this.props.web3.eth.accounts.sign(_requestAddress, '0x' + userPrivateKey);
        } catch (error) {
            toasterService.notifyToastError('Valid Private KEY required to sign the transaction.');
            return null;
        }
    }

    updateProjectRequest = async (_index, _comments, _requestStatus, _indexProjectRequest, _projectStatus, _projectAddress, _requestAddress) => {
        const signatureData = this.signRequest(_requestAddress);

        if (signatureData !== null) {
            await this.props.project.methods
                .updateRequest(
                    Number(_index), Number(_indexProjectRequest), _comments,
                    _requestStatus, _projectStatus,
                    _projectAddress, signatureData.signature
                ).send({ from: this.props.account })
                .then((response) => {
                    toasterService.notifyToastSuccess('Update Request operation was made successfully');
                    this.getCompanyRequests();
                })
                .catch((error) => {
                    toasterService.notifyToastError('Update Request operation has failed');
                });
        }
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
                        <EditCompanyRequest handleNewDataFromPopup={this.handleNewDataFromPopup.bind(this)} recordForEdit={this.state.recordForEdit} addOrEdit={this.addOrEdit} />
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
                        <ViewCompanyRequest recordForEdit={this.state.recordForEdit} />
                    </DialogContent>
				</Dialog>

                <br />
				<MaterialTable
					title="Requests For My Company"
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

export default CompanyProjects;
