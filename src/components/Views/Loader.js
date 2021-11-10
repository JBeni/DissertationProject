import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../Styles/Loader.css';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
}));

export default function Loader() {
    const classes = useStyles();

	return (
		<div className={classes.root}>
			<CircularProgress size={0.8 * 500} color="secondary" className="center-container" />
            <div className="text-loader">
                <p>The Project contract not deployed to detected network.</p>
                <p>You need to start the Ganache deployment network to run this project.</p>
                <p>You must login into MetaMask then select the Ganache network.</p>
            </div>
		</div>
	);
}
