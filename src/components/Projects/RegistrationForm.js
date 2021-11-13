import React, { useState } from 'react';
import { Grid, Paper, Button, Typography } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Dialog from '@mui/material/Dialog';

function RegistrationForm() {
    const [open, setOpen] = useState(false);

    const paperStyle = { padding: '40px 20px', width: 250, margin: '20px auto' }
    const btnStyle = { marginTop: 10 }
    const phoneRegExp=/^[2-9]{2}[0-9]{8}/
    const passwordRegExp=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    const initialValues = {
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword:''
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3, "It's too short").required("Required"),
        email: Yup.string().email("Enter valid email").required("Required"),
        // phoneNumber: Yup.number().typeError("Enter valid Phone number").required("Required"),
        phoneNumber:Yup.string().matches(phoneRegExp,"Enter valid Phone number").required("Required"),
        password: Yup.string().min(8, "Minimum characters should be 8")
        .matches(passwordRegExp,"Password must have one upper, lower case, number, special symbol").required('Required'),
        confirmPassword:Yup.string().oneOf([Yup.ref('password')],"Password not matches").required('Required')
    })

	const handleClickOpen = () => {
		setOpen({ open: true });
	};

	const handleClose = (event, reason) => {
		if (reason === 'backdropClick') {
			return false;
		}
		setOpen({ open: false });
	};

    const onSubmit = (values, props) => {
        alert(JSON.stringify(values), null, 2)
        props.resetForm()
    }

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Add New Project
            </Button>

            <Dialog
					open={open}
					onClose={handleClose}
				>
                <Grid>
                    <Paper elevation={5} style={paperStyle}>
                        <Grid align='center'>
                            <Typography variant='h6'>Register Here</Typography>
                            <Typography variant='caption'>Fill the form to create an account</Typography>
                        </Grid>
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                            {(props) => (
                                <Form noValidate>
                                    <Field as={TextField} name='name' label='Name' fullWidth
                                        error={props.errors.name && props.touched.name}
                                        helperText={<ErrorMessage name='name' />} required />

                                    <Field as={TextField} name='email' label='Email' fullWidth
                                        error={props.errors.email && props.touched.email}
                                        helperText={<ErrorMessage name='email' />} required />

                                    <Field as={TextField} name="phoneNumber" label='Phone Number' fullWidth
                                        error={props.errors.phoneNumber && props.touched.phoneNumber}
                                        helperText={<ErrorMessage name='phoneNumber' />} required />

                                    <Field as={TextField} name='password' label='Password' type='password' fullWidth
                                        error={props.errors.password && props.touched.password}
                                        helperText={<ErrorMessage name='password' />} required />

                                    <Field as={TextField} name='confirmPassword' label='Confirm Password' type='password' fullWidth
                                        error={props.errors.confirmPassword && props.touched.confirmPassword}
                                        helperText={<ErrorMessage name='confirmPassword' />} required />

                                    <Button onClick={handleClose}>Close</Button>
                                    <Button type='submit' style={btnStyle} variant='contained'
                                        color='primary'>Register</Button>
                                </Form>
                            )}
                        </Formik>
                    </Paper>
                </Grid>
            </Dialog>
        </div>
    );
}

export default RegistrationForm;
