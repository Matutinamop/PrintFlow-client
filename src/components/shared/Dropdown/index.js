import React, { useState } from 'react';
import styles from './dropdown.module.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function Dropdown({ options, handleClick }) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const selectOption = (select) => {
		setIsOpen(!isOpen);
		handleClick(select);
	};

	return (
		<div className={styles.dropdown}>
			<button
				className={styles.dropdownBtn}
				onClick={toggleDropdown}
			>
				<ArrowDropDownIcon />
			</button>
			{isOpen && (
				<ul className={styles.dropdownMenu}>
					{options.map((option, index) => (
						<li
							key={index}
							onClick={() => selectOption(option)}
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
