import React from 'react';
import styles from './form.module.css';
import { Input } from '../../shared/Inputs';
import CreatableSelect from 'react-select/creatable';
import { useDispatch } from 'react-redux';
import { fetchClientById } from '../../../redux/clients/clientsSlice';

function OrderInfoModule({
	clients,
	changeValue,
	fields,
	selectStyles,
}) {
	const dispatch = useDispatch();

	const clientOptions = clients.map((client) => ({
		key: client._id,
		value: client.companyName,
		label: client.companyName,
	}));

	return (
		<div className={styles.block}>
			<Input
				name={'product'}
				size="big"
				onChange={(e) => changeValue(e)}
			>
				Familia:{' '}
			</Input>
			<div className={styles.selectClientContainer}>
				<label className={styles.label}>Cliente:</label>
				<CreatableSelect
					styles={selectStyles}
					name="client"
					onChange={(option) => {
						const e = {
							target: {
								name: 'client',
								value: option.value,
							},
						};
						changeValue(e);
						dispatch(fetchClientById(option.key));
					}}
					options={clientOptions}
					placeholder={'selecciona un cliente'}
				/>
			</div>
		</div>
	);
}

export default OrderInfoModule;
