import React, { Component } from 'react';
import { materialTableIcons, downloadIpfsFile } from '../sharedResources';
import Visibility from '@material-ui/icons/Visibility';
import { Typography, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ViewCompanyProject from './ViewCompanyProject';
import MaterialTable from '@material-table/core';
import * as applicationService from '../Services/applicationService';
import { Toaster } from 'react-hot-toast';
import { withRouter } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

class CompanyProjects extends Component {
	constructor(props) {
		super(props);
		this.state = {
            openViewForm: false,
			recordForEdit: null,
			projects: [],
        };
    }

    componentDidMount() {
        this.getProjectsByCompany();
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

    downloadFile = (filename, ipfsCID) => {
        downloadIpfsFile(filename, ipfsCID);
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
