import React, { useState, useEffect } from 'react';
import '../Styles/TableHistory.css';
import WaitingLoader from '../Views/WaitingLoader';

export default function UserHistory(props) {
	const { userHistory } = props;

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userHistory?.length > 0) {
            setLoading(true);
        }
    }, [userHistory])

    if (loading === false) return <WaitingLoader />

    return (
		<div className="container-body">
			<table>
				<thead>
					<tr>
						<th>User Name</th>
						<th>Email</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Role</th>
						<th>Wallet Address</th>
						<th>Timestamp</th>
					</tr>
				</thead>
				<tbody>
                    {
                        userHistory.map((item) => (
                            <tr key={ item.index }>
                                <td>{ item.username }</td>
                                <td>{ item.email }</td>
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
