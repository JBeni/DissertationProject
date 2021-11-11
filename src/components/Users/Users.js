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
import Refresh from '@material-ui/icons/Refresh';
import Delete from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddUserModal, { roleDropdownOptions } from './AddUserModal';

const tableIcons = {
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
			show: false,
			users: [],
		};

		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);

        this.props.project.methods.getUserIds().call().then((result) => {
            result.map((userId) => {
				this.props.project.methods.getUserInfo(Number(userId)).call()
					.then((result) => {
                        let role = roleDropdownOptions.find((element) => {
                            return Number(element.id) === Number(result['role']);
                        });
						const user = {
                            username: this.props.web3.utils.hexToUtf8(result['username']),
                            email: this.props.web3.utils.hexToUtf8(result['email']),
                            firstname: this.props.web3.utils.hexToUtf8(result['firstname']),
                            lastname: this.props.web3.utils.hexToUtf8(result['lastname']),
                            role: role.value,
                            walletAddress: result['walletAddress'],
                        };
						this.setState({ users: [...this.state.users, user] });
					});
				return false;
			});
		});
	}

/*
	componentDidMount() {
        this.props.project.methods.getUserIds().call().then((result) => {
            result.map((userId) => {
				this.props.project.methods.getUserInfo(Number(userId)).call()
					.then((result) => {
                        let role = roleDropdownOptions.find((element) => {
                            return Number(element.id) === Number(result['role']);
                        });
						const user = {
                            username: this.props.web3.utils.hexToUtf8(result['username']),
                            email: this.props.web3.utils.hexToUtf8(result['email']),
                            firstname: this.props.web3.utils.hexToUtf8(result['firstname']),
                            lastname: this.props.web3.utils.hexToUtf8(result['lastname']),
                            role: role.value,
                            walletAddress: result['walletAddress'],
                        };
						this.setState({ users: [...this.state.users, user] });
					});
				return false;
			});
		});
	}
*/

	showModal = () => {
		this.setState({ show: true });
	};

	hideModal = () => {
		this.setState({ show: false });
	};

	render() {
		const tableRef = React.createRef();
		const columns = [
			{ title: 'Username', field: 'username' },
			//{ title: 'First Name', field: 'firstname' },
			//{ title: 'Last Name', field: 'lastname' },
			{ title: 'Email', field: 'email' },
			{ title: 'Role', field: 'role' },
			//{ title: 'Wallet Address', field: 'walletAddress' },
		];

		return (
			<div>
                <AddUserModal />
				<br />
				<MaterialTable
					title="Users ProjectChain"
					tableRef={tableRef}
					icons={tableIcons}
					columns={columns}
					data={this.state.users}
					options={{ exportButton: true, actionsColumnIndex: -1 }}
					actions={[
						{
							icon: Refresh,
							tooltip: 'Refresh Data',
							isFreeAction: true,
							onClick: () =>
								tableRef.current && tableRef.current.onQueryChange(),
							position: 'auto',
						},
						{
							icon: SaveAlt,
							tooltip: 'Save User',
							onClick: (event, rowData) => console.log('You saved ', rowData),
						},
						{
							icon: Delete,
							tooltip: 'Delete User',
							onClick: (event, rowData) =>
								console.log('You want to delete ', rowData),
						},
						{
							icon: VisibilityIcon,
							tooltip: 'View User',
							onClick: (event, rowData) =>
								console.log('You want to view ', rowData),
						},
					]}
				/>
			</div>
		);
	}
}
