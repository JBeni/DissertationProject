import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export function Example() {
	const notify = () =>
		toast.success('Always at the bottom.', {
			position: 'bottom-center',
		});

	return (
		<div>
			<button onClick={notify}>Make me a toast</button>
			<Toaster position="bottom-center" reverseOrder={false} />
		</div>
	);
}
