import React, { useState } from 'react';
import {
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	makeStyles,
	TablePagination,
	TableSortLabel,
    Toolbar,
    TextField,
	InputAdornment,
    TableBody,
    Button,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import PopupForm from './PopupForm';
import AddProjectForm from './AddProjectForm';
import AddIcon from '@material-ui/icons/Add';
import useTable from '../Controls/useTable';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
	pageContent: {
		margin: '10px',
		padding: '10px',
	},
    searchInput: {
		width: '75%',
	},
	newButton: {
		position: 'absolute',
		right: '10px',
	},
	root: {
		minWidth: 0,
		margin: theme.spacing(0.5),
	},
	secondary: {
		backgroundColor: theme.palette.secondary.light,
		'& .MuiButton-label': {
			color: theme.palette.secondary.main,
		},
	},
	primary: {
		backgroundColor: theme.palette.primary.light,
		'& .MuiButton-label': {
			color: theme.palette.primary.main,
		},
	},
	label: {
		textTransform: 'none',
	},
    table: {
		marginTop: theme.spacing(3),
		'& thead th': {
			fontWeight: '600',
			backgroundColor: '#add8e6',
		},
		'& tbody td': {
			fontWeight: '300',
		},
		'& tbody tr:hover': {
			cursor: 'pointer',
		},
	},
}));

const headCells = [
	{ id: 'fullName', label: 'Employee Name' },
	{ id: 'email', label: 'Email Address (Personal)' },
	{ id: 'mobile', label: 'Mobile Number' },
	{ id: 'department', label: 'Department' },
	{ id: 'actions', label: 'Actions', disableSorting: true },
];

export default function MTable() {
	const classes = useStyles();

	const pages = [5, 10, 25];
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
	const [order, setOrder] = useState();
	const [orderBy, setOrderBy] = useState();

    const [recordForEdit, setRecordForEdit] = useState(null);
	const [records, setRecords] = useState([]);
	const [filterFn, setFilterFn] = useState({
		fn: (items) => {
			return items;
		},
	});
	const [openPopup, setOpenPopup] = useState(false);
    const { recordsAfterPagingAndSorting } = useTable(records, headCells, filterFn);

	const handleSortRequest = (cellId) => {
		const isAsc = orderBy === cellId && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(cellId);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

    const handleSearch = (e) => {
		let target = e.target;
		// setFilterFn({
		// 	fn: (items) => {
		// 		if (target.value === '') {
        //             return items
        //         } else {
		// 			return items.filter((x) =>
		// 				x.fullName.toLowerCase().includes(target.value)
		// 			);
        //         }
		// 	},
		// });
	};

    const addOrEdit = (employee, resetForm) => {
		// if (employee.id === 0) {
        //     employeeService.insertEmployee(employee);
        // } else {
        //     employeeService.updateEmployee(employee);
        // }
        // resetForm();
		// setRecordForEdit(null);
		// setOpenPopup(false);
		// setRecords(employeeService.getAllEmployees());
	};

	const openInPopup = (item) => {
		setRecordForEdit(item);
		setOpenPopup(true);
	};

	return (
		<>
			<Paper className={classes.pageContent}>
				<Toolbar>
                    <TextField
						label="Search Employees"
						className={classes.searchInput}
                        //name={name}
                        //value={value}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Search />
								</InputAdornment>
							),
						}}
						onChange={handleSearch}
                    />
                    <Button
                        variant={'outlined' || 'contained'}
                        size={'large'}
                        color={'primary'}
                        startIcon={<AddIcon />}
                        className={classes.newButton}
						onClick={() => {
							setOpenPopup(true);
							setRecordForEdit(null);
						}}
                    >
                        Add New
                    </Button>
				</Toolbar>

				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							{headCells.map((headCell) => (
								<TableCell
									key={headCell.id}
									sortDirection={orderBy === headCell.id ? order : false}
								>
									{headCell.disableSorting ? (
										headCell.label
									) : (
										<TableSortLabel
											active={orderBy === headCell.id}
											direction={orderBy === headCell.id ? order : 'asc'}
											onClick={() => {
												handleSortRequest(headCell.id);
											}}
										>
											{headCell.label}
										</TableSortLabel>
									)}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{recordsAfterPagingAndSorting().map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.fullName}</TableCell>
								<TableCell>{item.email}</TableCell>
								<TableCell>{item.mobile}</TableCell>
								<TableCell>{item.department}</TableCell>
								<TableCell>
                                    <Button color="primary" className={`${classes.root}`} onClick={() => {openInPopup(item)}}>
                                        <EditOutlinedIcon fontSize="small" />
                                    </Button>
                                    <Button color="secondary" className={`${classes.root}`}>
                                        <CloseIcon fontSize="small" />
                                    </Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<TablePagination
					component="div"
					page={page}
					rowsPerPageOptions={pages}
					rowsPerPage={rowsPerPage}
					count={records.length}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
			<PopupForm
				title="Project Form"
				openPopup={openPopup}
				setOpenPopup={setOpenPopup}
			>
				<AddProjectForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
			</PopupForm>
		</>
	);
}
