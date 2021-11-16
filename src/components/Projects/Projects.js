import React, { Component } from 'react';
import { projectStatusDropdown } from './DefaultModal';
import ProjectPopup from './ProjectPopup';
import { materialTableIcons } from './../Users/Users';
import MaterialTable from '@material-table/core';
import Edit from '@material-ui/icons/Edit';
import * as projectService from './projectService';
import AddIcon from '@material-ui/icons/Add';
import { Button } from '@material-ui/core';
import AddProjectModal from './AddProjectModal';
import DefaultModal from './DefaultModal';
import NewModal from './NewModal';

const axios = require('axios');

export default class Projects extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
            openPopup: false,
            recordForEdit: null,

            records: [],
			projects: [],
		};
        this.getProjects();
	}

    addOrEdit = (employee, resetForm) => {
        if (employee.id === 0){
            ;//employeeService.insertEmployee(employee)
        } else {
            ;//employeeService.updateEmployee(employee)
        }
        resetForm()
        this.setState({ recordForEdit: null });
        this.setState({ openPopup: false });
        this.setState({ records: projectService.getAllProjects() });
    }

    getProjects = async () => {
        await this.props.project.methods.getAllProjects().call().then((result) => {
            result.map((result) => {
                let status = projectStatusDropdown.find((element) => {
                    return Number(element.id) === Number(result['projectStatus']);
                });
                let project = {
                    index: result['index'],
                    name: result['name'],
                    description: result['description'],
                    projectStatus: status.value,
                    ipfsFileCID: result['ipfsFileCID']
                };
                this.setState({ projects: [...this.state.projects, project] });
                return false;
            });
        }).catch(function (error) {
            console.log(error);
        });
    }

	handleClickOpen() {
		this.seState({ open: true });
	}

	handleClose = (event, reason) => {
		if (reason === 'backdropClick') {
			return false;
		}
		this.seState({ open: false });
	};

	filterFilesFromPinataIpfs = () => {
		let queryString = '?';
		// queryString = queryString + `hashContains=${queryParams.hashContains}&`;
		// queryString = queryString + `status=pinned&`;
		// queryString = queryString + `metadata[name]=${queryParams.nameContains}&`;
		const url = `https://api.pinata.cloud/data/pinList${queryString}`;
		axios
			.get(url, {
				headers: {
					pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
					pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
				},
			})
			.then(function (response) {
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	getProject = async () => {
		await this.props.project.methods
			.getProjectInfo(0)
			.call()
			.then((result) => {
				const project = {
					index: result['index'],
					name: result['name'],
					description: result['description'],
					status: result['projectStatus'],
				};
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
			<div className="min-h-screen bg-gray-100 text-gray-900">
				{/* <DefaultModal
					account={this.props.account}
					project={this.props.project}
					web3={this.props.web3}
				/> */}

                <NewModal />


                {/* <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                />
                <label htmlFor="raised-button-file">
                <Button variant="raised" component="span">
                    Upload
                </Button>
                </label> 
                <br /><br /><br />
                <Button
                    text="Add New"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => { this.setState({ openPopup: true }); this.setState({ recordForEdit: null })}}
                >Add New Project</Button>
                <ProjectPopup
                    title="Project Form"
                    openPopup={this.state.openPopup}
                    setOpenPopup={this.setState}
                >
                    <AddProjectModal recordForEdit={this.state.recordForEdit} addOrEdit={this.addOrEdit} />
                </ProjectPopup> */}

                <MaterialTable
					title="Projects"
					tableRef={tableRef}
					icons={materialTableIcons}
					columns={columns}
					data={this.state.projects}
					options={{ exportButton: true, actionsColumnIndex: -1 }}
					actions={[
						{
							icon: Edit,
							tooltip: 'Edit',
							isFreeAction: true,
							onClick: (event, rowData) => {
								console.log('You want to delete ', rowData)
                            },
							position: 'auto',
						},
                    ]}
				/>
			</div>
		);
	}
}
