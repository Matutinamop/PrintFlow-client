import React, { useEffect, useRef, useState } from 'react';
import styles from './orders.module.css';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { Input, SearchableInput } from '../shared/Inputs';
import { useDispatch } from 'react-redux';
import {
	fetchClientById,
	fetchClients,
} from '../../redux/clients/clientsSlice';
import Dropdown from '../shared/Dropdown';
import { current } from '@reduxjs/toolkit';

function FormTwo() {
	const dispatch = useDispatch();
	const { allOrdersCount } = useSelector(
		(state) => state.orders
	);
	const { client, clients } = useSelector(
		(state) => state.clients
	);

	const today = format(new Date(), 'dd/MM/yyyy');

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

	return (
		<div className={styles.formPage}>
			<div className={styles.a4Sheet}>
				<div className={styles.documentContent}>
					<div className={styles.mopHeader}>
						<div className={styles.headerBlock}>
							<h4>Imprenta</h4>
							<h2>MATUTINA</h2>
						</div>
						<h3 className={styles.headerBlock}>
							MOP de la empresa
						</h3>
						<div
							className={`${styles.headerBlock} ${styles.infoHeader}`}
						>
							<p
								style={{
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								Fecha de Creación: <span>{today}</span>
							</p>
							<p
								style={{
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								MOP Nº. <span>{allOrdersCount + 1} </span>
							</p>
						</div>
					</div>
					<div className={styles.block}>
						<Input
							name={'name'}
							orientation="vertical"
							size="normal"
							onChange={(e) => changeValue(e)}
						>
							Nombre:{' '}
						</Input>
						<Input
							name={'product'}
							orientation="vertical"
							size="normal"
							onChange={(e) => changeValue(e)}
						>
							Producto:{' '}
						</Input>
						<SearchableInput
							name={'client'}
							orientation={'vertical'}
							size="normal"
							onChange={changeValue}
							ifMatch={matchClient}
							options={clients.map(
								(client) => client.companyName
							)}
							autoComplete="off"
						>
							Cliente:
						</SearchableInput>
						{/* <Input
                            name={'taskCount'}
                            orientation="vertical"
                            size="normal"
                            type={'number'}
                            min={'1'}
                            value={fields.taskCount}
                            onChange={(e) => {
                                changeTaskCount(e);
                            }}
                        >
                            Número de tareas:{' '}
                        </Input> */}
					</div>
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
							name={'contactName'}
							orientation="vertical"
							size="normal"
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
								fields.contactPhone
									? fields.contactPhone
									: ''
							}
							size="normal"
							onChange={(e) => changeValue(e)}
						>
							Teléfono:
						</Input>
						<Input
							name={'contactEmail'}
							orientation="vertical"
							value={
								fields.contactEmail
									? fields.contactEmail
									: ''
							}
							size="normal"
							onChange={(e) => changeValue(e)}
						>
							Email:{' '}
						</Input>
						{/* <Input
                            name={'clientDelivery'}
                            orientation="vertical"
                            size="normal"
                            onChange={(e) => changeValue(e)}
                        >
                            Datos de entrega:
                        </Input> */}
						<div className={styles.inputContainer}>
							<label>Datos de entrega:</label>
							<textarea className={styles.textArea} />
						</div>
					</div>
					<div className={styles.block}>
						<div className={styles.blockTitle}>
							<h3>Información del pedido: </h3>
						</div>
						<div className={styles.inputContainer}>
							<label>Solicitud:</label>
							<textarea className={styles.textArea} />
						</div>
						<div className={styles.inputContainer}>
							<label>Comentarios para el Taller:</label>
							<textarea className={styles.textArea} />
						</div>
						<div className={styles.inputContainer}>
							<label>Comentarios para el Cliente:</label>
							<textarea className={styles.textArea} />
						</div>
						<div className={styles.inputContainer}>
							<label>Comentarios Internos:</label>
							<textarea className={styles.textArea} />
						</div>
						<div className={styles.inputNumberContainer}>
							<label>Número de tareas:</label>
							<input
								className={styles.inputNumber}
								name="taskCount"
								type="number"
								min={1}
								value={fields.taskCount}
								onChange={(e) => {
									changeTaskCount(e);
								}}
							/>
						</div>
					</div>
					{Array.from(
						{ length: fields.taskCount },
						(_, index) => (
							<div key={index} className={styles.block}>
								<Input orientation="vertical" size="small">
									Nombre:{' '}
								</Input>
								<Input orientation="vertical" size="normal">
									Material:{' '}
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Gramaje:{' '}
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Tam. hoja:{' '}
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Tam. Pli.:{' '}
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Pli. x Hoja:
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Unid. x Pli.:
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Cant. Pli.:
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Demasía:
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Costo x hoja:
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
									isDisabled
								>
									Hojas:
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
									isDisabled
								>
									Costo Papel:
								</Input>
								<div
									style={{
										display: 'flex',
										justifyContent: 'flex-end',
										gap: '15px',
									}}
								>
									<p
										style={{
											alignSelf: 'end',
											width: '190px',
										}}
									>
										Tintas
									</p>
									<Input
										orientation="vertical"
										size="adjusted"
									>
										Chapas:
									</Input>
									<Input
										orientation="vertical"
										size="adjusted"
									>
										Cant.:
									</Input>
									<Input
										orientation="vertical"
										size="adjusted"
									>
										Costo Unit.:
									</Input>
									<Input
										orientation="vertical"
										size="adjusted"
										isDisabled
									>
										Costo Chapa:
									</Input>
								</div>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Frente:
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Dorso:
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Posturas:
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Imp. y Ret.:
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Tiraje:
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
								>
									Costo Postura:
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
									isDisabled
								>
									Costo Tinta:
								</Input>
								<Input orientation="vertical" size="normal">
									Descripción del pliego:
								</Input>
								<Input orientation="vertical" size="normal">
									Repetir costo del pliego:
								</Input>
								<Input
									orientation="vertical"
									size="adjusted"
									isDisabled
								>
									Costo Total:
								</Input>
							</div>
						)
					)}
				</div>
			</div>
		</div>
	);
}

export default FormTwo;
