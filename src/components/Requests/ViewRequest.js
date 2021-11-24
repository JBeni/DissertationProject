import React, { useState, useEffect } from 'react';
import { Grid, FormLabel } from '@material-ui/core';
import { initialProjectFormValues } from '../Services/formService';
import { getProjectStatusByValue, getRequestStatusByValue } from '../Services/dropdownService';

export default function ViewRequest(props) {
	const { recordForEdit } = props;
	const [values, setValues] = useState(initialProjectFormValues);

	useEffect(() => {
        console.log(recordForEdit);
		if (recordForEdit != null) {
            let projectStatus = getProjectStatusByValue(recordForEdit.projectStatus);
            let requestStatus = getRequestStatusByValue(recordForEdit.requestStatus);
			const newData = {
				title: recordForEdit.title,
				projectStatus: projectStatus.value,
                requestStatus: requestStatus.value,
                projectAddress: recordForEdit.projectAddress,
                userAddress: recordForEdit.userAddress
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
					<p style={{ width: '670px' }}>
						<FormLabel>Request Status: {values.requestStatus}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Project Status: {values.projectStatus}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Project Address: {values.projectAddress}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>User Status: {values.userAddress}</FormLabel>
					</p>
				</Grid>
			</Grid>
		</>
	);
}
