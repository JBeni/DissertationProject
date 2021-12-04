import React, { useState, useEffect } from 'react';
import '../Styles/TableHistory.css';
import WaitingLoader from '../Views/WaitingLoader';
import { Button } from '@material-ui/core';

export default function ProjectHistory(props) {
	const { projectHistory } = props;

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (projectHistory?.length > 0) {
			setLoading(true);
		}
	}, [projectHistory]);

    const verifySignature = async (_projectAddress, _signerAddress, _signature) => {
        let v = '0x' + _signature.slice(130, 132).toString();
        let r = _signature.slice(0, 66).toString();
        let s = '0x' + _signature.slice(66, 130).toString();
        let messageHash = this.props.web3.eth.accounts.hashMessage(_projectAddress);

        let verificationOutput = await this.props.project.methods
            .verifySignature(_signerAddress, messageHash, v, r, s)
            .call({ from: this.props.account });
        console.log(verificationOutput);
    }

	if (loading === false) return <WaitingLoader />;

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
                                <Button variant="contained" color="secondary" onClick={ () =>
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
