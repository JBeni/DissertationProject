import React, { Component } from 'react';
import MaterialTable from '@material-table/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Dialog, Typography, DialogTitle, DialogContent } from '@material-ui/core';
import AddForm from './AddForm';
import * as applicationService from '../applicationService';
import ViewForm from './ViewForm';
import { materialTableIcons } from './../applicationService';

export default class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openPopup: false,
            openViewForm: false,
			recordForEdit: null,

			users: [],
		};

        this.getUsers();
    }

    getUsers = async () => {
        let allUsers = await applicationService.getAllUsers(this.props);
        this.setState({ users: allUsers });
    }

    setOpenPopup = (value) => {
		this.setState({ openPopup: value });
	};

    setOpenViewForm = (value) => {
        this.setState({ openViewForm: value });
    }

	setRecordForEdit = (data) => {
		this.setState({ recordForEdit: data });
	};

    
	createUser = async (_username, _email, _firstname, _lastname, role, walletAddress) => {
        await this.props.project.methods
			.registerUser(
                _username,
                _email,
                _firstname,
                _lastname,
                Number(role),
                walletAddress
			)
			.send({ from: this.props.account })
            .then(function(receipt) {
                //console.log(receipt);
            });
	}

    changeUserRole = async (_role, _walletAddress) => {
        await this.props.project.methods.changeUserRole(
            Number(_role),
            _walletAddress
        ).send({ from: this.props.account })
        .then(function(receipt) {
            //console.log(receipt);
        });
        //this.getUsers();
	}

    addOrEdit = (userData, resetForm) => {
        if (userData.isEditForm === false) {
   			// alert('Form is validated! Submitting the form...');
			this.createUser(
				userData['firstname'] + ' ' + userData['lastname'],
				userData['email'],
				userData['firstname'],
				userData['lastname'],
				userData['role'],
				userData['walletAddress']
			);
        } else {
            console.log(userData);
            this.changeUserRole(userData['role'], userData['walletAddress']);
        }
        resetForm();
        this.setRecordForEdit(null);
        this.setState({ users: applicationService.getAllUsers(this.props) });
    }

    handleNewDataFromPopup(data) {
        this.setState({ openPopup: data });
    }

	render() {
		const tableRef = React.createRef();
		const columns = [
			{ title: 'Username', field: 'username' },
			{ title: 'Email', field: 'email' },
			{ title: 'Role', field: 'role' },
		];

		return (
			<div>
				<Button
					variant="outlined"
					startIcon={<AddIcon />}
					onClick={() => {
						this.setOpenPopup(true);
						this.setRecordForEdit(null);
					}}>Add New</Button>

				<Dialog open={this.state.openPopup} maxWidth="md">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								Add User Form
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setOpenPopup(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers style={{ width: '700px' }}>
                        <AddForm handleNewDataFromPopup={this.handleNewDataFromPopup.bind(this)} recordForEdit={this.state.recordForEdit} addOrEdit={this.addOrEdit} />
                    </DialogContent>
				</Dialog>

				<Dialog open={this.state.openViewForm} maxWidth="md">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								View User Form
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setOpenViewForm(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers style={{ width: '700px' }}>
                        <ViewForm recordForEdit={this.state.recordForEdit} />
                    </DialogContent>
				</Dialog>

				<br /><br />
				<MaterialTable
					title="Users"
					tableRef={tableRef}
					icons={materialTableIcons}
					columns={columns}
					data={this.state.users}
					options={{ exportButton: true, actionsColumnIndex: -1 }}
					actions={[
						// {
						// 	icon: Edit,
						// 	tooltip: 'Edit User',
						// 	onClick: (event, rowData) => {
                        //         this.setOpenPopup(true);
                        //         this.setRecordForEdit(rowData);
						// 	},
						// },
						{
							icon: VisibilityIcon,
							tooltip: 'View User',
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
