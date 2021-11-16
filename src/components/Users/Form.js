import React, { useState, useEffect } from 'react';
import {
	Grid,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { roleDropdownOptions } from './AddUserModal';

const useStyles = makeStyles((theme) => ({
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
	label: {
		textTransform: 'none',
	},
}));

const initialFormValues = {
    username: '',
	firstname: '',
	lastname: '',
	email: '',
	role: '',
	walletAddress: '',
};

export default function Form(props) {
	const classes = useStyles();
	//const [openPopup, setOpenPopup] = useState(false);
	const { addOrEdit, recordForEdit } = props;

	const [values, setValues] = useState(initialFormValues);
	const [errors, setErrors] = useState({});
	//const [validateOnChange, setValidateOnChange] = useState(true);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value,
		});
		//if (validateOnChange) validate({ [name]: value });
	};

	const resetForm = () => {
		setValues(initialFormValues);
		setErrors({});
	};

	const validate = (fieldValues = values) => {
		let temp = { ...errors };
		if ('firstname' in fieldValues) {
			temp.firstname = fieldValues.firstname ? '' : 'This field is required.';
        }
		if ('lastname' in fieldValues) {
			temp.lastname = fieldValues.lastname ? '' : 'This field is required.';
        }
		if ('email' in fieldValues) {
            temp.email = fieldValues.email ? '' : 'This field is required.';
        } else {
			temp.email = /$^|.+@.+..+/.test(fieldValues.email)
				? ''
				: 'Email is not valid.';
        }
		if ('role' in fieldValues) {
			temp.role = fieldValues.role.length !== 0 ? '' : 'This field is required.';
        }
		if ('walletAddress' in fieldValues) {
			temp.walletAddress = fieldValues.walletAddress ? '' : 'This field is required.';
        } else {
            temp.walletAddress = /^(0x)?[0-9a-f]{40}$/i.test(fieldValues.walletAddress)
                ? ''
                : 'This wallet address is not a valid wallet address.';
        }
		setErrors({...temp,});

		if (fieldValues === values) {
			return Object.values(temp).every((x) => x === '');
        }
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			addOrEdit(values, resetForm);
		}
	};

	// useEffect(() => {
	// 	if (recordForEdit != null)
	// 		setValues({
	// 			...recordForEdit,
	// 		});
	// }, [recordForEdit]);

	return (
		<>
			<form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
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
							minRows={2}
							maxRows={4}
							label="City"
							name="city"
							value={values.city}
							onChange={handleInputChange}
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
								{roleDropdownOptions.map((item) => (
									<MenuItem key={item.id} value={item.id}>
										{item.value}
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
			</form>
		</>
	);
}
