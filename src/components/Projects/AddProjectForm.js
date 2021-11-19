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
import { makeStyles } from '@material-ui/core/styles';
import { initialProjectFormValidity, initialProjectFormValues, projectStatusDropdown } from '../applicationService';

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

export default function AddProjectForm(props) {
	const classes = useStyles();
	const {addOrEdit, recordForEdit} = props;
    const [isEdit, setIsEdit] = useState(false);
	const [values, setValues] = useState(initialProjectFormValues);
	const [errors, setErrors] = useState({});
    const [validity, setValidity] = useState(initialProjectFormValidity);

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
                sizeBytes: event.target.files[0].size,
                lastModifiedDate: event.target.files[0].lastModifiedDate
            }
		});
        validate({ 'file': {
            name: event.target.files[0].name,
            type: event.target.files[0].type,
            sizeBytes: event.target.files[0].sizeBytes,
            lastModifiedDate: event.target.files[0].lastModifiedDate
        }});
    }

	const resetForm = () => {
		setValues(initialProjectFormValues);
		setValues({
			...values,
			'file': { name: '', type: '', sizeBytes: '', lastModifiedDate: '' }
		});
		setErrors({});
        setValidity(initialProjectFormValidity);
	};

	const validate = (fieldValues = values) => {
		let temp = { ...errors };
        let tempValidity = { ...validity };
		if ('name' in fieldValues) {
			temp.name = fieldValues.name ? '' : 'This field is required.';
            tempValidity.name = fieldValues.name?.length <= 0;
        }
		if ('description' in fieldValues) {
			temp.description = fieldValues.description ? '' : 'This field is required.';
            tempValidity.description = fieldValues.description?.length <= 0;
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

	const handleSubmit = (e) => {
		e.preventDefault();
        if (validate()) {
			addOrEdit(values, resetForm);
            props.handleNewDataFromPopup(false);
		}
	};

	useEffect(() => {
		if (recordForEdit != null) {
            let status = projectStatusDropdown.find((element) => {
                return element.value === recordForEdit['status']
            });
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
                ...values,
                'status': '0',
            })
        }
	}, [recordForEdit]);

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

                        <FormControl style={{ width: '400px' }}>
                            <label htmlFor="file">
                                <input
                                    style={{ display: "none" }}
                                    id="file" type="file"
                                    name="file"
                                    onChange={fileChangeHandler}
                                />
                                <Fab color="secondary" size="small" component="span" aria-label="add" variant="extended">
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