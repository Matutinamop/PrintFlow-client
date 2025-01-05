import React from 'react';
import styles from './form.module.css';
import Dropdown from '../../shared/Dropdown';
import { Input } from '../../shared/Inputs';
import { changeValue } from '../../../utilities/functions/forms/fields';

function ClientInfoModule({
	client,
	setContactInfo,
	fields,
	setFields,
	selectStyles,
}) {
	return (
		<div className={styles.block}>
			<div className={styles.blockTitle}>
				<h3>Información del cliente: </h3>
				<Dropdown
					handleIndex={setContactInfo}
					options={client?.contact?.map(
						(contact) => contact.name
					)}
				/>
			</div>
			<Input
				name={'RUT'}
				size={'big'}
				value={fields.RUT ? fields.RUT : ''}
				onChange={(e) => changeValue(e, setFields)}
				isDisabled
			>
				RUT
			</Input>
			<Input
				name={'contactName'}
				size="normal"
				value={fields.contactName ? fields.contactName : ''}
				onChange={(e) => changeValue(e, setFields)}
			>
				Contacto:{' '}
			</Input>
			<Input
				name={'contactPhone'}
				value={
					fields.contactPhone ? fields.contactPhone : ''
				}
				size="normal"
				onChange={(e) => changeValue(e, setFields)}
			>
				Teléfono:
			</Input>
			<Input
				name={'contactEmail'}
				value={
					fields.contactEmail ? fields.contactEmail : ''
				}
				size="normal"
				onChange={(e) => changeValue(e, setFields)}
			>
				Email:{' '}
			</Input>
			<div className={styles.inputContainer}>
				<label>Datos de entrega:</label>
				<textarea
					name="deliveryData"
					onChange={(e) => changeValue(e, setFields)}
					className={styles.textArea}
				/>
			</div>
		</div>
	);
}

export default ClientInfoModule;
