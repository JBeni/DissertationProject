import React, { useState, useEffect } from 'react';
import { Grid, FormLabel } from '@material-ui/core';
import { getProjectStatusByValue, initialProjectFormValues } from '../applicationService';

export default function ViewProjectForm(props) {
	const { recordForEdit } = props;
	const [values, setValues] = useState(initialProjectFormValues);

	useEffect(() => {
		if (recordForEdit != null) {
            let status = getProjectStatusByValue(recordForEdit['projectStatus']);
			const newData = {
				name: recordForEdit['name'],
				description: recordForEdit['description'],
				status: status.value,
				ipfsFileCID: recordForEdit['ipfsFileCID'],
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
					<p style={{ width: '670px' }}>
						<FormLabel>Name: {values.name}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Description: {values.description}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Status: {values.status}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Pinata File CID: {values.ipfsFileCID}</FormLabel>
					</p>
				</Grid>
			</Grid>
		</>
	);
}
