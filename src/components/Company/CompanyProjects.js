import React, { Component } from 'react';
import { materialTableIcons, downloadIpfsFile } from '../sharedResources';
import Visibility from '@material-ui/icons/Visibility';
import { Typography, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ViewCompanyProject from './ViewCompanyProject';
import MaterialTable from '@material-table/core';
import * as applicationService from '../Services/applicationService';
import * as eventService from '../Services/eventService';
import { Toaster } from 'react-hot-toast';
import { withRouter } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import HistoryIcon from '@mui/icons-material/History';
import CompanyReqHistory from './CompanyReqHistory';

class CompanyProjects extends Component {
	constructor(props) {
		super(props);
		this.state = {
            openViewForm: false,
			recordForEdit: null,
            openProjectReqHistory: false,

            projectReqHistory: [],
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
                        <CompanyReqHistory web3={this.props.web3} projectReqHistory={this.state.projectReqHistory} />
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
							tooltip: 'Project Req History',
							onClick: (event, rowData) => {
                                this.setOpenProjectReqHistory(true);
                                this.setProjectReqHistory(rowData);
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
