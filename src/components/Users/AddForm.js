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
import * as formService from '../Services/formService';
import * as dropdownService from '../Services/dropdownService';
import { useStylesForm } from './../sharedResources';

export default function AddForm(props) {
	const classes = useStylesForm();
	const {addOrEdit, recordForEdit} = props;
    const [isEdit, setIsEdit] = useState(false);
	const [values, setValues] = useState(formService.initialUserFormValues);
	const [errors, setErrors] = useState({});
    const [validity, setValidity] = useState(formService.initialUserFormValidity);

    useEffect(() => {
		if (recordForEdit != null) {
            const role = dropdownService.getUserRoleByValue(recordForEdit.role);
            setValues(prev => ({
				...recordForEdit,
				role: role.id
			}));
            setIsEdit(true);
        }
	}, [recordForEdit]);

    const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value,
		});
        validate({ [name]: value });
	};

	const resetForm = () => {
		setValues(formService.initialUserFormValues);
		setErrors({});
        setValidity(formService.initialUserFormValidity);
	};

	const validate = (fieldValues = values) => {
		let temp = { ...errors };
        let tempValidity = { ...validity };
		if ('firstname' in fieldValues) {
			temp.firstname = fieldValues.firstname.trim() ? '' : 'This field is required.';
            tempValidity.firstname = fieldValues.firstname?.length <= 0;
        }
		if ('lastname' in fieldValues) {
			temp.lastname = fieldValues.lastname.trim() ? '' : 'This field is required.';
            tempValidity.lastname = fieldValues.lastname?.length <= 0;
		}
		if ('role' in fieldValues) {
			temp.role = fieldValues.role.length > 0 ? '' : 'This field is required.';
            tempValidity.role = fieldValues.role?.length <= 0;
		}
		if ('walletAddress' in fieldValues) {
			temp.walletAddress = fieldValues.walletAddress
				? ''
				: 'This field is required.';
            tempValidity.walletAddress = fieldValues.walletAddress?.length <= 0;
        }
        if (fieldValues.walletAddress?.length > 0) {
			temp.walletAddress = /^(0x)?[0-9a-f]{40}$/i.test(fieldValues.walletAddress)
				? ''
				: 'This wallet address is not a valid wallet address.';
            tempValidity.walletAddress = !(/^(0x)?[0-9a-f]{40}$/i.test(fieldValues.walletAddress));
        }
		setErrors({ ...temp });
        setValidity({ ...tempValidity });

		if (fieldValues === values) {
			return Object.values(temp).every((x) => x === '');
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
        if (validate()) {
			addOrEdit(values, resetForm);
            props.handleNewDataFromPopup(false);
		}
	};

	return (
		<>
			<form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
				<Grid container>
					<Grid item xs={6}>
                        <FormControl style={{ width: '400px' }} {...(errors && { error: true })}>
                            <TextField
                                style={{ marginLeft: '3px', width: '400px' }}
                                name="firstname"
                                label="First Name"
                                value={values.firstname}
                                onChange={handleInputChange}
                                error={validity.firstname}
                                disabled = {(isEdit === true) ? true : false}
                            />
							{errors && <FormHelperText className="Mui-error">{errors.firstname}</FormHelperText>}
						</FormControl>

                        <FormControl style={{ width: '400px' }}>
                            <TextField
                                style={{ marginLeft: '3px', width: '400px' }}
                                name="lastname"
                                label="Last Name"
                                value={values.lastname}
                                onChange={handleInputChange}
                                error={validity.lastname}
                                disabled = {(isEdit === true) ? true : false}
                            />
							{errors && <FormHelperText className="Mui-error">{errors.lastname}</FormHelperText>}
						</FormControl>

						<FormControl style={{ width: '400px' }}>
							<InputLabel>Role</InputLabel>
							<Select
								label="Role"
								name="role"
								value={values.role}
								onChange={handleInputChange}
                                error={validity.role}
							>
								{dropdownService.userRoleDropdown.map((item) => (
									<MenuItem key={item.id} value={item.id}>
										{item.value}
									</MenuItem>
								))}
							</Select>
							{errors && <FormHelperText className="Mui-error">{errors.role}</FormHelperText>}
						</FormControl>

                        <FormControl style={{ width: '400px' }}>
                            <TextField
                                style={{ marginLeft: '3px', width: '400px' }}
                                name="walletAddress"
                                label="Wallet Address"
                                value={values.walletAddress}
                                onChange={handleInputChange}
                                error={validity.walletAddress}
                                disabled = {(isEdit === true) ? true : false}
                            />
							{errors && <FormHelperText className="Mui-error">{errors.walletAddress}</FormHelperText>}
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
                                disabled = {(isEdit === true) ? true : false}
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
