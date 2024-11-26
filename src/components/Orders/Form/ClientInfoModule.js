import React from 'react';
import styles from './form.module.css';
import Dropdown from '../../shared/Dropdown';
import { Input } from '../../shared/Inputs';

function ClientInfoModule({
	client,
	changeValue,
	setContactInfo,
	fields,
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
				onChange={(e) => changeValue(e)}
				isDisabled
			>
				RUT
			</Input>
			<Input
				name={'contactName'}
				size="normal"
				value={fields.contactName ? fields.contactName : ''}
				onChange={(e) => changeValue(e)}
			>
				Contacto:{' '}
			</Input>
			<Input
				name={'contactPhone'}
				value={
					fields.contactPhone ? fields.contactPhone : ''
				}
				size="normal"
				onChange={(e) => changeValue(e)}
			>
				Teléfono:
			</Input>
			<Input
				name={'contactEmail'}
				value={
					fields.contactEmail ? fields.contactEmail : ''
				}
				size="normal"
				onChange={(e) => changeValue(e)}
			>
				Email:{' '}
			</Input>
			<div className={styles.inputContainer}>
				<label>Datos de entrega:</label>
				<textarea
					name="request"
					onChange={(e) => changeValue(e)}
					className={styles.textArea}
				/>
			</div>
		</div>
	);
}

export default ClientInfoModule;
