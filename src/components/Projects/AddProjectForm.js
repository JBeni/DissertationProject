import React, { useState, useEffect } from 'react';
import {
	Grid,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
    Fab,
	FormHelperText,
	Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import * as formService from '../Services/formService';
import { useStylesForm } from './../sharedResources';
import * as dropdownService from '../Services/dropdownService';

export default function AddProjectForm(props) {
	const classes = useStylesForm();
	const {addOrEdit, recordForEdit} = props;
    const [isEdit, setIsEdit] = useState(false);
	const [values, setValues] = useState(formService.initialProjectFormValues);
	const [errors, setErrors] = useState({});
    const [validity, setValidity] = useState(formService.initialProjectFormValidity);
    const [buffer, setBuffer] = useState(null);

    useEffect(() => {
        if (recordForEdit != null) {
            const status = dropdownService.getProjectStatusByValue(recordForEdit.status);
            const newData = {
                name: recordForEdit.name,
                status: status.id,
                'file': { name: '', type: '', size: '', lastModifiedDate: '' },
                projectAddress: recordForEdit.projectAddress
            };
            setValues({
				...newData,
			});
            setIsEdit(true);
        } else {
            setValues({
                ...values,
                status: dropdownService.getDefaultProjectStatus().id,
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

    const fileChangeHandler = (event) => {
		setValues({
			...values,
			'file': {
                name: event.target.files[0].name,
                type: event.target.files[0].type,
                size: event.target.files[0].size,
                lastModifiedDate: event.target.files[0].lastModifiedDate
            }
		});

        const data = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(new Blob([data]));
        reader.onloadend = () => {
            setBuffer(Buffer(reader.result));
        };

        validate({ 'file': {
            name: event.target.files[0].name,
            type: event.target.files[0].type,
            size: event.target.files[0].size,
            lastModifiedDate: event.target.files[0].lastModifiedDate
        }});
    }

	const resetForm = () => {
		setValues(formService.initialProjectFormValues);
		setValues({
			...values,
            name: '',
			'file': { name: '', type: '', size: '', lastModifiedDate: '' }
		});
		setErrors({});
        setValidity(formService.initialProjectFormValidity);
	};

	const validate = (fieldValues = values) => {
		let temp = { ...errors };
        let tempValidity = { ...validity };
		if ('name' in fieldValues) {
			temp.name = fieldValues.name.trim() ? '' : 'This field is required.';
            tempValidity.name = fieldValues.name?.length <= 0;
        }
		if ('status' in fieldValues) {
			temp.status = fieldValues.status.length > 0 ? '' : 'This field is required.';
            tempValidity.status = fieldValues.status?.length <= 0;
		}
		if ('file' in fieldValues) {
			temp.file = fieldValues.file.name?.length > 0 ? '' : 'This field is required.';
            tempValidity.file = fieldValues.file.name?.length <= 0;
		}
        setErrors({ ...temp });
        setValidity({ ...tempValidity });

		if (fieldValues === values) {
			return Object.values(temp).every((x) => x === '');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
        if (validate()) {
			addOrEdit(values, resetForm, buffer);
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
							<InputLabel>Status</InputLabel>
							<Select
								name="status"
								label="Status"
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

                        <FormControl style={{ width: '400px' }}>
                            <label htmlFor="file">
                                <input
                                    style={{ display: "none" }}
                                    id="file" type="file"
                                    accept="application/pdf"
                                    name="file"
                                    onChange={fileChangeHandler}
                                />
                                <Fab color="primary" size="small" component="span" aria-label="add" variant="extended">
                                    <AddIcon /> Upload File
                                </Fab>
                                <TextField
                                    style={{ marginLeft: '3px', width: '400px' }}
                                    value={values.file.name}
                                    disabled={true}
                                />
                            </label>
                            {errors && <FormHelperText className="Mui-error">{errors.file}</FormHelperText>}
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
