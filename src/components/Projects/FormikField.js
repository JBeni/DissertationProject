import React from 'react';
import { ErrorMessage, Field } from 'formik';
import TextField from '@material-ui/core/TextField';
import './FormikField.css';

function FormikField({
	name,
	label,
	type = 'text',
	required = false,
}) {
	return (
		<div className="FormikField">
			<Field
				required={required}
				autoComplete="off"
				as={TextField}
				label={label}
				name={name}
				fullWidth
				type={type}
				helperText={<ErrorMessage name={name} />}
			/>
		</div>
	);
};

export default FormikField;
