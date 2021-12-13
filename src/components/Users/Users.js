import React, { Component } from 'react';
import MaterialTable from '@material-table/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Dialog, Typography, DialogTitle, DialogContent } from '@material-ui/core';
import AddForm from './AddForm';
import * as applicationService from '../Services/applicationService';
import ViewForm from './ViewForm';
import { materialTableIcons } from './../sharedResources';
import Edit from '@material-ui/icons/Edit';
import { Toaster } from 'react-hot-toast';
import * as eventService from '../Services/eventService';
import * as toasterService from '../Services/toasterService';
import UserHistory from './UserHistory';
import HistoryIcon from '@mui/icons-material/History';

export default class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openPopup: false,
            openViewForm: false,
            openUserHistory: false,
			recordForEdit: null,

            userHistory: [],
			users: [],
		};
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers = async () => {
        const data = await applicationService.getAllUsers(this.props);
        this.setState({ users: data });
    }

    setOpenPopup = (value) => {
		this.setState({ openPopup: value });
	}

    setOpenViewForm = (value) => {
        this.setState({ openViewForm: value });
    }

    setOpenUserHistory = (value) => {
        this.setState({ openUserHistory: value });
        if (value === false) {
            this.setState({ userHistory: [] });
        }
    }

	setRecordForEdit = (data) => {
		this.setState({ recordForEdit: data });
	}

    setUserHistory = async (rowData) => {
        const data = await eventService.getUserEvents(this.props, rowData.walletAddress);
        this.setState({ userHistory: data });
    }

    signData = (_walletAddress) => {
        const userPrivateKey = prompt('Please enter your private key to sign the transaction....');

        if (userPrivateKey === null) {
            toasterService.notifyToastError('Valid Private KEY required to sign the transaction.');
            return null;
        }

        try {
            return this.props.web3.eth.accounts.sign(_walletAddress, '0x' + userPrivateKey.trim());
        } catch (error) {
            toasterService.notifyToastError('Valid Private KEY required to sign the transaction.');
            return null;
        }
    }

    createUser = async (_firstname, _lastname, _role, _walletAddress) => {
        const signatureData = this.signData(_walletAddress);

        if (signatureData !== null) {
            await this.props.userChain.methods
			.registerUser(
                this.props.web3.utils.utf8ToHex(_firstname),
                this.props.web3.utils.utf8ToHex(_lastname),
                Number(_role),
                _walletAddress
			).send({ from: this.props.account })
            .then((response) => {
                toasterService.notifyToastSuccess('Create User operation was made successfully');
                this.getUsers();
            }).catch((error) => {
                toasterService.notifyToastError('Create User operation has failed');
            });
        }
	}

    changeUserRole = async (_role, _walletAddress) => {
        const signatureData = this.signData(_walletAddress);

        if (signatureData !== null) {
            await this.props.userChain.methods.changeUserRole(
                Number(_role),
                _walletAddress
            ).send({ from: this.props.account })
            .then((response) => {
                toasterService.notifyToastSuccess('Update User Role operation was made successfully');
                this.getUsers();
            })
            .catch((error) => {
                toasterService.notifyToastError('Update User Role operation has failed');
            });
        }
	}

    addOrEdit = (userData, resetForm) => {
        if (userData.isEditForm === false) {
			this.createUser(
				userData.firstname,
				userData.lastname,
				userData.role,
				userData.walletAddress
			);
        } else {
            this.changeUserRole(userData.role, userData.walletAddress);
        }
        resetForm();
        this.setRecordForEdit(null);
    }

    handleNewDataFromPopup(data) {
        this.setState({ openPopup: data });
    }

	render() {
        const tableRef = React.createRef();
		const columns = [
			{ title: 'First Name', field: 'firstname' },
			{ title: 'Last Name', field: 'lastname' },
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

				<Dialog open={this.state.openUserHistory} fullWidth maxWidth="xl">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								View User Changes
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setOpenUserHistory(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers>
                        <UserHistory userHistory={this.state.userHistory} />
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
                        {
                            icon: HistoryIcon,
                            tooltip: 'User History',
                            onClick: (event, rowData) => {
                                this.setOpenUserHistory(true);
                                this.setUserHistory(rowData);
                            },
                        },
						{
							icon: Edit,
							tooltip: 'Edit User',
							onClick: (event, rowData) => {
                                this.setOpenPopup(true);
                                this.setRecordForEdit(rowData);
							},
						},
						{
							icon: VisibilityIcon,
							tooltip: 'View User',
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
