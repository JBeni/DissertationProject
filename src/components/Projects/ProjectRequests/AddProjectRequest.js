import React, { useState, useEffect } from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Button } from '@material-ui/core';
import { useStylesForm } from '../../sharedResources';
import * as formService from '../../Services/formService';
import * as dropdownService from '../../Services/dropdownService';

export default function AddProjectRequest(props) {
	const classes = useStylesForm();
	const {addOrEdit, recordForEdit} = props;
	const [values, setValues] = useState(formService.initialProjectRequestFormValues);
	const [errors, setErrors] = useState({});
    const [validity, setValidity] = useState(formService.initialProjectRequestFormValidity);

    useEffect(() => {
        if (recordForEdit != null) {
            const projectStatus = dropdownService.getProjectStatusByValue(recordForEdit.status);
            const nextStatus = projectStatus.id < 5 ? Number(projectStatus.id) + 1 : Number(projectStatus.id);
            const requestStatus = dropdownService.getDefaultRequestStatus();
            setValues({
                ...values,
                status: nextStatus.toString(),
                requestStatus: requestStatus.id,
            });
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
		setValues(formService.initialProjectRequestFormValues);
		setValues({
			...values,
		});
		setErrors({});
        setValidity(formService.initialProjectRequestFormValidity);
	};

	const validate = (fieldValues = values) => {
		let temp = { ...errors };
        let tempValidity = { ...validity };
		if ('title' in fieldValues) {
			temp.title = fieldValues.title ? '' : 'This field is required.';
            tempValidity.title = fieldValues.title?.length <= 0;
        }
		if ('status' in fieldValues) {
			temp.status = fieldValues.status.length > 0 ? '' : 'This field is required.';
            tempValidity.status = fieldValues.status?.length <= 0;
		}
		if ('requestStatus' in fieldValues) {
			temp.requestStatus = fieldValues.requestStatus?.length > 0 ? '' : 'This field is required.';
            tempValidity.requestStatus = fieldValues.requestStatus?.length <= 0;
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
                                name="title"
                                label="Title"
                                value={values.title}
                                onChange={handleInputChange}
                                error={validity.title}
                            />
							{errors && <FormHelperText className="Mui-error">{errors.title}</FormHelperText>}
						</FormControl>

						<FormControl style={{ width: '400px' }}>
							<InputLabel>Request Status</InputLabel>
							<Select
								name="requestStatus"
								label="RequestStatus"
								value={values.requestStatus}
								onChange={handleInputChange}
                                error={validity.requestStatus}
                                disabled={true}
							>
								{dropdownService.requestStatusDropdown.map((item) => (
									<MenuItem key={item.id} value={item.id}>
										{item.value}
									</MenuItem>
								))}
							</Select>
							{errors && <FormHelperText className="Mui-error">{errors.requestStatus}</FormHelperText>}
						</FormControl>

						<FormControl style={{ width: '400px' }}>
							<InputLabel>Project Status</InputLabel>
							<Select
								name="status"
								label="ProjectStatus"
								value={values.status}
								onChange={handleInputChange}
                                error={validity.status}
                                disabled={true}
							>
								{dropdownService.projectStatusDropdown.map((item) => (
									<MenuItem key={item.id} value={item.id}>
										{item.value}
									</MenuItem>
								))}
							</Select>
							{errors && <FormHelperText className="Mui-error">{errors.status}</FormHelperText>}
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
