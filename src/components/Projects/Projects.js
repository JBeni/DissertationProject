import React, { Component } from 'react';
import MaterialTable from '@material-table/core';
import * as applicationService from '../Services/applicationService';
import { DialogContent, Typography, DialogTitle, Dialog, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import ViewProjectForm from './ViewProjectForm';
import AddProjectForm from './AddProjectForm';
import ProjectTable from './ProjectTable';
import Visibility from '@material-ui/icons/Visibility';
import { materialTableIcons } from './../sharedResources';
import { withRouter } from 'react-router-dom';

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
            selecteProjectAddress: '',
			projects: [],
        };
    }

    componentDidMount() {
        this.getProjects();
    }

    getProjects = async () => {
        let allProjects = await applicationService.getAllProjects(this.props);
        this.setState({ projects: allProjects });
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

    setSelectedProjectAddress = (value) => {
        this.setState({ selecteProjectAddress: value });
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

    addOrEdit = (userData, resetForm) => {
        if (userData.isEditForm === false) {
   			// alert('Form is validated! Submitting the form...');
            this.createProject(
				userData.name,
				userData.status,
                userData
			);
        } else {
            ;//this.updateProject(userData.walletAddress);
        }
        resetForm();
        this.setRecordForEdit(null);
    }

    createUniqueProjectAddress = async () => {
        const data = await Promise.resolve(applicationService.createUniqueProjectAddress(this.props));
        return data;
    }

    signCreateProject = (_projectAddress) => {
        const userPrivateKey = prompt('Please enter your private key to sign the transaction....');
        return this.props.web3.eth.accounts.sign(_projectAddress, '0x' + userPrivateKey);
    }

    createProject = async (_name, _status, _fileData) => {
        //let _ipfsFileCID = await Promise.resolve(this.uploadFileToPinata(_fileData));
        let _ipfsFileCID = 'QmddchiYMQGZYLZf86jhyhkxRqrGfpBNr53b4oiV76q6aq';
        const projectAddress = await this.createUniqueProjectAddress();
        const signatureData = this.signProjectRequest(projectAddress);

        await this.props.project.methods
			.createProject(
                projectAddress,
                this.props.web3.utils.utf8ToHex(_name),
                Number(_status),
                _ipfsFileCID,
                signatureData.signature
            ).send({ from: this.props.account }).then((receipt) => {
                this.getProjects();
            });
	}

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
                                this.setSelectedProjectAddress(rowData.projectAddress);
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
