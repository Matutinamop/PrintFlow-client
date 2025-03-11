import React, { useEffect, useState } from 'react';
import styles from './form.module.css';
import { Input } from '../../shared/Inputs';
import CreatableSelect from 'react-select/creatable';
import { useDispatch } from 'react-redux';
import {
	fetchClientById,
	fetchClients,
} from '../../../redux/clients/clientsSlice';
import { changeValue } from '../../../utilities/functions/forms/fields';
import Modal from '../../shared/Modal/index';
import {
	clientStyle,
	selectStyles,
} from '../../../utilities/selectStyles/selectStyles';
import { Description } from '@mui/icons-material';
import Dropdown from '../../shared/Dropdown';
import ClientsForm from '../../Clients/Form/index';

function OrderInfoModule({
	clients,
	fields,
	setFields,
	client,
	setContactInfo,
}) {
	const today = new Date().toISOString().split('T')[0];
	const dispatch = useDispatch();

	const [clientModalOpen, setClientModalOpen] =
		useState(false);
	const [clientModalFields, setClientModalFields] =
		useState({});
	const [quickClient, setQuickClient] = useState({});
	const [clientOptions, setClientOptions] = useState(
		clients?.map((client) => ({
			key: client._id,
			value: client._id,
			label: client.companyName,
			legalName: client.legalName,
			address: client.address,
			phone: client.phone,
		}))
	);

	const formatOptionLabel = ({
		label,
		legalName,
		address,
		phone,
	}) => (
		<div
			style={{ display: 'flex', flexDirection: 'column' }}
		>
			<span
				style={{ fontWeight: 'bold', fontSize: '1rem' }}
			>
				{label}
			</span>
			<span
				style={{
					fontSize: '0.8rem',
					fontWeight: 'lighter',
				}}
			>
				{legalName}
			</span>
			<span
				style={{
					fontSize: '0.8rem',
					fontWeight: 'lighter',
				}}
			>
				{address}
			</span>
			<span
				style={{
					fontSize: '0.8rem',
					fontWeight: 'lighter',
				}}
			>
				{phone}
			</span>
		</div>
	);

	const selectClient = (option, actionMeta) => {
		if (actionMeta.action === 'create-option') {
			setClientModalFields({
				companyName: option.label,
				contact: [],
			});
			return setClientModalOpen(true);
		}
		dispatch(fetchClientById(option.key));
		const clientSelected = clients.find(
			(client) => client._id === option.value
		);
		setFields((prev) => ({
			...prev,
			client: clientSelected || {
				_id: option.value,
				name: option.label,
			},
		}));
	};

	useEffect(() => {
		if (Object.keys(quickClient).length !== 0) {
			setClientOptions((prev) => [
				...prev,
				{
					key: quickClient._id,
					value: quickClient._id,
					label: quickClient.companyName,
					legalName: quickClient?.legalName,
					address: quickClient?.address,
					phone: quickClient?.phone,
				},
			]);
			setFields((prev) => ({
				...prev,
				client: quickClient,
			}));
			dispatch(fetchClientById(quickClient._id));
		}
	}, [quickClient]);

	useEffect(() => {
		console.log(clientOptions);
	}, [clientOptions]);

	return (
		<div className={styles.blockContainer}>
			<Modal
				isOpen={clientModalOpen}
				onClose={() => setClientModalOpen(false)}
			>
				<ClientsForm
					setOpenModal={setClientModalOpen}
					fields={clientModalFields}
					setFields={setClientModalFields}
					setQuickClient={setQuickClient}
				/>
			</Modal>
			<div className={styles.leftBlock}>
				{' '}
				<h3 className={styles.sectionTitle}>
					Familia:
				</h3>{' '}
				<input
					className={styles.familyInput}
					name={'product'}
					value={fields.product ?? ''}
					onChange={(e) => changeValue(e, setFields)}
				></input>
				<label className={styles.label}>
					Fecha estimada de entrega:
				</label>
				<input
					className={styles.dateInput}
					min={today}
					type="date"
					name="dateEstimate"
					value={fields.dateEstimate ?? ''}
					onChange={(e) => changeValue(e, setFields)}
				/>
				<label className={styles.label}>
					Fecha limite de entrega:
				</label>
				<input
					className={styles.dateInput}
					min={today}
					type="date"
					name="dateFinal"
					value={fields.dateFinal ?? ''}
					onChange={(e) => changeValue(e, setFields)}
				/>
			</div>
			<div className={styles.rightBlock}>
				<h3 className={styles.sectionTitle}>Cliente:</h3>
				<CreatableSelect
					styles={clientStyle}
					name="client"
					value={
						clientOptions && Array.isArray(clientOptions)
							? clientOptions.find(
									(client) =>
										client.value === fields?.client._id
							  ) ?? {
									label: fields?.client.name,
									value: fields?.client.name,
							  }
							: {
									label: fields?.client.name,
									value: fields?.client.name,
							  }
					}
					onChange={(option, actionMeta) => {
						selectClient(option, actionMeta);
					}}
					options={clientOptions}
					formatOptionLabel={formatOptionLabel}
					placeholder={''}
				/>
				<div className={styles.blockTitle}>
					<h3>Información de contacto: </h3>
					<Dropdown
						handleIndex={setContactInfo}
						options={client?.contact?.map(
							(contact) => contact.name
						)}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						gap: '5px',
					}}
				>
					<Input
						name={'contactName'}
						size="priceSize"
						value={
							fields.contactName ? fields.contactName : ''
						}
						onChange={(e) => changeValue(e, setFields)}
					>
						Nombre:{' '}
					</Input>
					<Input
						name={'contactPhone'}
						value={
							fields.contactPhone ? fields.contactPhone : ''
						}
						size="priceSize"
						onChange={(e) => changeValue(e, setFields)}
					>
						Teléfono:
					</Input>
					<Input
						name={'contactEmail'}
						value={
							fields.contactEmail ? fields.contactEmail : ''
						}
						size="mailSize"
						onChange={(e) => changeValue(e, setFields)}
					>
						Email:{' '}
					</Input>
				</div>
			</div>
			<div className={styles.deliveryContainer}>
				<h3>Datos de entrega:</h3>
				<textarea
					name="deliveryData"
					value={fields.deliveryData ?? ''}
					onChange={(e) => changeValue(e, setFields)}
					className={styles.textArea}
				/>
			</div>
		</div>
	);
}

export default OrderInfoModule;
