import React, { Component } from 'react';
import MaterialTable from '@material-table/core';
import * as applicationService from '../Services/applicationService';
import { DialogContent, Typography, DialogTitle, Dialog, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import ViewProjectForm from './ViewProjectForm';
import AddProjectForm from './AddProjectForm';
import Visibility from '@material-ui/icons/Visibility';
import { materialTableIcons } from './../sharedResources';
import { withRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import * as eventService from '../Services/eventService';
import * as toasterService from '../Services/toasterService';
import * as roleService from '../Services/roleService';
import HistoryIcon from '@mui/icons-material/History';
import Edit from '@material-ui/icons/Edit';
import ProjectHistory from './ProjectHistory';
import ProjectReqHistory from './ProjectReqHistory';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import fileDownload from 'js-file-download';
import { create } from 'ipfs-http-client';

const axios = require('axios');
const clientIpfs = create('https://ipfs.infura.io:5001/api/v0');

class Projects extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddForm: false,
            openViewForm: false,
			recordForEdit: null,
            openProjectHistory: false,
            openProjectReqHistory: false,

            projectReqHistory: [],
            projectHistory: [],
			projects: [],
        };
    }

    async componentDidMount() {
        this.getProjectsByUser();
    }

    getProjectsByUser = async () => {
        const allProjects = await applicationService.getProjectsByUser(this.props);
        this.setState({ projects: allProjects });
    }

    setOpenAddForm = (value) => {
		this.setState({ openAddForm: value });
	};

    setOpenViewForm = (value) => {
        this.setState({ openViewForm: value });
    }

    setOpenProjectHistory = (value) => {
        this.setState({ openProjectHistory: value });
        if (value === false) {
            this.setState({ projectHistory: [] });
        }
    }

    setProjectHistory = async (rowData) => {
        const data = await eventService.getProjectEvents(this.props, rowData.projectAddress);
        this.setState({ projectHistory: data });
    }

    setOpenProjectReqHistory = (value) => {
        this.setState({ openProjectReqHistory: value });
        if (value === false) {
            this.setState({ projectReqHistory: [] });
        }
    }

    setProjectReqHistory = async (rowData) => {
        const data = await eventService.getProjectRequestEvents(this.props, rowData.projectAddress);
        this.setState({ projectReqHistory: data });
    }

	setRecordForEdit = (data) => {
		this.setState({ recordForEdit: data });
	}

    addOrEdit = (projectData, resetForm, bufferFile) => {
        if (projectData.isEditForm === false) {
            this.createProject(
				projectData.name,
				projectData.status,
                projectData.file,
                bufferFile
			);
        } else {
            this.updateProject(projectData.projectAddress, projectData.file, bufferFile);
        }
        resetForm();
        this.setRecordForEdit(null);
    }

    createUniqueProjectAddress = async (_name, _index) => {
        const data = await Promise.resolve(applicationService.createUniqueProjectAddress(this.props, _name, _index));
        return data;
    }

    signCreateProject = (_projectAddress) => {
        const userPrivateKey = prompt('Please enter your private key to sign the transaction....');

        if (userPrivateKey === null) {
            toasterService.notifyToastError('Valid Private KEY required to sign the transaction.');
            return null;
        }

        try {
            return this.props.web3.eth.accounts.sign(_projectAddress, '0x' + userPrivateKey.trim());
        } catch (error) {
            toasterService.notifyToastError('Valid Private KEY required to sign the transaction.');
            return null;
        }
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

    uploadFileIpfs = async (buffer) => {
        const ipfsResult = await clientIpfs.add(buffer);
        return ipfsResult;
    }

    createProject = async (_name, _status, _fileData, _bufferFile) => {
        const projectAddress = await this.createUniqueProjectAddress(_name, new Date().getTime());
        const signatureData = this.signCreateProject(projectAddress);

        if (signatureData !== null) {
            const _ipfsCID = await Promise.resolve(this.uploadFileIpfs(_bufferFile));

            await this.props.project.methods
                .createProject(
                    projectAddress,
                    _name,
                    Number(_status),
                    _ipfsCID.path,
                    signatureData.signature
                ).send({ from: this.props.account })
                .then((response) => {
                    toasterService.notifyToastSuccess('Create Project operation was made successfully');
                    this.getProjectsByUser();
                })
                .catch((error) => {
                    toasterService.notifyToastError('Create Project operation has failed');
                });
        }
	}

    updateProject = async (_projectAddress, _fileData, _bufferFile) => {
        const signatureData = this.signCreateProject(_projectAddress);

        if (signatureData !== null) {
            const _ipfsCID = await Promise.resolve(this.uploadFileIpfs(_bufferFile));
            await this.props.project.methods
                .updateProject(
                    _projectAddress,
                    _ipfsCID.path,
                    signatureData.signature
                ).send({ from: this.props.account })
                .then((response) => {
                    toasterService.notifyToastSuccess('Update Project operation was made successfully');
                    this.getProjectsByUser();
                })
                .catch((error) => {
                    toasterService.notifyToastError('Update Project operation has failed');
                });
        }
	}

    handleNewDataFromPopup(value) {
        this.setState({ openAddForm: value });
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
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        this.setOpenAddForm(true);
                        this.setRecordForEdit(null);
                }}>Add New</Button>

                <Dialog open={this.state.openAddForm} maxWidth="md">
                    <DialogTitle>
                        <div style={{ display: 'flex' }}>
                            <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                                Add Project Form
                            </Typography>
                            <Button color="secondary" onClick={() => {
                                    this.setOpenAddForm(false);
                                }}><CloseIcon />
                            </Button>
                        </div>
                    </DialogTitle>
                    <DialogContent dividers style={{ width: '700px' }}>
                        <AddProjectForm handleNewDataFromPopup={this.handleNewDataFromPopup.bind(this)} recordForEdit={this.state.recordForEdit} addOrEdit={this.addOrEdit} />
                    </DialogContent>
                </Dialog>

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
                        <ViewProjectForm recordForEdit={this.state.recordForEdit} />
                    </DialogContent>
				</Dialog>

				<Dialog open={this.state.openProjectHistory} fullWidth maxWidth="xl">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								View Project Changes
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setOpenProjectHistory(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers>
                        <ProjectHistory web3={this.props.web3} signatureChain={this.props.signatureChain}  projectHistory={this.state.projectHistory} />
                    </DialogContent>
				</Dialog>

				<Dialog open={this.state.openProjectReqHistory} fullWidth maxWidth="xl">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								View Project Request Changes
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setOpenProjectReqHistory(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers>
                        <ProjectReqHistory web3={this.props.web3} signatureChain={this.props.signatureChain} projectReqHistory={this.state.projectReqHistory} />
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
							icon: HistoryIcon,
							tooltip: 'Project History',
							onClick: (event, rowData) => {
                                this.setOpenProjectHistory(true);
                                this.setProjectHistory(rowData);
							},
						},
						{
							icon: HistoryIcon,
							tooltip: 'Project Req History',
							onClick: (event, rowData) => {
                                this.setOpenProjectReqHistory(true);
                                this.setProjectReqHistory(rowData);
							},
						},
						{
							icon: Edit,
							tooltip: 'Edit Project',
							onClick: (event, rowData) => {
                                this.setOpenAddForm(true);
                                this.setRecordForEdit(rowData);
							},
						},
                        {
							icon: AddIcon,
							tooltip: 'Go to Project Requests',
							onClick: (event, rowData) => {
                                this.props.history.push(`/projects/${rowData.projectAddress}`);
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

export default withRouter(Projects);
