import React, { useState, useEffect } from 'react';
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
import AddProjectForm from './AddProjectModalForm';
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import * as projectService from './projectService';

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
	{ id: 'index', label: 'Index' },
	{ id: 'name', label: 'Name' },
	{ id: 'description', label: 'Description' },
	{ id: 'projectStatus', label: 'Status' },
	{ id: 'ipfsFileCID', label: 'IPFS CID' },
	{ id: 'actions', label: 'Actions', disableSorting: true },
];

export default function MTable(props) {
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
    //const { recordsAfterPagingAndSorting } = useTable(records, headCells, filterFn);

	useEffect(() => {
        (async () => {
            let data = await Promise.resolve(projectService.getAllProjects(props));
            console.log(data);
            setRecords(data);
        })();
	}, []);

    const getProjects = async () => {
        await Promise.resolve(
            props.project.methods.getProjectIds().call().then((result) => {
				result.map((projectId) => {
					props.project.methods
						.getProjectInfo(projectId)
						.call()
						.then((result) => {
							const project = {
								index: result['index'],
								name: result['name'],
								description: result['description'],
								status: result['projectStatus'],
								ipfsFileCID: result['ipfsFileCID'],
							};
							setRecords([...records, project]);
                        });
                    return true;
                });
			})
        );
    }

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

    function stableSort(array, comparator) {
		const stabilizedThis = array.map((el, index) => [el, index]);
		stabilizedThis.sort((a, b) => {
			const order = comparator(a[0], b[0]);
			if (order !== 0) return order;
			return a[1] - b[1];
		});
		return stabilizedThis.map((el) => el[0]);
	}

	function getComparator(order, orderBy) {
		return order === 'desc'
			? (a, b) => descendingComparator(a, b, orderBy)
			: (a, b) => -descendingComparator(a, b, orderBy);
	}

	function descendingComparator(a, b, orderBy) {
		if (b[orderBy] < a[orderBy]) {
			return -1;
		}
		if (b[orderBy] > a[orderBy]) {
			return 1;
		}
		return 0;
	}

	const recordsAfterPagingAndSorting = () => {
		return stableSort(
			filterFn.fn(records),
			getComparator(order, orderBy)
		).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
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
					{/* <TableBody>
						{recordsAfterPagingAndSorting().map((item) => (
							<TableRow key={Number(item.index)}>
								<TableCell>{item.index}</TableCell>
								<TableCell>{item.name}</TableCell>
								<TableCell>{item.description}</TableCell>
								<TableCell>{item.projectStatus}</TableCell>
								<TableCell>{item.ipfsFileCID}</TableCell>
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
					</TableBody> */}

                    <TableBody>
                        {records.map((row) => (
                            <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
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
