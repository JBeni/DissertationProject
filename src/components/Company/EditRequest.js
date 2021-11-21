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
import { initialProjectFormValidity, initialRequestFormValidity, initialProjectFormValues, projectStatusDropdown, getProjectStatusByValue } from '../formService';
import { useStylesForm } from './../sharedResources';
import { initialRequestFormValues } from './../formService';

export default function EditRequest(props) {
	const classes = useStylesForm();
	const {addOrEdit, recordForEdit} = props;
    const [isEdit, setIsEdit] = useState(false);
	const [values, setValues] = useState(initialRequestFormValues);
	const [errors, setErrors] = useState({});
    const [validity, setValidity] = useState(initialRequestFormValidity);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value,
		});
        validate({ [name]: value });
	};

	const resetForm = () => {
		setValues(initialProjectFormValues);
		setValues({
			...values
		});
		setErrors({});
        setValidity(initialProjectFormValidity);
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
		if ('projectStatus' in fieldValues) {
			temp.projectStatus = fieldValues.projectStatus.length > 0 ? '' : 'This field is required.';
            tempValidity.projectStatus = fieldValues.projectStatus?.length <= 0;
		}
		if ('requestStatus' in fieldValues) {
			temp.requestStatus = fieldValues.requestStatus.length > 0 ? '' : 'This field is required.';
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

	useEffect(() => {
		if (recordForEdit != null) {
            let status = getProjectStatusByValue(recordForEdit['status']);
            let newData = {
                name: recordForEdit['name'],
                description: recordForEdit['description'],
                status: status.id,
            };
            setValues({
				...newData,
			});
            setIsEdit(true);
        } else {
            setValues({
                ...values
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
                                name="name"
                                label="Name"
                                value={values.name}
                                onChange={handleInputChange}
                                error={validity.name}
                                disabled = {(isEdit === true) ? true : false}
                            />
							{errors && <FormHelperText className="Mui-error">{errors.name}</FormHelperText>}
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
                                disabled = {(isEdit === true) ? true : false}
                            />
							{errors && <FormHelperText className="Mui-error">{errors.description}</FormHelperText>}
						</FormControl>

						<FormControl style={{ width: '400px' }}>
							<InputLabel>Status</InputLabel>
							<Select
								name="status"
								label="Status"
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
							>Submit</Button>
							<Button
								classes={{ root: classes.root, label: classes.label }}
								variant="contained"
								size="large"
								color="default"
								onClick={resetForm}
                                disabled = {(isEdit === true) ? true : false}
							>Reset</Button>
						</div>
					</Grid>
				</Grid>
			</form>
		</>
	);
}
