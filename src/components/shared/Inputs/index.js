import styles from './inputs.module.css';

export function Input({
	children,
	placeholder,
	type,
	value,
	onChange,
	size,
	orientation = 'horizontal',
	required = false,
}) {
	return (
		<div
			className={`${styles.container} ${styles[orientation]} ${styles[size]}`}
		>
			<label className={styles.label}>
				{children}
				{required && (
					<span className={styles.required}>*</span>
				)}
			</label>
			<input
				placeholder={placeholder}
				type={type}
				value={value}
				onChange={onChange}
				className={styles.input}
				required={required}
			></input>
		</div>
	);
}
