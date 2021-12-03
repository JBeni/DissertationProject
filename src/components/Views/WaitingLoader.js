import React from 'react';
import { useStylesLoader } from '../sharedResources';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../Styles/Loader.css';

export default function WaitingLoader(props) {
    const classes = useStylesLoader();
    const { message } = props;

	return (
		<div className={classes.root}>
			<CircularProgress size={0.8 * 100} color="primary" className="waiting-center-container" />
            <div>
                <p className="message-center">{ message }</p>
            </div>
		</div>
	);
}
