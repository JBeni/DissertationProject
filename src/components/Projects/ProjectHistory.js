import React, { useState, useEffect } from 'react';
import '../Styles/TableHistory.css';
import WaitingLoader from '../Views/WaitingLoader';
import { Button } from '@material-ui/core';
import { verifySignatureEntity } from '../sharedResources';

export default function ProjectHistory(props) {
	const { projectHistory } = props;
	const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (projectHistory?.length > 0) {
            setMessage('The data is loading. Wait a moment.');
            setLoading(true);
        } else {
            setMessage('There are no data at the moment.');
        }
    }, [projectHistory]);

    const verifySignature = async (_projectAddress, _signerAddress, _signature) => {
        await verifySignatureEntity(props, _projectAddress, _signerAddress, _signature);
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
