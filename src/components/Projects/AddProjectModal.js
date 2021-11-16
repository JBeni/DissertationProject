import React, { useState, useEffect } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { projectStatusDropdown } from './DefaultModal';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Form }  from './useForm';
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Button,
} from '@material-ui/core';

const initialFValues = {
	id: 0,
	fullName: '',
	email: '',
	mobile: '',
	city: '',
	gender: 'male',
	departmentId: '',
	hireDate: new Date(),
	isPermanent: false,
};

const useStyles = makeStyles((theme) => ({
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
	root: {
		'& .MuiFormControl-root': {
			width: '80%',
			margin: theme.spacing(1),
		},
		minWidth: 0,
		margin: theme.spacing(0.5),
	},
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
	label: {
		textTransform: 'none',
	},
	dialogWrapper: {
		padding: theme.spacing(2),
		position: 'absolute',
		top: theme.spacing(5),
	},
	dialogTitle: {
		paddingRight: '0px',
	},
}));

export default function AddProjectModal(props) {
	const classes = useStyles();
	const {addOrEdit, recordForEdit} = props;

	const [values, setValues] = useState(initialFValues);
	const [errors, setErrors] = useState({});
	const [validateOnChange, setValidateOnChange] = useState(true);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value,
		});
		if (validateOnChange) validate({ [name]: value });
	};

	const resetForm = () => {
		setValues(initialFValues);
		setErrors({});
	};

	const validate = (fieldValues = values) => {
		let temp = { ...errors };
		if ('fullName' in fieldValues)
			temp.fullName = fieldValues.fullName ? '' : 'This field is required.';
		if ('email' in fieldValues)
			temp.email = /$^|.+@.+..+/.test(fieldValues.email)
				? ''
				: 'Email is not valid.';
		if ('mobile' in fieldValues)
			temp.mobile =
				fieldValues.mobile.length > 9 ? '' : 'Minimum 10 numbers required.';
		if ('departmentId' in fieldValues)
			temp.departmentId =
				fieldValues.departmentId.length !== 0 ? '' : 'This field is required.';
		setErrors({
			...temp,
		});

		if (fieldValues === values)
			return Object.values(temp).every((x) => x === '');
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			addOrEdit(values, resetForm);
		}
	};

	useEffect(() => {
		if (recordForEdit != null)
			setValues({
				...recordForEdit,
			});
	}, [recordForEdit]);

	return (
		<Form onSubmit={handleSubmit}>
			<Grid container>
				<Grid item xs={6}>
					<TextField
						name="fullName"
						label="Full Name"
						value={values.fullName}
						onChange={handleInputChange}
						error={errors.fullName}
					/>
					<TextField
						label="Email"
						name="email"
						value={values.email}
						onChange={handleInputChange}
						error={errors.email}
					/>
					<TextField
						label="Mobile"
						name="mobile"
						value={values.mobile}
						onChange={handleInputChange}
						error={errors.mobile}
					/>
					<TextField
						variant="outlined"
						label="City"
						name="city"
						value={values.city}
						onChange={handleInputChange}
					/>
					<TextField
						variant="outlined"
						placeholder="MultiLine with rows: 2 and rowsMax: 4"
						multiline
						rows={2}
						rowsMax={4}
					/>
				</Grid>

				<Grid item xs={6}>
					<FormControl {...(errors && { error: true })}>
						<InputLabel>Department</InputLabel>
						<Select
							label="Department"
							name="departmentId"
							value={values.departmentId}
							onChange={handleInputChange}
						>
							<MenuItem value="">None</MenuItem>
							{projectStatusDropdown.map((item) => (
								<MenuItem key={item.id} value={item.id}>
									{item.title}
								</MenuItem>
							))}
						</Select>
						{errors && <FormHelperText>{errors.departmentId}</FormHelperText>}
					</FormControl>

					<div>
						<Button
							classes={{ root: classes.root, label: classes.label }}
							variant="contained"
							size="large"
							color="primary"
							type="submit"
						>
							Submit
						</Button>
						<Button
							classes={{ root: classes.root, label: classes.label }}
							variant="contained"
							size="large"
							color="default"
							onClick={resetForm}
						>
							Reset
						</Button>
					</div>
				</Grid>
			</Grid>
		</Form>
	);
}
