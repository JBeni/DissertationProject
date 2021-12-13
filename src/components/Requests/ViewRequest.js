import React, { useState, useEffect } from 'react';
import { Grid, FormLabel, Button } from '@material-ui/core';
import * as formService from '../Services/formService';
import { verifySignatureRequest } from '../../components/sharedResources';

export default function ViewRequest(props) {
	const { recordForView } = props;
	const [values, setValues] = useState(formService.initialRequestFormValues);

	useEffect(() => {
		if (recordForView != null) {
            setValues(prev => ({
				...recordForView,
                timestamp: new Date(values.timestamp * 1000).toString()
			}));
		}
	}, []);

    const verifySignature = async (_requestAddress, _signerAddress, _signature) => {
        await verifySignatureRequest(props, _requestAddress, _signerAddress, _signature);
    }

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
						<FormLabel>Request Type: {values.requestType}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Project Address: {values.projectAddress}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Request Address: {values.requestAddress}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>Signer Address: {values.signerAddress}</FormLabel>
					</p>
					<p style={{ width: '670px', wordBreak: 'break-word' }}>
						<FormLabel>Timestamp: {values.timestamp}</FormLabel>
					</p>
					<p style={{ width: '670px', wordBreak: 'break-word' }}>
						<FormLabel>Signature: {values.signature}</FormLabel>
					</p>
					<p style={{ width: '670px' }}>
						<FormLabel>
                            <Button variant="contained" color="secondary" onClick={ () =>
                                verifySignature(values.requestAddress, values.signerAddress, values.signature)
                            }>Verify Signature</Button>
                        </FormLabel>
					</p>
				</Grid>
			</Grid>
		</>
	);
}
