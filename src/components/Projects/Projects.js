import React, { Component } from 'react';
import { projectStatusDropdown } from './DefaultModal';
import MaterialTable from '@material-table/core';
import { VisibilityIcon } from '@material-ui/icons/Visibility';
import { materialTableIcons } from './../applicationService';
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
        }).catch(function (error) { console.log(error); });
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
                <MaterialTable
					title="Projects"
					tableRef={tableRef}
					icons={materialTableIcons}
					columns={columns}
					data={this.state.projects}
					options={{ exportButton: true, actionsColumnIndex: -1 }}
					actions={[
						{
							icon: VisibilityIcon,
							tooltip: 'View Project',
							onClick: (event, rowData) => {
                                console.log(rowData);
                                this.setOpenViewForm(true);
                                this.setRecordForEdit(rowData);
							},
						},
                    ]}
				/>
			</div>
		);
	}
}
