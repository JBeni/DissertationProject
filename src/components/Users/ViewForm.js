import React, { useState, useEffect } from 'react';
import { Grid, FormLabel } from '@material-ui/core';
import * as formService from '../Services/formService';
import * as dropdownService from '../Services/dropdownService';

export default function ViewForm(props) {
	const { recordForEdit } = props;
	const [values, setValues] = useState(formService.initialUserFormValues);

	useEffect(() => {
		if (recordForEdit != null) {
            const role = dropdownService.getUserRoleByValue(recordForEdit.role);
            setValues(prev => ({
				...recordForEdit,
                role: role.value
			}));
		}
	}, [recordForEdit]);

	return (
		<>
			<Grid container>
				<Grid item xs={6}>
					<p style={{ width: '650px' }}>
						<FormLabel>First Name: {values.firstname}</FormLabel>
					</p>
					<p style={{ width: '650px' }}>
						<FormLabel>Last Name: {values.lastname}</FormLabel>
					</p>
					<p style={{ width: '650px' }}>
						<FormLabel>Role: {values.role}</FormLabel>
					</p>
					<p style={{ width: '650px' }}>
						<FormLabel>Wallet Address: {values.walletAddress}</FormLabel>
					</p>
				</Grid>
			</Grid>
		</>
	);
}
