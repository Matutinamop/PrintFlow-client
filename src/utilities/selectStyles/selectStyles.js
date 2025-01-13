export const selectStyles = {
	control: (provided, state) => ({
		...provided,

		minHeight: '25px',
		height: '25px',
		minWidth: '100%',
		width: '100%',
		fontSize: '11px',
		border: '1px solid #ccc',
		borderRadius: '4px',
		boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
	}),

	valueContainer: (provided, state) => ({
		...provided,
		height: '25px',
		padding: '0 6px',
	}),

	container: (provided, state) => ({
		...provided,
		height: '18px',
	}),

	input: (provided, state) => ({
		...provided,
		margin: '0px',
	}),
	indicatorSeparator: (state) => ({
		display: 'none',
	}),
	indicatorsContainer: (provided, state) => ({
		...provided,
		display: 'none',
	}),
	option: (provided, state) => ({
		...provided,
		fontSize: '12px',
	}),
};

export const clientStyle = {
	...selectStyles,
	control: (provided, state) => ({
		...provided,
		minHeight: '25px',
		height: '25px',
		minWidth: '100%',
		width: '100%',
		fontSize: '16px',
		border: '1px solid #ccc',
		borderRadius: '4px',
		boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
	}),
};

export const operationStyle = {
	...selectStyles,
	menu: (provided, state) => ({
		...provided,
		height: '150px',
	}),

	menuList: (provided, state) => ({
		...provided,
		height: '150px',
	}),
};

export const creatableMultiStyles = {
	control: (provided, state) => ({
		...provided,
		minHeight: '25px',
		minWidth: '100%',
		width: '100%',
		fontSize: '13px',
		border: '1px solid #ccc',
		borderRadius: '4px',
		boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
	}),

	valueContainer: (provided, state) => ({
		...provided,
		padding: '0 6px',
	}),

	input: (provided, state) => ({
		...provided,
		margin: '0px',
	}),
	indicatorSeparator: (state) => ({
		display: 'none',
	}),
	indicatorsContainer: (provided, state) => ({
		...provided,
		display: 'none',
	}),
	option: (provided, state) => ({
		...provided,
		fontSize: '12px',
	}),
};
