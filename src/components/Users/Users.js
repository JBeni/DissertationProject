import React, { Component } from 'react';
import MaterialTable from '@material-table/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Dialog, Typography, DialogTitle, DialogContent } from '@material-ui/core';
import AddForm from './AddForm';
import * as applicationService from '../applicationService';
import ViewForm from './ViewForm';
import { materialTableIcons } from './../sharedResources';
import Edit from '@material-ui/icons/Edit';
import toast, { Toaster } from 'react-hot-toast';
import { TableCell, TableRow } from '@material-ui/core';

export default class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openPopup: false,
            openViewForm: false,
			recordForEdit: null,
			users: [],
		};
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers = async () => {
        let data = await applicationService.getAllUsers(this.props);
        this.setState({ users: data });
    }

    setOpenPopup = (value) => {
		this.setState({ openPopup: value });
	};

    setOpenViewForm = (value) => {
        this.setState({ openViewForm: value });
    }

	setRecordForEdit = (data) => {
		this.setState({ recordForEdit: data });
	}

    createUser = async (_username, _email, _firstname, _lastname, _role, _walletAddress) => {
        await this.props.project.methods
			.registerUser(
                _username,
                this.props.web3.utils.utf8ToHex(_email),
                this.props.web3.utils.utf8ToHex(_firstname),
                this.props.web3.utils.utf8ToHex(_lastname),
                Number(_role),
                _walletAddress
			)
			.send({ from: this.props.account })
            .then((response) => {
                this.notifyToastSuccess();
                this.getUsers();
            }).catch((error) => { this.notifyToastError(); });
	}

    changeUserRole = async (_role, _walletAddress) => {
        await this.props.project.methods.changeUserRole(
            Number(_role),
            _walletAddress
        ).send({ from: this.props.account }).then((receipt) => {
            this.getUsers();
        });
	}

    addOrEdit = (userData, resetForm) => {
        if (userData.isEditForm === false) {
   			// alert('Form is validated! Submitting the form...');
			this.createUser(
				userData.firstname + ' ' + userData.lastname,
				userData.email,
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

    notifyToastSuccess = () => {
        toast.success('User was stored successfully into the blockchain', {
            position: 'bottom-center',
            duration: 4000,
        });    
    }

    notifyToastError = () => {
        toast.error('The user couldnt be saved into the blockchain', {
            position: 'bottom-center',
            duration: 5000,
        });    
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
                                console.log(rowData);
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

    async verifySignature(buyerAddress, signature) {
        // let v = '0x' + signature.slice(130, 132).toString();
        // let r = signature.slice(0, 66).toString();
        // let s = '0x' + signature.slice(66, 130).toString();
        // let messageHash = web3.eth.accounts.hashMessage(address);
        // let verificationOutput = await supplyChain.methods.verify(buyerAddress, messageHash, v, r, s).call({ from: account });
        // if (verificationOutput) {
        //   alert('Buyer is verified successfully!');
        //   signature = prompt('Enter signature');
        //   supplyChain.methods.respondToEntity(buyerAddress, account, address, signature).send({ from: account })
        //   const data = await supplyChain.methods.getUserInfo(account).call();
        //   const role = data[ 'role' ];
        //   if (role === "1") {
        //     const rawMaterial = new web3.eth.Contract(RawMaterial.abi, address);
        //     rawMaterial.methods.updateManufacturerAddress(buyerAddress).send({ from: account });
        //     alert('Response sent to manufacturer');
        //   } else if (role === "3") {
        //     const medicine = new web3.eth.Contract(Medicine.abi, address);
        //     medicine.methods.updateWholesalerAddress(buyerAddress).send({ from: account });
        //     alert('Response sent to wholesaler');
        //   } else if (role === "4") {
        //     const medicine = new web3.eth.Contract(Medicine.abi, address);
        //     medicine.methods.updateDistributorAddress(buyerAddress).send({ from: account });
        //     alert('Response sent to distributor');
        //   } else {
        //     console.log('error');
        //   }
        // } else {
        //   alert('Buyer is not verified!');
        // }
    }
}
