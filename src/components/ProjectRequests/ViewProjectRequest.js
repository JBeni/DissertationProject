import React, { useState, useEffect } from 'react';
import { Grid, FormLabel } from '@material-ui/core';
import * as formService from '../Services/formService';
import * as dropdownService from '../Services/dropdownService';

export default function ViewProjectRequest(props) {
	const { recordForEdit } = props;
	const [values, setValues] = useState(formService.initialProjectFormValues);

	useEffect(() => {
		if (recordForEdit != null) {
            let status = dropdownService.getProjectStatusByValue(recordForEdit.status);
			const newData = {
				title: recordForEdit.title,
				comments: recordForEdit.comments,
				status: status.value,
				requestStatus: recordForEdit.requestStatus,
                projectAddress: recordForEdit.projectAddress,
                signerAddress: recordForEdit.signerAddress,
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
						<FormLabel>Title: {values.title}</FormLabel>
					</p>
                    {
                        values.comments?.length > 0 &&
                        <p style={{ width: '670px', border: '2px solid red' }}>
                            <FormLabel>Comments: {values.comments}</FormLabel>
                        </p>
                    }
					<p style={{ width: '670px' }}>
						<FormLabel>Request Status: {values.requestStatus}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Project Status: {values.status}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Project Address: {values.projectAddress}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Signer Address: {values.signerAddress}</FormLabel>
					</p>
				</Grid>
			</Grid>
		</>
	);
}
