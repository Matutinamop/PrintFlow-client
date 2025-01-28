import { useEffect, useRef, useState } from 'react';
import styles from './inputs.module.css';

export function Input({
	name,
	children,
	placeholder,
	isDisabled = false,
	type,
	value,
	onChange,
	size,
	orientation = 'vertical',
	required = false,
	min = '0',
	max,
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
				autoComplete="off"
				disabled={isDisabled}
				name={name}
				min={min}
				max={max}
				placeholder={placeholder}
				type={type}
				value={value}
				onChange={onChange}
				className={`${styles.input} ${
					isDisabled ? styles.disabled : ''
				}`}
				required={required}
			></input>
		</div>
	);
}

export function SearchableInput({
	name,
	children,
	placeholder,
	type,
	onChange,
	size,
	orientation = 'vertical',
	required = false,
	min = '0',
	options,
	ifMatch,
	autoComplete = 'off',
}) {
	const [inputValue, setInputValue] = useState('');

	const [filteredOptions, setFilteredOptions] =
		useState(options);
	const [isFocused, setIsFocused] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] =
		useState(false);
	const [highlightedIndex, setHighlightedIndex] =
		useState(-1);
	const containerRef = useRef(null);
	const listRef = useRef(null);

	const isExactMatch = options?.includes(inputValue);

	useEffect(() => {
		if (ifMatch) {
			ifMatch(inputValue);
		}
	}, [isExactMatch]);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setInputValue(value);

		const filtered = options.filter((option) =>
			option?.toLowerCase().includes(value.toLowerCase())
		);
		setFilteredOptions(filtered);
		setIsDropdownOpen(filtered.length > 0);
		setHighlightedIndex(-1);
	};

	const handleOptionClick = (option) => {
		setInputValue(option);
		setFilteredOptions(options);
		setIsDropdownOpen(false);
		setHighlightedIndex(-1);

		const e = {
			target: { name: name, value: option },
		};
		onChange(e);
	};

	const handleFocus = () => {
		setIsFocused(true);
		setIsDropdownOpen(true);
	};

	const handleBlur = (e) => {
		if (!containerRef.current.contains(e.relatedTarget)) {
			setTimeout(() => {
				setIsFocused(false);
				setIsDropdownOpen(false);
			}, 100);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (highlightedIndex < filteredOptions.length - 1) {
				setHighlightedIndex((prevIndex) => prevIndex + 1);
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (highlightedIndex > 0) {
				setHighlightedIndex((prevIndex) => prevIndex - 1);
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (highlightedIndex >= 0) {
				handleOptionClick(
					filteredOptions[highlightedIndex]
				);
			}
		}
	};

	useEffect(() => {
		if (listRef.current && highlightedIndex >= 0) {
			const highlightedOption =
				listRef.current.children[highlightedIndex];
			if (highlightedOption) {
				const { offsetTop, clientHeight } =
					highlightedOption;
				const { scrollTop, clientHeight: listHeight } =
					listRef.current;

				if (offsetTop < scrollTop) {
					listRef.current.scrollTop = offsetTop;
				} else if (
					offsetTop + clientHeight >
					scrollTop + listHeight
				) {
					listRef.current.scrollTop =
						offsetTop + clientHeight - listHeight;
				}
			}
		}
	}, [highlightedIndex, isDropdownOpen]);
	return (
		<div
			ref={containerRef}
			style={{ position: 'relative' }}
			className={`${styles.container} ${styles[orientation]} ${styles[size]}`}
			onFocus={handleFocus}
			onBlur={handleBlur}
		>
			<label className={`${styles.label} ${styles[size]}`}>
				{children}
				{required && (
					<span className={styles.required}>*</span>
				)}
			</label>
			<input
				autoComplete={autoComplete}
				name={name}
				min={min}
				placeholder={placeholder}
				type={type}
				value={inputValue}
				onChange={(e) => {
					handleInputChange(e);
					onChange(e);
				}}
				className={styles.input}
				required={required}
				onKeyDown={handleKeyDown}
			/>
			{filteredOptions.length > 0 &&
				isDropdownOpen &&
				!isExactMatch &&
				isFocused && (
					<ul ref={listRef} className={styles.ul}>
						{filteredOptions.map((option, index) => (
							<li
								key={index}
								onClick={() => handleOptionClick(option)}
								className={`${styles.li} ${
									highlightedIndex === index
										? styles.highlightLi
										: ''
								}`}
							>
								{option}
							</li>
						))}
					</ul>
				)}
		</div>
	);
}

export function TextArea({
	name,
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
				name={name}
				style={{ width: width, height: height }}
				className={styles.textarea}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
			></textarea>
		</div>
	);
}
