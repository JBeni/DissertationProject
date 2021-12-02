import React, { useState, useEffect } from 'react';
import '../Styles/TableHistory.css';
import WaitingLoader from '../Views/WaitingLoader';

export default function ProjectHistory(props) {
	const { projectHistory } = props;

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (projectHistory?.length > 0) {
            setLoading(true);
        }
    }, [projectHistory])

    if (loading === false) return <WaitingLoader />

    return (
		<div className="container-body">
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Status</th>
						<th>File CID</th>
						<th>Project Address</th>
						<th>User Address</th>
						<th>Timestamp</th>
						<th>Signature</th>
					</tr>
				</thead>
				<tbody>
                    {
                        projectHistory.map((item) => (
                            <tr key={ item.index }>
                                <td>{ item.name }</td>
                                <td>{ item.status }</td>
                                <td>{ item.ipfsFileCID }</td>
                                <td>{ item.projectAddress }</td>
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
