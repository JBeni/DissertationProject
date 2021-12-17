import React, { useState, useEffect } from 'react';
import '../Styles/TableHistory.css';
import WaitingLoader from '../Views/WaitingLoader';

export default function UserHistory(props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (props.userHistory?.length > 0) {
            setMessage('The data is loading. Wait a moment.');
            setLoading(true);
        } else {
            setMessage('There are no data at the moment.');
        }
    }, [props.userHistory]);

	if (loading === false) return <WaitingLoader message={message} />;

    return (
		<div className="container-body">
			<table>
				<thead>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Role</th>
						<th>Wallet Address</th>
						<th>Timestamp</th>
					</tr>
				</thead>
				<tbody>
                    {
                        props?.userHistory.map((item) => (
                            <tr key={ item.index }>
                                <td>{ item.firstname }</td>
                                <td>{ item.lastname }</td>
                                <td>{ item.role }</td>
                                <td>{ item.walletAddress }</td>
                                <td>{ item.timestamp }</td>
                            </tr>
                        ))
                    }
				</tbody>
			</table>
		</div>
	);
};
