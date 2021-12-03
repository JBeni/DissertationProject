import React, { useState, useEffect } from 'react';
import '../Styles/TableHistory.css';
import WaitingLoader from '../Views/WaitingLoader';

export default function ProjectReqHistory(props) {
	const { projectReqHistory } = props;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (projectReqHistory?.length > 0) {
            setLoading(true);
            setMessage('The data is loading. Wait a moment...');
            return;
        }
        setMessage('There are no data at the moment...');
    }, [projectReqHistory])

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
						<th>User Address</th>
						<th>Timestamp</th>
						<th>Signature</th>
					</tr>
				</thead>
				<tbody>
                    {
                        projectReqHistory.map((item) => (
                            <tr key={ item.title }>
                                <td>{ item.comments }</td>
                                <td>{ item.status }</td>
                                <td>{ item.requestStatus }</td>
                                <td>{ item.projectAddress }</td>
                                <td>{ item.requestAddress }</td>
                                <td>{ item.userAddress }</td>
                                <td>{ item.timestamp }</td>
                                <td>{ item.signature }</td>
                            </tr>
                        ))
                    }
				</tbody>
			</table>
		</div>
	);
};
