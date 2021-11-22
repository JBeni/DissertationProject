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
import { initialRequestFormValues, initialRequestFormValidity, projectStatusDropdown, getProjectStatusByValue, requestStatusTwoDropdown } from '../formService';
import { useStylesForm } from './../sharedResources';

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
		setValues(initialRequestFormValues);
		setValues({
			...values
		});
		setErrors({});
        setValidity(initialRequestFormValidity);
	};

	const validate = (fieldValues = values) => {
		let temp = { ...errors };
        let tempValidity = { ...validity };
		if ('title' in fieldValues) {
			temp.title = fieldValues.title ? '' : 'This field is required.';
            tempValidity.title = fieldValues.title?.length <= 0;
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
            let projectStatus = getProjectStatusByValue(recordForEdit['projectStatus']);
            setValues({
				...values,
                index: recordForEdit['index'],
                title: recordForEdit['title'],
                projectStatus: projectStatus.id,
                indexProjectRequest: recordForEdit['indexProjectRequest'],
                comments: '',
                projectAddress: recordForEdit['projectAddress'],
                userAddress: recordForEdit['userAddress']
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
                                name="title"
                                label="Title"
                                value={values.title}
                                onChange={handleInputChange}
                                error={validity.title}
                                disabled = {(isEdit === true) ? true : false}
                            />
							{errors && <FormHelperText className="Mui-error">{errors.title}</FormHelperText>}
						</FormControl>

                        <FormControl style={{ width: '400px' }}>
                            <TextField
                                style={{ marginLeft: '3px', width: '400px' }}
                                name="comments"
                                label="Comments"
                                variant="outlined"
                                placeholder="MultiLine with min rows: 5"
                                multiline
                                minRows={5}
                                value={values.comments}
                                onChange={handleInputChange}
                                error={validity.comments}
                            />
							{errors && <FormHelperText className="Mui-error">{errors.comments}</FormHelperText>}
						</FormControl>

						<FormControl style={{ width: '400px' }}>
							<InputLabel>Project Status</InputLabel>
							<Select
								name="projectStatus"
								label="ProjectStatus"
								value={values.projectStatus}
								onChange={handleInputChange}
                                error={validity.projectStatus}
                                disabled={true}
							>
								{projectStatusDropdown.map((item) => (
									<MenuItem key={item.id} value={item.id}>
										{item.value}
									</MenuItem>
								))}
							</Select>
							{errors && <FormHelperText className="Mui-error">{errors.projectStatus}</FormHelperText>}
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
								{requestStatusTwoDropdown.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.value}
                                    </MenuItem>
								))}
							</Select>
							{errors && <FormHelperText className="Mui-error">{errors.requestStatus}</FormHelperText>}
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
