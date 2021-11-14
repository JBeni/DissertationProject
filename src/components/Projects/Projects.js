import React, { Component, useState } from 'react';
import styled from 'styled-components';
import AddProjectModal from './AddProjectModal';
import FileUploadPage from './FileUploadPage';
import { ProjectCard } from './ProjectCard';

export default class Projects extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			projects: [],
		};

        this.props.project.methods.getProjectIds().call().then((result) => {
            console.log(result);
            result.map((projectId) => {
				this.props.project.methods.getProjectInfo(projectId).call()
					.then((result) => {
                        const project = {
                            index: result['index'],
                            name: result['name'],
                            description: result['description'],
                            status: result['projectStatus'],
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
				<FileUploadPage />

				<br />
				<br />

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
