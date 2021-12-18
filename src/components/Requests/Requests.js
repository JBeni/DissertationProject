import React, { Component } from 'react';
import { materialTableIcons } from './../sharedResources';
import Visibility from '@material-ui/icons/Visibility';
import { Typography, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ViewRequest from './ViewRequest';
import MaterialTable from '@material-table/core';
import * as eventService from '../Services/eventService';

class Requests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewRequest: false,
			recordForView: null,
            requests: [],
        };
    }

    async componentDidMount() {
        await this.getAllRequests();
    }

    async getAllRequests() {
        const data = await Promise.resolve(eventService.getAllRequestEvents(this.props));
        this.setState({ requests: data });
    }

    setViewRequest = (value) => {
        this.setState({ viewRequest: value });
    }

	setRecordForView = (data) => {
		this.setState({ recordForView: data });
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
                        <ViewRequest web3={this.props.web3} recordForView={this.state.recordForView} />
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
