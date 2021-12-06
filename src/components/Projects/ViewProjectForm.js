import React, { useState, useEffect } from 'react';
import { Grid, FormLabel } from '@material-ui/core';
import { initialProjectFormValues } from '../Services/formService';
import { getProjectStatusByValue } from '../Services/dropdownService';

export default function ViewProjectForm(props) {
	const { recordForEdit } = props;
	const [values, setValues] = useState(initialProjectFormValues);

	useEffect(() => {
		if (recordForEdit != null) {
            let status = getProjectStatusByValue(recordForEdit.status);
			const newData = {
				name: recordForEdit.name,
				status: status.value,
				ipfsFileCID: recordForEdit.ipfsFileCID,
                projectAddress: recordForEdit.projectAddress
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
						<FormLabel>Status: {values.status}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Pinata File CID: {values.ipfsFileCID}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Project Address: {values.projectAddress}</FormLabel>
					</p>
				</Grid>
			</Grid>
		</>
	);
}
