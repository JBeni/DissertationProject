import React, { Component } from 'react';
import MaterialTable from '@material-table/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import * as applicationService from './../applicationService';
import { DialogContent, Typography, DialogTitle, Dialog, Button, Hidden } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import ViewProjectForm from './ViewProjectForm';
import AddProjectForm from './AddProjectForm';
import { Link } from 'react-router-dom';
const axios = require('axios');
const FormData = require('form-data');

//const _hashStringValue = process.env.REACT_APP_HASH_STRING_VALUE;

export default class Projects extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openPopup: false,
            openViewForm: false,
			recordForEdit: null,
			projects: [],
		};
        this.getProjects();



        this.test();

        //props.project.methods.changeProjectStatus("1", "0x7Da067967D147D37311F3b27c4c2277e4F7e22C0").send({ from: this.props.account });
        //props.project.methods.changeProjectStatus("2", "0x7Da067967D147D37311F3b27c4c2277e4F7e22C0").send({ from: this.props.account });
        //props.project.methods.changeProjectStatus("3", "0x7Da067967D147D37311F3b27c4c2277e4F7e22C0").send({ from: this.props.account });
        //props.project.methods.changeProjectStatus("4", "0x7Da067967D147D37311F3b27c4c2277e4F7e22C0").send({ from: this.props.account });

        //props.project.methods.changeProjectStatus("1", "0x57fF50619cf09c8e89E048d92813a6B5f1edF788").send({ from: this.props.account });
        //props.project.methods.changeProjectStatus("2", "0x57fF50619cf09c8e89E048d92813a6B5f1edF788").send({ from: this.props.account });
    }

    test = async () => {
        // let events = await this.props.project.getPastEvents('ProjectStatusChanged', {
        //     filter: { projectAddress: "0x7Da067967D147D37311F3b27c4c2277e4F7e22C0" },
        //     fromBlock: 0,
        //     toBlock: 'latest'
        // }, function(error, events) { console.log(events); })
        // .then(function(events) {
        //     console.log(events);
        // });

        let events = await this.props.project.getPastEvents('ProjectStatusChanged', {
            filter: { projectAddress: "0x7Da067967D147D37311F3b27c4c2277e4F7e22C0" },
            fromBlock: 0,
            toBlock: 'latest'
        });

        let data = [];
        events.map((result) => {
            let status = applicationService.projectStatusDropdown.find((element) => {
                return Number(element.id) === Number(result.returnValues.status)
            });
            const project = {
                index: result.returnValues.index,
                projectAddress: result.returnValues.projectAddress,
                status: status.value,
            };
            data.push(project);
            return false;
        });

        // events = events.filter((event) => {
        //     return event.returnValues.projectAddress === "0x7Da067967D147D37311F3b27c4c2277e4F7e22C0";
        // });
        console.log(data);
    }


    create = async () => {
        await this.props.project.methods
            .changeProjectStatus("2", "0x57fF50619cf09c8e89E048d92813a6B5f1edF788")
            .send({ from: this.props.account });
    }

    getProjects = async () => {
        let allProjects = await applicationService.getAllProjects(this.props);
        this.setState({ projects: allProjects });
    }

    setOpenPopup = (value) => {
		this.setState({ openPopup: value });
	};

    setOpenViewForm = (value) => {
        this.setState({ openViewForm: value });
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
        this.setState({ openPopup: value });
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
			.then(function (response) {
				console.log(response);
			})
			.catch(function (error) {
				console.error(error);
			});
	}

	render() {
		const tableRef = React.createRef();
		const columns = [
			{ title: 'Name', field: 'name' },
			{ title: 'Description', field: 'description' },
			{ title: 'Status', field: 'projectStatus' },
			{ title: 'IPFS CID', field: 'ipfsFileCID' },
		];

		return (
			<div>

                <Button
					variant="outlined"
					startIcon={<AddIcon />}
					onClick={() => {
						this.create();
					}}>TEsting New</Button>



				<Button
					variant="outlined"
					startIcon={<AddIcon />}
					onClick={() => {
						this.setOpenPopup(true);
						this.setRecordForEdit(null);
					}}>Add New</Button>

				<Dialog open={this.state.openPopup} maxWidth="md">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								Add Project Form
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setOpenPopup(false);
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
					icons={applicationService.materialTableIcons}
					columns={columns}
					data={this.state.projects}
					options={{ exportButton: true, actionsColumnIndex: -1 }}
					actions={[
						{
							icon: VisibilityIcon,
							tooltip: 'View Project',
							onClick: (event, rowData) => {
                                this.setOpenViewForm(true);
                                this.setRecordForEdit(rowData);
							},
						},
					]}
				/>

                <div className="container">
                    <div className="py-4">
                        <h1>Project Requests</h1>
                        <table className="table border shadow">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.projects.map((project, index) => (
                                    <tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{project.name}</td>
                                        <td>{project.description}</td>
                                        <td>{project.projectStatus}</td>
                                        <td>
                                            <Link className="btn btn-primary mr-2" to='/'>
                                                View
                                            </Link>
                                            <Link
                                                className="btn btn-outline-primary mr-2"
                                                to='/'
                                            >
                                                Edit
                                            </Link>
                                            <Link to='/'
                                                className="btn btn-danger"
                                                onClick={() => console.log(project)}
                                            >
                                                Delete
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

			</div>
		);
	}
}
