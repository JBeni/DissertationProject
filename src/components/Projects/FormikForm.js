import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import FormikField from './FormikField';
import './FormikForm.css';
import Dialog from '@mui/material/Dialog';

const initialValues = {
	name: '',
	email: '',
	password: '',
	passwordConfirm: '',
	position: '',
};

const emailAddresses = ['test@gmail.com', 'test2@gmail.com', 'test3@gmail.com'];

const lowercaseRegex = /(?=.*[a-z])/;
const uppercaseRegex = /(?=.*[A-Z])/;
const numericRegex = /(?=.*[0-9])/;

const SignupSchema = Yup.object().shape({
	name: Yup.string().min(2, 'Too Short!').required('Required'),
	email: Yup.string()
		.lowercase()
		.email('Must be a valid email!')
		.notOneOf(emailAddresses, 'Email already taken!')
		.required('Required!'),
	password: Yup.string()
		.matches(lowercaseRegex, 'one lowercase required!')
		.matches(uppercaseRegex, 'one uppercase required!')
		.matches(numericRegex, 'one number required!')
		.min(8, 'Minimum 8 characters required!')
		.required('Required!'),
	passwordConfirm: Yup.string()
		.oneOf([Yup.ref('password')], 'Password must be the same!')
		.required('Required!'),
	position: Yup.string().required('Required'),
});

function FormikForm() {
	const handleSubmit = (values) => {
		alert(JSON.stringify(values));
	};

	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === 'backdropClick') {
			return false;
		}
		setOpen(false);
	};

	return (
		<div className=".formik-form">
			<Button variant="outlined" onClick={handleClickOpen}>
				Add New Project
			</Button>

			<Dialog
				open={open}
				onClose={handleClose}
			>
				<h1>Sign Up</h1>
				<Formik
					initialValues={initialValues}
					onSubmit={handleSubmit}
					validationSchema={SignupSchema}
				>
					{({ dirty, isValid }) => {
						return (
							<Form>
								<FormikField name="name" label="Name" required />
								<FormikField name="email" label="Email" required />
								<FormikField
									name="password"
									label="Password"
									required
									type="password"
								/>
								<FormikField
									name="passwordConfirm"
									label="Confirm Password"
									required
									type="password"
								/>

								<Button onClick={handleClose}>Close</Button>
								<Button
									variant="contained"
									color="primary"
									disabled={!dirty || !isValid}
									type="submit"
								>
									Primary
								</Button>
							</Form>
						);
					}}
				</Formik>
			</Dialog>
		</div>
	);
}

export default FormikForm;
