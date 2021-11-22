import React, { useState, useEffect } from 'react';
import { Grid, FormLabel } from '@material-ui/core';
import { initialProjectFormValues } from '../formService';
import { getProjectStatusByValue } from '../dropdownService';

export default function ViewProjectRequest(props) {
	const { recordForEdit } = props;
	const [values, setValues] = useState(initialProjectFormValues);

	useEffect(() => {
		if (recordForEdit != null) {
            let status = getProjectStatusByValue(recordForEdit.status);
			const newData = {
				title: recordForEdit.title,
				comments: recordForEdit.comments,
				status: status.value,
				requestStatus: recordForEdit.requestStatus,
                projectAddress: recordForEdit.projectAddress,
                userAddress: recordForEdit.userAddress,
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
						<FormLabel>User Address: {values.userAddress}</FormLabel>
					</p>
				</Grid>
			</Grid>
		</>
	);
}
