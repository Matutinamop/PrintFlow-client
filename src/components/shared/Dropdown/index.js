import React, { useState } from 'react';
import styles from './dropdown.module.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function Dropdown({
	options,
	handleSelect,
	handleIndex,
	dark,
}) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const selectOption = (select, index) => {
		setIsOpen(!isOpen);
		if (handleSelect) {
			handleSelect(select);
		}
		if (handleIndex) handleIndex(index);
	};

	return (
		<div className={styles.dropdown}>
			<button
				type="button"
				className={
					dark
						? `${styles.dropdownBtn} ${styles.dropdownBtnDark}`
						: styles.dropdownBtn
				}
				onClick={toggleDropdown}
			>
				<ArrowDropDownIcon sx={{ fontSize: '1.2rem' }} />
			</button>
			{isOpen && (
				<ul className={styles.dropdownMenu}>
					{options?.map((option, index) => (
						<li
							key={index}
							onClick={() => selectOption(option, index)}
						>
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default Dropdown;
