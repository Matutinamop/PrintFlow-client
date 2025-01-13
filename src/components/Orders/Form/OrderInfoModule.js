import React from 'react';
import styles from './form.module.css';
import { Input } from '../../shared/Inputs';
import CreatableSelect from 'react-select/creatable';
import { useDispatch } from 'react-redux';
import { fetchClientById } from '../../../redux/clients/clientsSlice';
import { changeValue } from '../../../utilities/functions/forms/fields';
import {
	clientStyle,
	selectStyles,
} from '../../../utilities/selectStyles/selectStyles';

function OrderInfoModule({ clients, fields, setFields }) {
	const dispatch = useDispatch();

	const clientOptions = clients?.map((client) => ({
		key: client._id,
		value: client._id,
		label: client.companyName,
	}));

	const selectClient = (option) => {
		const clientSelected = clients.find(
			(client) => client._id === option.value
		);
		setFields((prev) => ({
			...prev,
			client: clientSelected,
		}));
	};

	return (
		<div className={styles.blockContainer}>
			<div className={styles.leftBlock}>
				{' '}
				<label className={styles.label}>
					Familia:
				</label>{' '}
				<input
					className={styles.printTaskInput}
					name={'product'}
					onChange={(e) => changeValue(e, setFields)}
				></input>
				<label className={styles.label}>
					Fecha Estimada:
				</label>
				<input
					className={styles.dateInput}
					type="date"
					name="dateEstimate"
					value={fields.dateEstimate ?? ''}
					onChange={(e) => changeValue(e, setFields)}
				/>
				<label className={styles.label}>
					Fecha Limite:
				</label>
				<input
					className={styles.dateInput}
					type="date"
					name="dateFinal"
					value={fields.dateFinal ?? ''}
					onChange={(e) => changeValue(e, setFields)}
				/>
			</div>
			<div className={styles.rightBlock}>
				<div className={styles.selectClientContainer}>
					<label className={styles.label}>Cliente:</label>
					<CreatableSelect
						styles={clientStyle}
						name="client"
						onChange={(option) => {
							selectClient(option);
							dispatch(fetchClientById(option.key));
						}}
						options={clientOptions}
						placeholder={''}
					/>
				</div>
				<input
					className={styles.clientInput}
					disabled
					value={fields.client.legalName}
				></input>
				<input
					className={styles.clientInput}
					disabled
					value={fields.client.address}
				></input>
				<input
					className={styles.clientInput}
					disabled
					value={fields.client.phone}
				></input>
			</div>
		</div>
	);
}

export default OrderInfoModule;
