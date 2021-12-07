import React, { Component } from 'react';
import { materialTableIcons } from './../sharedResources';
import Visibility from '@material-ui/icons/Visibility';
import { Typography, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ViewRequest from './ViewRequest';
import MaterialTable from '@material-table/core';
import * as applicationService from '../Services/applicationService';

class Requests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewRequest: false,
			recordForView: null,
            requests: [],
        };
    }

    componentDidMount() {
        this.getAllRequests();
    }

    async getAllRequests() {
        let data = await Promise.resolve(applicationService.getAllRequests(this.props));
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
                        <ViewRequest recordForView={this.state.recordForView} />
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
