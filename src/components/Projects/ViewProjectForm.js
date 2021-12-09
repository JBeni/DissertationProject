import React, { useState, useEffect } from 'react';
import { Grid, FormLabel } from '@material-ui/core';
import * as formService from '../Services/formService';
import * as dropdownService from '../Services/dropdownService';

export default function ViewProjectForm(props) {
	const { recordForEdit } = props;
	const [values, setValues] = useState(formService.initialProjectFormValues);

	useEffect(() => {
		if (recordForEdit != null) {
            const status = dropdownService.getProjectStatusByValue(recordForEdit.status);
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
						<FormLabel>IPFS File CID: {values.ipfsFileCID}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Project Address: {values.projectAddress}</FormLabel>
					</p>
				</Grid>
			</Grid>
		</>
	);
}
