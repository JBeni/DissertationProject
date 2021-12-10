import React, { Component } from 'react';
import { materialTableIcons } from './../sharedResources';
import Visibility from '@material-ui/icons/Visibility';
import { Typography, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ViewRequest from './ViewRequest';
import MaterialTable from '@material-table/core';
import * as applicationService from '../Services/applicationService';
import HistoryIcon from '@mui/icons-material/History';
import * as eventService from '../Services/eventService';
import RequestHistory from './RequestHistory';

class Requests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewRequest: false,
            openRequestHistory: false,
			recordForView: null,
            requestHistory: [],
            requests: [],
        };
    }

    componentDidMount() {
        this.getAllRequests();
    }

    async getAllRequests() {
        const data = await Promise.resolve(applicationService.getAllRequests(this.props));
        this.setState({ requests: data });
    }

    setViewRequest = (value) => {
        this.setState({ viewRequest: value });
    }

	setRecordForView = (data) => {
		this.setState({ recordForView: data });
	}

    setOpenRequestHistory = (value) => {
        this.setState({ openRequestHistory: value });
        if (value === false) {
            this.setState({ requestHistory: [] });
        }
    }

    setRequestHistory = async (rowData) => {
        const data = await eventService.getRequestEvents(this.props, rowData.requestAddress);
        this.setState({ requestHistory: data });
    }

    render() {
        const tableRef = React.createRef();
        const columns = [
            { title: 'Title', field: 'title' },
            { title: 'Project Status', field: 'projectStatus' },
            { title: 'Request Status', field: 'requestStatus' },
            { title: 'Project Address', field: 'projectAddress' },
        ];

        return (
            <>
				<Dialog open={this.state.viewRequest} maxWidth="md">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								View Request Form
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setViewRequest(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers style={{ width: '700px' }}>
                        <ViewRequest recordForView={this.state.recordForView} />
                    </DialogContent>
				</Dialog>

				<Dialog open={this.state.openRequestHistory} fullWidth maxWidth="xl">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								View Request Changes
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setOpenRequestHistory(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers>
                        <RequestHistory web3={this.props.web3} requestHistory={this.state.requestHistory} />
                    </DialogContent>
				</Dialog>

                <br />
				<MaterialTable
					title="All Completed Requests"
					tableRef={tableRef}
					icons={materialTableIcons}
					columns={columns}
					data={this.state.requests}
					options={{
                        exportButton: true,
                        actionsColumnIndex: -1,
                        pageSize: 10,
                    }}
					actions={[
                        {
							icon: HistoryIcon,
							tooltip: 'View Request History',
							onClick: (event, rowData) => {
                                this.setOpenRequestHistory(true);
                                this.setRequestHistory(rowData);
							},
						},
                        {
							icon: Visibility,
							tooltip: 'View Request',
							onClick: (event, rowData) => {
                                this.setViewRequest(true);
                                this.setRecordForView(rowData);
							},
						},
					]}
				/>
            </>
        );
    }
}

export default Requests;
