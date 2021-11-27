import React, { useState, useEffect } from 'react';
import { useStylesLoader } from '../sharedResources';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../Styles/Loader.css';

export default function Loader(props) {
    const classes = useStylesLoader();
    const { unAuthorisedUser } = props;
    const [content, setContent] = useState();

    useEffect(() => {
        if (unAuthorisedUser === false) {
            setContent(
                <div className="text-loader">
                    <p>The Project contract not deployed to detected network.</p>
                    <p>You need to start the Ganache deployment network to run this project.</p>
                    <p>You must login into MetaMask then select the Ganache network.</p>
                </div>
            );
        } else if (unAuthorisedUser === true) {
            setContent(
                <div className="text-loader">
                    <p></p>
                    <p>Unauthorized Access</p>
                    <p></p>
                </div>
            );
        }
    }, [unAuthorisedUser]);

	return (
		<div className={classes.root}>
			<CircularProgress size={0.8 * 500} color="primary" className="center-container" />
            {content}
		</div>
	);
}
