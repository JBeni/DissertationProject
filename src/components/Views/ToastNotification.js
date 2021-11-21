import React from 'react';
import classNames from 'classnames';
import toast, { Toaster } from 'react-hot-toast';
import { MdOutlineClose } from 'react-icons/md';
import { HiLightningBolt } from 'react-icons/hi';

import styles from './App.module.css';

const notify = () =>
	toast.custom(
		(t) => (
			<div
				className={classNames([
					styles.notificationWrapper,
					t.visible ? 'top-0' : '-top-96',
				])}
			>
				<div className={styles.iconWrapper}>
					<HiLightningBolt />
				</div>
				<div className={styles.contentWrapper}>
					<h1>New version available</h1>
					<p>
						An improved version of VESSEL is now available, refresh to update.
					</p>
				</div>
				<div className={styles.closeIcon} onClick={() => toast.dismiss(t.id)}>
					<MdOutlineClose />
				</div>
			</div>
		),
		{ id: 'unique-notification', position: 'top-center' }
	);
