import React from 'react';
import styles from './paper.module.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function Paper({ title, children }) {
	return (
		<div className={styles.paper}>
			<div className={styles.header}>
				<h3>{title}</h3>
				<MoreHorizIcon />
			</div>
			<div className={styles.content}>{children}</div>
		</div>
	);
}

export default Paper;
