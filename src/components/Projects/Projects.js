import React, { Component } from 'react';
import AddProjectModal from './AddProjectModal';
import MTable from './MTable';
const axios = require('axios');

export default class Projects extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			projects: [],
		};
        this.getProjects();
	}

    getProjects = async () => {
        await Promise.resolve(
            this.props.project.methods.getProjectIds().call().then((result) => {
				result.map((projectId) => {
					this.props.project.methods
						.getProjectInfo(projectId)
						.call()
						.then((result) => {
							const project = {
								index: result['index'],
								name: result['name'],
								description: result['description'],
								status: result['projectStatus'],
								ipfsFileCID: result['ipfsFileCID'],
							};
							this.setState({ projects: [...this.state.projects, project] });
                            console.log(this.state.projects);
                        });
                    return true;
                });
			})
        );
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
		return (
			<div className="min-h-screen bg-gray-100 text-gray-900">
				<AddProjectModal
					account={this.props.account}
					project={this.props.project}
					web3={this.props.web3}
				/>


                <MTable
					account={this.props.account}
					project={this.props.project}
					web3={this.props.web3}
                />


			</div>
		);
	}
}
