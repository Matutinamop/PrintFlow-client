import styles from './form.module.css';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { changeValue } from '../../../utilities/functions/forms/fields';
import { Input } from '../../shared/Inputs';
import { createNewClient } from '../../../utilities/functions/client/createNewClient';
import { updateClient } from '../../../utilities/functions/client/updateClient';
import { useSelector } from 'react-redux';

function ClientsForm({
	setOpenModal,
	fields,
	setFields,
	isEdit,
	setIsEdit,
}) {
	const { client } = useSelector((state) => state.clients);

	useEffect(() => {
		if (
			isEdit &&
			client &&
			Object.keys(client).length > 0
		) {
			console.log('hay cliente', client);
			return setFields(client);
		}
		setFields({
			contact: [
				{
					name: '',
					phone: '',
					email: '',
				},
			],
		});
	}, [isEdit, client]);

	const addContact = () => {
		const oldContacts = fields.contact;
		const newContacts = [
			...oldContacts,
			{ name: '', phone: '', email: '' },
		];
		setFields((prev) => ({
			...prev,
			contact: newContacts,
		}));
	};

	const deleteContact = (i) => {
		const newContacts = fields.contact.filter(
			(range, index) => i !== index
		);
		setFields((prev) => ({
			...prev,
			contact: newContacts,
		}));
	};

	const handleContactChange = (e, index) => {
		const updatedContacts = [...fields.contact];
		updatedContacts[index] = {
			...updatedContacts[index],
			[e.target.name]: e.target.value,
		};

		setFields((prev) => ({
			...prev,
			contact: updatedContacts,
		}));
	};

	const handleSubmit = () => {
		if (isEdit && fields._id) {
			updateClient(fields);
		}
		if (!isEdit) {
			createNewClient(fields);
		}
		setIsEdit(false);
		setOpenModal(false);
	};

	useEffect(() => {
		console.log(fields);
	}, [fields]);

	return (
		<div className={styles.formContainer}>
			{isEdit ? (
				<h2>Editar Cliente</h2>
			) : (
				<h2>Nuevo Cliente</h2>
			)}
			<form>
				<div className={styles.labelInput}>
					<label>Nombre:</label>
					<input
						name="companyName"
						value={fields.companyName ?? ''}
						className={styles.input}
						onChange={(e) => changeValue(e, setFields)}
					/>
				</div>
				<div className={styles.labelInput}>
					<label>Razon social:</label>
					<input
						name="legalName"
						value={fields.legalName ?? ''}
						className={styles.input}
						onChange={(e) => changeValue(e, setFields)}
					/>
				</div>
				<div className={styles.labelInput}>
					<label>RUT:</label>
					<input
						name="RUT"
						value={fields.RUT ?? ''}
						className={styles.input}
						onChange={(e) => changeValue(e, setFields)}
					/>
				</div>
				<div className={styles.contactsTable}>
					Contactos:
					<table>
						<thead>
							<tr>
								<th>Nombre</th>
								<th>Telefono</th>
								<th>Email</th>
							</tr>
						</thead>
						<tbody>
							{fields.contact.map((contact, index) => (
								<tr key={index}>
									<td>
										<Input
											name={'name'}
											size="priceSize"
											value={contact.name}
											onChange={(e) =>
												handleContactChange(e, index)
											}
										/>
									</td>
									<td>
										<Input
											name={'phone'}
											value={contact.phone}
											size="priceSize"
											onChange={(e) =>
												handleContactChange(e, index)
											}
										/>
									</td>
									<td>
										<Input
											name={'email'}
											value={contact.email}
											size="mailSize"
											onChange={(e) =>
												handleContactChange(e, index)
											}
										/>
									</td>
									<td>
										<IconButton
											color="error"
											onClick={() => deleteContact(index)}
											sx={{
												height: '20px',
												width: '20px',
											}}
										>
											<CloseIcon />
										</IconButton>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<Button variant="contained" onClick={addContact}>
						Agregar Contacto
					</Button>
				</div>
				<div className={styles.labelInput}>
					<label>Direccion:</label>
					<input
						name="address"
						value={fields.address ?? ''}
						className={styles.input}
						onChange={(e) => changeValue(e, setFields)}
					/>
				</div>
				<div className={styles.labelInput}>
					<label>Telefono:</label>
					<input
						name="phone"
						value={fields.phone ?? ''}
						className={styles.input}
						onChange={(e) => changeValue(e, setFields)}
					/>
				</div>
				<div className={styles.labelInput}>
					<label>Informacion adicional:</label>
					<input
						name="extraInfo"
						value={fields.extraInfo ?? ''}
						className={styles.input}
						onChange={(e) => changeValue(e, setFields)}
					/>
				</div>

				{isEdit ? (
					<Button
						variant="contained"
						onClick={handleSubmit}
					>
						Guardar
					</Button>
				) : (
					<Button
						variant="contained"
						onClick={handleSubmit}
					>
						Crear
					</Button>
				)}
			</form>
		</div>
	);
}

export default ClientsForm;
