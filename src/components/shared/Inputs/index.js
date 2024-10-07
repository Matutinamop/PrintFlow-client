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
	min = '0',
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
				min={min}
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

export function TextArea({
	children,
	placeholder,
	value,
	onChange,
	orientation = 'horizontal',
	width = '50%',
	height = '100px',
}) {
	return (
		<div
			className={`${styles.container} ${styles[orientation]}`}
		>
			<label className={styles.label}>{children}</label>
			<textarea
				style={{ width: width, height: height }}
				className={styles.textarea}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
			></textarea>
		</div>
	);
}
