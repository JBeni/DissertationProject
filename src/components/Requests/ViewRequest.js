import React, { useState, useEffect } from 'react';
import { Grid, FormLabel, Button } from '@material-ui/core';
import * as formService from '../Services/formService';

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
        const v = '0x' + _signature.slice(130, 132).toString();
        const r = _signature.slice(0, 66).toString();
        const s = '0x' + _signature.slice(66, 130).toString();
        const messageHash = props.web3.eth.accounts.hashMessage(_requestAddress);

        const signer = await props.web3.eth.accounts.recover(messageHash, v, r, s, true);
        const verificationOutput = _signerAddress === signer ? true : false;

        if (verificationOutput) {
            alert('Signer Address is verified successfully!');
        } else {
            alert('Signer Address is not verified!');
        }
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
