import React from 'react';
import LineChart from '../Charts/LinearChart';

function Dashboard(props) {
    return (
        <div>
            <br/><br/>
            <LineChart account={props.account} project={props.project} />
        </div>
    )
}

export default Dashboard
