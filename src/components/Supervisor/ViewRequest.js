import React, { useState, useEffect } from 'react';
import { Grid, FormLabel } from '@material-ui/core';
import * as formService from '../Services/formService';

export default function ViewRequest(props) {
	const { recordForEdit } = props;
	const [values, setValues] = useState(formService.initialProjectFormValues);

	useEffect(() => {
		if (recordForEdit != null) {
            setValues(prev => ({
				...recordForEdit,
                timestamp: new Date(values.timestamp * 1000).toString()
			}));
		}
	}, []);

	return (
		<>
			<Grid container>
				<Grid item xs={6}>
					<p style={{ width: '670px' }}>
						<FormLabel>Title: {values.title}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Request Status: {values.requestStatus}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Project Status: {values.projectStatus}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Request Address: {values.requestAddress}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Project Address: {values.projectAddress}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Signer Address: {values.signerAddress}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Timestamp: {values.timestamp}</FormLabel>
					</p>
				</Grid>
			</Grid>
		</>
	);
}
