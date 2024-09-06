import React from 'react';
import styles from './nav.module.css';

function NavBar() {
	return (
		<div className={styles.nav}>
			<img
				className={styles.logo}
				src="/assets/logos/printflow-logo.png"
			/>
			PrintFlow
		</div>
	);
}

export default NavBar;
