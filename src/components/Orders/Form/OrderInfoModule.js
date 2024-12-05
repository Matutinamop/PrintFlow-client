import React from 'react';
import styles from './form.module.css';
import { Input } from '../../shared/Inputs';
import CreatableSelect from 'react-select/creatable';
import { useDispatch } from 'react-redux';
import { fetchClientById } from '../../../redux/clients/clientsSlice';
import { changeValue } from '../../../utilities/functions/forms/fields';

function OrderInfoModule({
	clients,
	fields,
	setFields,
	selectStyles,
}) {
	const dispatch = useDispatch();

	const clientOptions = clients?.map((client) => ({
		key: client._id,
		value: client.companyName,
		label: client.companyName,
	}));

	return (
		<div className={styles.block}>
			<Input
				name={'product'}
				size="big"
				onChange={(e) => changeValue(e, setFields)}
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
						changeValue(e, setFields);
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
