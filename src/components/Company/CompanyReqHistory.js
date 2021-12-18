import React, { useState, useEffect } from 'react';
import '../Styles/TableHistory.css';
import WaitingLoader from '../Views/WaitingLoader';
import { Button } from '@material-ui/core';
import { verifySignatureEntity } from '../../components/sharedResources';

export default function CompanyReqHistory(props) {
	const { projectReqHistory } = props;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (projectReqHistory?.length > 0) {
            setMessage('The data is loading. Wait a moment.');
            setLoading(true);
        } else {
            setMessage('There are no data at the moment.');
        }
    }, [projectReqHistory])

    const verifySignature = async (_requestAddress, _signerAddress, _signature) => {
        await verifySignatureEntity(props, _requestAddress, _signerAddress, _signature);
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
                                <td>{ item.projectStatus }</td>
                                <td>{ item.requestStatus }</td>
                                <td>{ item.projectAddress }</td>
                                <td>{ item.requestAddress }</td>
                                <td>{ item.signerAddress }</td>
                                <td>{ item.timestamp }</td>
                                <td>
                                    <Button color="secondary" onClick={ () =>
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
