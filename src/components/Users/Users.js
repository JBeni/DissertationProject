import React, { Component } from 'react';
import MaterialTable from '@material-table/core';

import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddUserModal, { roleDropdownOptions } from './AddUserModal';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Dialog, Typography, DialogTitle, DialogContent } from '@material-ui/core';
import Form from './Form';

export const materialTableIcons = {
	Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
	Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
	Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
	DetailPanel: forwardRef((props, ref) => (
		<ChevronRight {...props} ref={ref} />
	)),
	Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
	Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
	Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
	FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
	LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
	NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
	PreviousPage: forwardRef((props, ref) => (
		<ChevronLeft {...props} ref={ref} />
	)),
	ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
	SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
	ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
	ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export default class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,

			openPopup: false,
			recordForEdit: null,

			users: [],
			projects: [],
		};

		//#region
		this.props.project.methods
			.getUserAddresses()
			.call()
			.then((result) => {
				result.map((userAddress) => {
					this.props.project.methods
						.getUserInfo(userAddress)
						.call()
						.then((result) => {
							let role = roleDropdownOptions.find((element) => {
								return Number(element.id) === Number(result['role']);
							});
							const user = {
								username: result['username'],
								email: result['email'],
								firstname: result['firstname'],
								lastname: result['lastname'],
								role: role.value,
								walletAddress: result['walletAddress'],
							};
							this.setState({ users: [...this.state.users, user] });
						});
					return false;
				});
			});

		this.props.project.methods
			.getProjectIds()
			.call()
			.then((result) => {
				result.map((userAddress) => {
					this.props.project.methods
						.getProjectInfo(userAddress)
						.call()
						.then((result) => {
							const project = {
								index: result['index'],
								name: result['name'],
								description: result['description'],
								status: result['projectStatus'],
								ipfsFileCID: result['ipfsFileCID'],
							};
							this.setState({ projects: [...this.state.projects, project] });
							//console.log(this.state.projects);
						});
					return false;
				});
			});
		//#endregion
	}

	setOpenPopup = (value) => {
		this.setState({ openPopup: value });
	};

	setRecordForEdit = () => {
		this.setState({ recordForEdit: null });
	};

	handleClickOpen = () => {
		//console.log(this.props.userData);
		// if (this.props.userData === undefined) {
		// } else {
		//     this.setState({ isEdit: true });
		// }
		this.setState({ open: true });
	};

    addOrEdit = (employee, resetForm) => {
        // if (employee.id == 0)
        //     employeeService.insertEmployee(employee)
        // else
        //     employeeService.updateEmployee(employee)
        // resetForm()
        // setRecordForEdit(null)
        // setOpenPopup(false)
        // setRecords(employeeService.getAllEmployees())
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
					}}
				>Add New</Button>

				<Dialog open={this.state.openPopup} maxWidth="md">
					<DialogTitle>
						<div style={{ display: 'flex' }}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								Project Form
							</Typography>
							<Button color="secondary" onClick={() => {
									this.setOpenPopup(false);
								}}><CloseIcon />
							</Button>
						</div>
					</DialogTitle>
					<DialogContent dividers>
                        <Form recordForEdit={this.state.recordForEdit} addOrEdit={this.addOrEdit} />
                    </DialogContent>
				</Dialog>

				<br />
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
                                this.setRecordForEdit(null);
							},
						},
						{
							icon: VisibilityIcon,
							tooltip: 'View User',
							onClick: (event, rowData) => {
								console.log('You want to view ', rowData);
							},
						},
					]}
				/>
			</div>
		);
	}
}
