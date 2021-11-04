import React, { Component } from 'react';
import MaterialTable from '@material-table/core';
import TableViewRow from './TableViewRow';

// Import Material Icons
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

class Table extends Component {
	render() {
		// Material Table Columns
		const columns = [
			{ title: 'Id', field: 'id' },
			{ title: 'First Name', field: 'first_name' },
			{ title: 'Last Name', field: 'last_name' },
		];

		// Material Table Columns Rows
		const data = (query) =>
			new Promise((resolve, reject) => {
				let url = 'https://reqres.in/api/users?';
				url += 'per_page=' + query.pageSize;
				url += '&page=' + (query.page + 1);
				fetch(url)
					.then((response) => response.json())
					.then((result) => {
						resolve({
							data: result.data,
							page: result.page - 1,
							totalCount: result.total,
						});
					});
			});

		const tableRef = React.createRef();

		return (
			<div>
				<MaterialTable
					title="Remote Server Data Example"
					tableRef={tableRef}
					icons={tableIcons}
					columns={columns}
					data={data}
                    options={{ exportButton: true, actionsColumnIndex: -1 }}
                    actions={[
                        {
                            icon: Refresh,
                            tooltip: 'Refresh Data',
                            isFreeAction: true,
                            onClick: () => tableRef.current && tableRef.current.onQueryChange(),
                            position: 'auto'
                        },
                        {
                            icon: SaveAlt,
                            tooltip: 'Save User',
                            onClick: (event, rowData) => console.log("You saved ",rowData)
                        },
                        {
                            icon: Delete,
                            tooltip: 'Delete User',
                            onClick: (event, rowData) => console.log("You want to delete ",rowData)
                        },
                        {
                            icon: VisibilityIcon,
                            tooltip: 'View User',
                            onClick: (event, rowData) => console.log("You want to view ",rowData)
                        }
                    ]}
				/>

                <br /><br />
                <div>
                    <TableViewRow />
                </div>
			</div>
		);
	}
}

export default Table;
