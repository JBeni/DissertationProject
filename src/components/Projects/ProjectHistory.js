import React, { useState, useEffect } from 'react';
import '../Styles/TableHistory.css';
import WaitingLoader from '../Views/WaitingLoader';
import { Button } from '@material-ui/core';

export default function ProjectHistory(props) {
	const { projectHistory } = props;
	const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (projectHistory?.length > 0) {
            setLoading(true);
            setMessage('The data is loading. Wait a moment...');
            return;
        } else {
            setMessage('There are no data at the moment...');
        }
    }, [projectHistory]);

    const verifySignature = async (_projectAddress, _signerAddress, _signature) => {
        const v = '0x' + _signature.slice(130, 132).toString();
        const r = _signature.slice(0, 66).toString();
        const s = '0x' + _signature.slice(66, 130).toString();
        const messageHash = props.web3.eth.accounts.hashMessage(_projectAddress);

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
						<th>Name</th>
						<th>Status</th>
						<th>File CID</th>
						<th>Project Address</th>
						<th>Signer Address</th>
						<th>Timestamp</th>
						<th>Signature</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{projectHistory.map((item) => (
						<tr key={item.index}>
							<td>{item.name}</td>
							<td>{item.status}</td>
							<td>{item.ipfsFileCID}</td>
							<td>{item.projectAddress}</td>
							<td>{item.signerAddress}</td>
							<td>{item.timestamp}</td>
							<td>{item.signature}</td>
							<td>
                                <Button color="secondary" onClick={ () =>
                                    verifySignature(item.projectAddress, item.signerAddress, item.signature)
                                }>Verify Signature</Button>
                            </td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
