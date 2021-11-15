import React, { Component } from 'react';
import styled from 'styled-components';
import AddProjectModal from './AddProjectModal';
import { ProjectCard } from './ProjectCard';
const axios = require('axios');

export default class Projects extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			projects: [],
		};

        this.props.project.methods.getProjectIds().call().then((result) => {
            result.map((projectId) => {
				this.props.project.methods.getProjectInfo(projectId).call()
					.then((result) => {
                        const project = {
                            index: result['index'],
                            name: result['name'],
                            description: result['description'],
                            status: result['projectStatus'],
                            ipfsFileCID: result['ipfsFileCID'],
                            //identifier: props.web3.utils.hexToAscii(result['identifier'])
                        };
						this.setState({ projects: [...this.state.projects, project] });
                    });
				return false;
			});
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
                    pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET
                }
            }).then(function (response) { console.log(response); })
            .catch(function (error) { console.log(error); });
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
					//identifier: props.web3.utils.hexToAscii(result['identifier'])
				};
			});
	}

	render() {
		return (
			<div className="App">
				<AddProjectModal
					account={this.props.account}
					project={this.props.project}
					web3={this.props.web3}
				/>

				<br />
				<br />

				<Container>
					<Title> Super Mario World Collection </Title>
					<Subtitle> The rarest and best of Super Mario World </Subtitle>
					<Grid>
						{this.state.projects.map((project, key) => (
							<ProjectCard nft={project} key={key} />
						))}
					</Grid>
				</Container>
				{/* {showModal && (
                        <NFTModal nft={selectedNft} toggleModal={() => toggleModal()} />
                    )} */}
			</div>
		);
	}
}

const Title = styled.h1`
	margin: 0;
	text-align: center;
`;

const Subtitle = styled.h4`
	color: gray;
	margin-top: 0;
	text-align: center;
`;

const Container = styled.div`
	width: 70%;
	max-width: 1200px;
	margin: auto;
	margin-top: 100px;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	row-gap: 40px;

	@media (max-width: 1200px) {
		grid-template-columns: 1fr 1fr 1fr;
	}

	@media (max-width: 900px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (max-width: 600px) {
		grid-template-columns: 1fr;
	}
`;
