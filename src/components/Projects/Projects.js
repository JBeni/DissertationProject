import React, { Component } from 'react';
import MaterialTable from '@material-table/core';
import * as applicationService from './../applicationService';
import { DialogContent, Typography, DialogTitle, Dialog, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import ViewProjectForm from './ViewProjectForm';
import AddProjectForm from './AddProjectForm';
import ProjectTable from './ProjectTable';
import Visibility from '@material-ui/icons/Visibility';
import { materialTableIcons } from './../sharedResources';
import { withRouter } from 'react-router-dom';
import AllPages from './AllPages';
import SinglePage from './SinglePage';

const axios = require('axios');
const FormData = require('form-data');

class Projects extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddForm: false,
            openViewForm: false,
            showTable: false,
			recordForEdit: null,
			projects: [],
        };
        this.getProjects();
    }

    test = async () => {
        let events = await this.props.project.getPastEvents('ProjectStatusChanged', {
            filter: { projectAddress: "0x7Da067967D147D37311F3b27c4c2277e4F7e22C0" },
            fromBlock: 0,
            toBlock: 'latest'
        });

        let data = [];
        events.map((result) => {
            let status = applicationService.getProjectStatusById(result.returnValues.status);
            const project = {
                index: result.returnValues.index,
                projectAddress: result.returnValues.projectAddress,
                status: status.value,
            };
            data.push(project);
            return false;
        });
    }

    getProjects = async () => {
        let allProjects = await applicationService.getAllProjects(this.props);
        this.setState({ projects: allProjects });
        console.log(this.state.projects);
    }

    setOpenAddForm = (value) => {
		this.setState({ openAddForm: value });
	};

    setOpenViewForm = (value) => {
        this.setState({ openViewForm: value });
    }

    setShowTable = (value) => {
        this.setState({ showTable: value });
    }

	setRecordForEdit = (data) => {
		this.setState({ recordForEdit: data });
	}

    uploadFileToPinata = (fileData) => {
        if (fileData.file.name?.length > 0) {
            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            let data = new FormData();

            let file= new Blob([fileData.file], {
                type: 'application/json',
            });

            data.append('file',  file, fileData.file.name);
            const metadata = JSON.stringify({
                name: fileData.file.name,
                type: fileData.file.type,
                sizeBytes: fileData.file.size,
                lastModifiedDate: fileData.file.lastModifiedDate
            });
            data.append('pinataMetadata', metadata);

            return axios.post(url, data, {
                maxBodyLength: 'Infinity',
                headers: {
                    'Content-Type': `multipart/form-data`,
                    pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
                    pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET
                }
            }).then(function (response) {
                return response.data.IpfsHash;
            }).catch(function (error) {
                console.error(error);
            });
        }
    }

    getFileCIDAfterUpload = async (userData) => {
        let ipfsFileCID = await Promise.resolve(this.uploadFileToPinata(userData));
        return ipfsFileCID;
    }

    addOrEdit = (userData, resetForm) => {
        console.log(userData);
        if (userData.isEditForm === false) {
   			// alert('Form is validated! Submitting the form...');
            let ipfsFileCID = this.getFileCIDAfterUpload(userData);
            this.createProject(
				userData['name'],
                userData['description'],
				userData['status'],
                ipfsFileCID
			);
        } else {
            ;//this.changeUserRole(userData['role'], userData['walletAddress']);
        }
        resetForm();
        this.setRecordForEdit(null);
        this.getProjects();
    }

    createProject = async (_name, _description, _status, _ipfsFileCID) => {
		await this.props.project.methods
			.createProject(_name, _description, Number(_status), _ipfsFileCID)
			.send({ from: this.props.account });
	};

    handleNewDataFromPopup(value) {
        this.setState({ openAddForm: value });
    }

	filterFilesFromPinataIpfs = () => {
		let queryString = '?';
		//queryString = queryString + `hashContains=${queryParams.hashContains}&`;
		//queryString = queryString + `status=pinned&`;
		const url = `https://api.pinata.cloud/data/pinList${queryString}`;
		axios.get(url, {
				headers: {
					pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
					pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
				},
			})
			.then(function (response) {})
			.catch(function (error) {console.error(error);});
	}

	render() {
		const tableRef = React.createRef();
		const columns = [
			{ title: 'Name', field: 'name' },
			{ title: 'Description', field: 'description' },
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
							icon: AddIcon,
							tooltip: 'Add Project Requests',
							onClick: (event, rowData) => {
                                this.props.history.push(`/projects/${Number(rowData.index)}`);
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

                <br /><br />
                <ProjectTable showTable={this.state.showTable} projects={this.state.projects} />

                {/* <LoaderCircle /> */}

                <br /><br />
                {/* <h4>Single Page</h4>
                <div>
                    <SinglePage pdf={'https://gateway.pinata.cloud/ipfs/QmZvoi8DB5M4HuLjRrhmbDhDQkF3TTFnM4mrgADJRrTCXu'} />
                </div> */}

                {/* <h4>All Pages</h4>
                <div className="all-page-container">
                    <AllPages pdf={'Files/comp-1801-w08-2021-22.pdf'} />
                </div> */}


			</div>
		);
	}
}

export default withRouter(Projects);
