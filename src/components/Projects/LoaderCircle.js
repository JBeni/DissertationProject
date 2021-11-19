import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoaderCircle = ({ isLoading }) => {
	if (!isLoading) return null;

    return (
		<div
			id="loader"
			className="d-flex justify-content-center align-items-center flex-column"
        >
            <CircularProgress size={0.8 * 100} color="primary" />
			<p>Loading...</p>
		</div>
	);
};

export default LoaderCircle;
