import React, { useState, useEffect } from 'react';
import { Grid, FormLabel } from '@material-ui/core';
import * as formService from '../Services/formService';

export default function ViewProjectForm(props) {
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
						<FormLabel>Name: {values.name}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Status: {values.status}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>IPFS File CID: {values.ipfsFileCID}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Project Address: {values.projectAddress}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Signer Address: {values.signerAddress}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Company Address: {values.companyAddress}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Assigned: {values.assigned.toString()}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Timestamp: {values.timestamp}</FormLabel>
					</p>
				</Grid>
			</Grid>
		</>
	);
}
