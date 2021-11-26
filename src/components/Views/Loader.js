import React, { useEffect } from 'react';
import { useStylesLoader } from '../sharedResources';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../Styles/Loader.css';

export default function Loader(props) {
    const classes = useStylesLoader();
    const { isLoading, isUserInBlockchain } = props;

    useEffect(() => {
    }, []);

	return (
		<div className={classes.root}>
			<CircularProgress size={0.8 * 500} color="primary" className="center-container" />
            {
                isLoading === true ?
                    <div className="text-loader">
                        <p>The Project contract not deployed to detected network.</p>
                        <p>You need to start the Ganache deployment network to run this project.</p>
                        <p>You must login into MetaMask then select the Ganache network.</p>
                    </div>
                    :
                    isUserInBlockchain === false ?
                    <div className="text-loader">
                        <p></p>
                        <p>Unauthorized Access</p>
                        <p></p>
                    </div>
                    :
                    <></>
            }
		</div>
	);
}
