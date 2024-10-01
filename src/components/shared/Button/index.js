import React from 'react';
import styles from './button.module.css';

function Button({ children, onClick, cancel, accept }) {
	return (
		<button
			className={`${styles.button} ${
				cancel ? styles.cancel : ''
			} ${accept ? styles.accept : ''}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

export default Button;
