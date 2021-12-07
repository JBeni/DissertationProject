import React, { useState, useEffect } from 'react';
import '../Styles/TableHistory.css';
import WaitingLoader from '../Views/WaitingLoader';
import { Button } from '@material-ui/core';

export default function ProjectReqHistory(props) {
	const { projectReqHistory } = props;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log(projectReqHistory);


        if (projectReqHistory?.length > 0) {
            setLoading(true);
            setMessage('The data is loading. Wait a moment...');
            return;
        }
        setMessage('There are no data at the moment...');
    }, [projectReqHistory])

    const verifySignature = async (_projectAddress, _signerAddress, _signature) => {
        const v = '0x' + _signature.slice(130, 132).toString();
        const r = _signature.slice(0, 66).toString();
        const s = '0x' + _signature.slice(66, 130).toString();
        const messageHash = props.web3.eth.accounts.hashMessage(_projectAddress);

        const verificationOutput = await props.signatureChain.methods
            .verifySignature(_signerAddress, messageHash, v, r, s)
            .call();
        console.log(verificationOutput);
    }

    if (loading === false) return <WaitingLoader message={message} />

    return (
		<div className="container-body">
			<table>
				<thead>
					<tr>
						<th>Title</th>
						<th>Comments</th>
						<th>Project Status</th>
						<th>Request Status</th>
						<th>Project Address</th>
						<th>Request Address</th>
						<th>Signer Address</th>
						<th>Timestamp</th>
						<th>Signature</th>
					</tr>
				</thead>
				<tbody>
                    {
                        projectReqHistory.map((item) => (
                            <tr key={ item.index }>
                                <td>{ item.title }</td>
                                <td>{ item.comments }</td>
                                <td>{ item.status }</td>
                                <td>{ item.requestStatus }</td>
                                <td>{ item.projectAddress }</td>
                                <td>{ item.requestAddress }</td>
                                <td>{ item.signerAddress }</td>
                                <td>{ item.timestamp }</td>
                                <td>
                                    <Button variant="contained" color="secondary" onClick={ () =>
                                        verifySignature(item.projectAddress, item.signerAddress, item.signature)
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
