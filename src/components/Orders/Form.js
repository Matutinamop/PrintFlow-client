import React, { useEffect, useState } from 'react';
import {
	Input,
	SearchableInput,
	SearchableSelect,
	TextArea,
} from '../shared/Inputs';
import styles from './orders.module.css';
import { useSelector } from 'react-redux';
import Dropdown from '../shared/Dropdown';
import { useDispatch } from 'react-redux';
import {
	fetchClientById,
	fetchClients,
} from '../../redux/clients/clientsSlice';

function Form() {
	const dispatch = useDispatch();

	const { ordersCount } = useSelector(
		(state) => state.orders
	);
	const { clients, client } = useSelector(
		(state) => state.clients
	);
	const [fields, setFields] = useState({ taskCount: '1' });

	const changeValue = (e) => {
		setFields((prevFields) => ({
			...prevFields,
			[e.target.name]: e.target.value,
		}));
	};

	const changeTaskCount = (e) => {
		const newValue = e.target.value;
		if (newValue >= 0 && newValue <= 10) {
			setFields((prevFields) => ({
				...prevFields,
				[e.target.name]: newValue,
			}));
		}
	};

	const matchClient = (name) => {
		const clientsMatched = clients.filter(
			(client) => name === client.companyName
		);

		if (clientsMatched.length === 1) {
			const clientId = clientsMatched[0]._id;
			dispatch(fetchClientById(clientId));
		}
		return;
	};

	const setContactInfo = (index) => {
		const { name, email, phone } = client?.contact[index];

		setFields((prev) => ({
			...prev,
			['contactName']: name,
			['contactEmail']: email,
			['contactPhone']: phone,
		}));
		console.log(fields);
	};

	useEffect(() => {
		dispatch(fetchClients());
	}, []);

	useEffect(() => {
		if (client?.contact?.length > 0) {
			const { name, email, phone } = client?.contact[0];

			setFields((prev) => ({
				...prev,
				['contactName']: name,
				['contactEmail']: email,
				['contactPhone']: phone,
			}));
		}
	}, [client]);

	useEffect(() => {
		console.log(fields);
	}, [fields]);

	return (
		<div className={styles.orderForm}>
			<h2>Nueva Orden N {ordersCount + 1}</h2>
			<form className={styles.form}>
				<div
					className={`${styles.block} ${styles.orderInfo}`}
				>
					<h3 className={styles.blockTitle}>
						Información de la MOP
					</h3>
					<Input
						name={'name'}
						orientation="vertical"
						size="big"
						onChange={(e) => changeValue(e)}
					>
						Nombre:{' '}
					</Input>
					<Input
						name={'product'}
						orientation="vertical"
						size="big"
						onChange={(e) => changeValue(e)}
					>
						Producto:{' '}
					</Input>
					<SearchableInput
						name={'client'}
						orientation={'vertical'}
						size={'big'}
						onChange={changeValue}
						ifMatch={matchClient}
						options={clients.map(
							(client) => client.companyName
						)}
					>
						Cliente:
					</SearchableInput>
					<Input
						name={'taskCount'}
						orientation="vertical"
						size="big"
						type={'number'}
						min={'1'}
						value={fields.taskCount}
						onChange={(e) => {
							changeTaskCount(e);
						}}
					>
						Número de tareas:{' '}
					</Input>
				</div>
				<div
					className={`${styles.block} ${styles.clientInfo}`}
				>
					<h3 className={styles.blockTitle}>
						Información del cliente:
					</h3>{' '}
					<Dropdown
						handleIndex={setContactInfo}
						options={client?.contact?.map(
							(contact) => contact.name
						)}
					/>
					<Input
						name={'contactName'}
						orientation="vertical"
						size="big"
						value={
							fields.contactName ? fields.contactName : ''
						}
						onChange={(e) => changeValue(e)}
					>
						Contacto:{' '}
					</Input>
					<Input
						name={'contactPhone'}
						orientation="vertical"
						value={
							fields.contactPhone ? fields.contactPhone : ''
						}
						size="big"
						onChange={(e) => changeValue(e)}
					>
						Teléfono:
					</Input>
					<Input
						name={'contactEmail'}
						orientation="vertical"
						value={
							fields.contactEmail ? fields.contactEmail : ''
						}
						size="big"
						onChange={(e) => changeValue(e)}
					>
						Email:{' '}
					</Input>
					<Input
						name={'clientDelivery'}
						orientation="vertical"
						size="big"
						onChange={(e) => changeValue(e)}
					>
						Datos de entrega:
					</Input>
				</div>
				<div className={styles.block}>
					<TextArea
						name={'request'}
						orientation="vertical"
						width="300px"
						onChange={(e) => changeValue(e)}
					>
						Solicitud:{' '}
					</TextArea>
					<Input
						name={'Scheme'}
						orientation="vertical"
						placeholder={'Adjuntar archivo'}
						onChange={(e) => changeValue(e)}
					>
						Esquema:{' '}
					</Input>
				</div>
				{Array.from(
					{ length: fields.taskCount },
					(_, index) => (
						<div key={index}>
							<h4>Tarea {index + 1}</h4>
							<Input>Nombre: </Input>
						</div>
					)
				)}
			</form>
		</div>
	);
}

export default Form;
