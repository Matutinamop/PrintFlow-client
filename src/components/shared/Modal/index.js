import React from 'react';
import styles from './modal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import clsx from 'clsx';

function Modal({
	children,
	title,
	success,
	isOpen,
	onClose,
	transparent,
}) {
	return isOpen ? (
		<div className={styles.background}>
			<div
				className={`${
					transparent
						? styles.transparentModalContainer
						: clsx(styles.modalContainer, {
								[styles.success]: success,
						  })
				}`}
			>
				<header className={styles.modalHeader}>
					<h3>{title}</h3>
					<button
						className={styles.closeButton}
						onClick={onClose}
					>
						<CloseIcon />
					</button>
				</header>
				{children}
			</div>
		</div>
	) : (
		''
	);
}

export default Modal;
