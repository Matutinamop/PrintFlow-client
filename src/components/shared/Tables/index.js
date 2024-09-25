import clsx from 'clsx';
import styles from './tables.module.css';

export function Table({ children }) {
	return <table className={styles.table}>{children}</table>;
}

export function Thead({ children }) {
	return <thead className={styles.thead}>{children}</thead>;
}

export function Th({ children, size = 'normal' }) {
	return (
		<th className={`${styles.th} ${styles[size]}`}>
			{children}
		</th>
	);
}

export function Tbody({ children }) {
	return <tbody className={styles.tbody}>{children}</tbody>;
}

export function Tr({ children, urgent, warning }) {
	return (
		<tr
			className={clsx(styles.tr, {
				[styles.urgent]: urgent,
				[styles.warning]: warning,
			})}
		>
			{children}
		</tr>
	);
}

export function Td({ children, size = 'normal' }) {
	return (
		<td className={`${styles.td} ${styles[size]}`}>
			{children}
		</td>
	);
}
