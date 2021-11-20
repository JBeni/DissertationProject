import React, { useState, useEffect } from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Button } from '@material-ui/core';
import { useStylesForm } from '../sharedResources';
import { initialProjectRequestFormValues, initialProjectRequestFormValidity, projectStatusDropdown, getProjectStatusByValue } from '../applicationService';

export default function CreateProjectRequest(props) {
	const classes = useStylesForm();
	const {addOrEdit, recordForEdit} = props;
	const [values, setValues] = useState(initialProjectRequestFormValues);
	const [errors, setErrors] = useState({});
    const [validity, setValidity] = useState(initialProjectRequestFormValidity);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value,
		});
        validate({ [name]: value });
	};

	const resetForm = () => {
		setValues(initialProjectRequestFormValues);
		setValues({
			...values,
		});
		setErrors({});
        setValidity(initialProjectRequestFormValidity);
	};

	const validate = (fieldValues = values) => {
		let temp = { ...errors };
        let tempValidity = { ...validity };
		if ('title' in fieldValues) {
			temp.title = fieldValues.title ? '' : 'This field is required.';
            tempValidity.title = fieldValues.title?.length <= 0;
        }
		if ('description' in fieldValues) {
			temp.description = fieldValues.description ? '' : 'This field is required.';
            tempValidity.description = fieldValues.description?.length <= 0;
		}
		if ('status' in fieldValues) {
			temp.status = fieldValues.status.length > 0 ? '' : 'This field is required.';
            tempValidity.status = fieldValues.status?.length <= 0;
		}
		if ('requestStatus' in fieldValues) {
			temp.requestStatus = fieldValues.requestStatus.name?.length > 0 ? '' : 'This field is required.';
            tempValidity.requestStatus = fieldValues.requestStatus.name?.length <= 0;
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

	useEffect(() => {
        if (recordForEdit != null) {
            let status = getProjectStatusByValue(recordForEdit['status']);
            let nextStatus = status.id < 5 ? Number(status.id) + 1 : Number(status.id);
            setValues({
                ...values,
                status: nextStatus.toString(),
                requestStatus: '',
            });
        }
	}, []);

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
                            <TextField
                                style={{ marginLeft: '3px', width: '400px' }}
                                name="description"
                                label="Description"
                                variant="outlined"
                                placeholder="MultiLine with min rows: 5"
                                multiline
                                minRows={5}
                                value={values.description}
                                onChange={handleInputChange}
                                error={validity.description}
                            />
							{errors && <FormHelperText className="Mui-error">{errors.description}</FormHelperText>}
						</FormControl>

						<FormControl style={{ width: '400px' }}>
							<InputLabel>Request Status</InputLabel>
							<Select
								name="requestStatus"
								label="RequestStatus"
								value={values.requestStatus}
								onChange={handleInputChange}
                                error={validity.requestStatus}
							>
								{projectStatusDropdown.map((item) => (
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
								{projectStatusDropdown.map((item) => (
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
