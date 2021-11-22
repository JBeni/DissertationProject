import React, { useState, useEffect } from 'react';
import { Grid, FormLabel } from '@material-ui/core';
import { initialUserFormValues } from './../formService';
import { getUserRoleByValue } from './../dropdownService';

export default function ViewForm(props) {
	const { recordForEdit } = props;
	const [values, setValues] = useState(initialUserFormValues);

	useEffect(() => {
		if (recordForEdit != null) {
            let role = getUserRoleByValue(recordForEdit.role);
            let newData = {
				username: recordForEdit.username,
				firstname: recordForEdit.firstname,
				lastname: recordForEdit.lastname,
				email: recordForEdit.email,
				role: role.value,
				walletAddress: recordForEdit.walletAddress,
			};
			setValues({
				...newData,
			});
		}
	}, [recordForEdit]);

	return (
		<>
			<Grid container>
				<Grid item xs={6}>
					<p style={{ width: '650px' }}>
						<FormLabel>User Name: {values.username}</FormLabel>
					</p>
					<p style={{ width: '650px' }}>
						<FormLabel>First Name: {values.firstname}</FormLabel>
					</p>
					<p style={{ width: '650px' }}>
						<FormLabel>Last Name: {values.lastname}</FormLabel>
					</p>
					<p style={{ width: '650px' }}>
						<FormLabel>Email: {values.email}</FormLabel>
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
