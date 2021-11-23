import React, { useEffect } from 'react';
import '../Styles/TableHistory.css';

export default function ViewChanges(props) {
	const { userHistory } = props;

    useEffect(() => {
        console.log(userHistory);
    }, [userHistory])

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
