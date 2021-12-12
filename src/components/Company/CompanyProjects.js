import React, { Component } from 'react';
import { materialTableIcons } from '../sharedResources';
import Visibility from '@material-ui/icons/Visibility';
import { Typography, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ViewCompanyProject from './ViewCompanyProject';
import MaterialTable from '@material-table/core';
import * as applicationService from '../Services/applicationService';
import { Toaster } from 'react-hot-toast';
import * as roleService from '../Services/roleService';
import fileDownload from 'js-file-download';
import { withRouter } from 'react-router-dom';
import { AddIcon } from '@material-ui/icons/Add';
import { PictureAsPdfIcon } from '@mui/icons-material/PictureAsPdf';

const axios = require('axios');

class CompanyProjects extends Component {
	constructor(props) {
		super(props);
		this.state = {
            openViewForm: false,
			recordForEdit: null,
            companyRole: null,

			projects: [],
        };
    }

    async componentDidMount() {
        this.getProjectsByCompany();

        const companyRole = await roleService.getUserProjectRole(this.props);
        this.setState({ companyRole: companyRole });
    }

    getProjectsByCompany = async () => {
        const allProjects = await applicationService.getProjectsByCompany(this.props);
        this.setState({ projects: allProjects });
    }

    setOpenViewForm = (value) => {
        this.setState({ openViewForm: value });
    }

	setRecordForEdit = (data) => {
		this.setState({ recordForEdit: data });
	}

    downloadIpfsFile = async (filename, ipfsCID) => {
        const url = `https://ipfs.io/ipfs/${ipfsCID}`;
        axios.get(url, {
            responseType: 'blob',
        })
        .then((res) => {
            fileDownload(res.data, filename + ".pdf");
        });
    }

	render() {
		const tableRef = React.createRef();
		const columns = [
			{ title: 'Name', field: 'name' },
			{ title: 'Status', field: 'status' },
			{ title: 'IPFS CID', field: 'ipfsFileCID' },
		];

		return (
			<div>
				<Dialog open={this.state.openViewForm} maxWidth="md">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								View Project Form
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setOpenViewForm(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers style={{ width: '700px' }}>
                        <ViewCompanyProject recordForEdit={this.state.recordForEdit} />
                    </DialogContent>
				</Dialog>

				<br /><br />
				<MaterialTable
					title="Projects"
					tableRef={tableRef}
					icons={materialTableIcons}
					columns={columns}
					data={this.state.projects}
					options={{ exportButton: true, actionsColumnIndex: -1 }}
					actions={[
                        {
							icon: PictureAsPdfIcon,
							tooltip: 'Download File',
							onClick: (event, rowData) => {
                                this.downloadIpfsFile(rowData.name, rowData.ipfsFileCID);
							},
						},
                        {
							icon: AddIcon,
							tooltip: 'Go to Project Requests',
							onClick: (event, rowData) => {
                                this.props.history.push(`/company/${rowData.projectAddress}`);
							},
						},
                        {
							icon: Visibility,
							tooltip: 'View Project',
							onClick: (event, rowData) => {
                                this.setOpenViewForm(true);
                                this.setRecordForEdit(rowData);
							},
						},
					]}
				/>

                <Toaster position="bottom-center" reverseOrder={false} />
			</div>
		);
	}
}

export default withRouter(CompanyProjects);





/*
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
*/
