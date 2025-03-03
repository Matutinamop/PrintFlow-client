import zIndex from '@mui/material/styles/zIndex';
import { height, width } from '@mui/system';

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
		height: '25px',
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
	menu: (provided, state) => ({
		...provided,
		marginTop: '0',
		zIndex: 2,
	}),
	menuList: (provided, state) => ({
		...provided,
		height: '150px',
		zIndex: 2,
	}),
	menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

export const clientStyle = {
	...selectStyles,
	control: (provided, state) => ({
		...provided,
		minHeight: '25px',
		minWidth: '100%',
		height: '80px',
		width: '100%',
		fontSize: '16px',
		border: '1px solid #ccc',
		borderRadius: '4px',
		boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
	}),
	input: (provided, state) => ({
		...provided,
	}),
	valueContainer: (provided, state) => ({
		...provided,
		padding: '0 6px',
	}),
	container: (provided, state) => ({
		...provided,
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
