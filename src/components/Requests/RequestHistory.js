import React, { useState, useEffect } from 'react';
import '../Styles/TableHistory.css';
import { Button } from '@material-ui/core';
import WaitingLoader from './../Views/WaitingLoader';

export default function RequestHistory(props) {
	const { requestHistory } = props;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (requestHistory?.length > 0) {
            setLoading(true);
            setMessage('The data is loading. Wait a moment...');
            return;
        } else {
            setMessage('There are no data at the moment...');
        }
    }, [requestHistory]);

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

    if (loading === false) return <WaitingLoader message={message} />;

    return (
		<div className="container-body">
			<table>
				<thead>
					<tr>
						<th>Title</th>
						<th>Project Status</th>
						<th>Request Status</th>
						<th>Request Type</th>
						<th>Project Address</th>
						<th>Request Address</th>
						<th>Signer Address</th>
						<th>Timestamp</th>
						<th>Signature</th>
                        <th>Actions</th>
					</tr>
				</thead>
				<tbody>
                    {
                        requestHistory.map((item) => (
                            <tr key={ item.index }>
                                <td>{ item.title }</td>
                                <td>{ item.projectStatus }</td>
                                <td>{ item.requestStatus }</td>
                                <td>{ item.requestType }</td>
                                <td>{ item.projectAddress }</td>
                                <td>{ item.requestAddress }</td>
                                <td>{ item.signerAddress }</td>
                                <td>{ item.timestamp }</td>
                                <td>{ item.signature }</td>
                                <td>
                                    <Button variant="contained" color="secondary" onClick={ () =>
                                        verifySignature(item.requestAddress, item.signerAddress, item.signature)
                                    }>Verify Signature</Button>
                                </td>
                            </tr>
                        ))
                    }
				</tbody>
			</table>
		</div>
	);
};
