import React, { useEffect, useState } from 'react';
import styles from './order.module.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import OrderInfoModule from '../../../components/Orders/Form/OrderInfoModule';
import RequestInfoModule from '../../../components/Orders/Form/RequestInfoModule';
import PrintTaskModule from '../../../components/Orders/Form/PrintTaskModule';
import {
	cleanClient,
	fetchClients,
} from '../../../redux/clients/clientsSlice';
import { Button, Switch } from '@mui/material';
import { fetchMaterials } from '../../../redux/materials/materialsSlice';
import { fetchStations } from '../../../redux/workStations/workStationSlice';
import OperationsModule from '../../../components/Orders/Form/OperationsModule';
import { createNewOrder } from '../../../utilities/functions/order/createNewOrder';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateOrder } from '../../../utilities/functions/order/updateOrder';
import { orderSchema } from '../../../utilities/validations/orderForm';

function OrderForm() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { allOrdersCount } = useSelector(
		(state) => state.orders
	);
	const { client, clients } = useSelector(
		(state) => state.clients
	);

	const today = format(new Date(), 'dd/MM/yyyy');

	const [checked, setChecked] = useState(
		location?.state?.fields.status === 'Aceptada'
			? true
			: false
	);
	const [formErrors, setFormErrors] = useState([]);
	const [fields, setFields] = useState(
		location.state
			? location.state.fields
			: {
					orderNumber: allOrdersCount + 1,
					printTasks: [{ id: 0, moduleRepeat: 1 }],
					client: '',
					otherTasks: [{}],
					status: checked ? 'Aceptada' : 'Abierta',
					deviation: 0,
			  }
	);

	/* 	useEffect(() => {
		console.log(location.state);
		console.log(fields);
	}, [JSON.stringify(fields)]); */

	useEffect(() => {
		dispatch(fetchClients());
		dispatch(fetchMaterials());
		dispatch(fetchStations());
		dispatch(cleanClient());
	}, []);

	const setContactInfo = (index) => {
		const { name, email, phone } =
			fields.client?.contact[index];

		setFields((prev) => ({
			...prev,
			contactName: name,
			contactEmail: email,
			contactPhone: phone,
		}));
	};

	useEffect(() => {
		if (fields.client?.contact?.length > 0) {
			setContactInfo(0);
		}
	}, [fields.client]);

	const handleSubmit = async (id) => {
		const result = orderSchema.validate(fields, {
			abortEarly: false,
		});
		if (result.error) {
			return setFormErrors(
				result.error.details.map((err) => err)
			);
		}
		try {
			if (location.state) {
				const res = await updateOrder(id, fields);
				navigate('/admin/orders/all');
				return;
			}
			const res = await createNewOrder(fields);
			navigate('/admin/orders/all');
		} catch (error) {
			console.log(error);
		}
	};

	const newPrintTask = () => {
		const newTask = { id: fields.printTasks.length };
		setFields((prev) => ({
			...prev,
			printTasks: [...prev.printTasks, newTask],
		}));
	};

	const deletePrintModule = (i) => {
		const newModules = fields.printTasks.filter(
			(mod, index) => index !== i
		);
		setFields((prev) => ({
			...prev,
			printTasks: newModules,
		}));
	};

	useEffect(() => {
		setFields((prev) => ({
			...prev,
			status: checked ? 'Aceptada' : 'Abierta',
		}));
	}, [checked]);

	const handleCheck = () => {
		setChecked(!checked);
	};

	useEffect(() => {
		if (fields.printTasks) {
			let price = 0;
			fields.printTasks.map((task) => {
				if (task.totalCost) {
					price += Number(task.totalCost);
				}
			});
			fields.otherTasks.map((task) => {
				if (task.cost) {
					return (price += Number(task.cost));
				}
				if (task.estimatedCost) {
					return (price += Number(task.estimatedCost));
				}
			});

			price = Math.round(price * 100) / 100;
			price = price.toFixed(2);

			setFields((prev) => ({ ...prev, finalPrice: price }));
		}
	}, [JSON.stringify(fields)]);

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
								{location.state ? (
									<>
										MOP Nº. <span>{allOrdersCount} </span>
									</>
								) : (
									<>
										MOP Nº.{' '}
										<span>{allOrdersCount + 1} </span>
									</>
								)}
							</p>
						</div>
					</div>
					<OrderInfoModule
						formErrors={formErrors}
						fields={fields}
						clients={clients}
						setContactInfo={setContactInfo}
						client={client}
						setFields={setFields}
					/>
					<RequestInfoModule
						formErrors={formErrors}
						fields={fields}
						setFields={setFields}
					/>
					{fields?.printTasks?.map((task, index) => (
						<PrintTaskModule
							formErrors={formErrors}
							info={task}
							key={index}
							fields={fields}
							module={task.id}
							setFields={setFields}
							index={index}
							deleteModule={deletePrintModule}
						/>
					))}
					<Button
						variant="contained"
						onClick={newPrintTask}
						sx={{ mt: '10px' }}
					>
						Nuevo modulo de impresión
					</Button>
					<OperationsModule
						formErrors={formErrors}
						setFields={setFields}
						fields={fields}
					/>
					<div
						style={{
							display: 'flex',
							marginTop: '30px',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<div>
							{formErrors.map((err, index) => (
								<p
									key={index}
									style={{
										color: 'red',
										fontSize: '11px',
										backgroundColor: 'rgba(0,0,0,0.2)',
										borderRadius: '4px',
										margin: '2px 0',
									}}
								>
									{err.message}
								</p>
							))}
						</div>

						<div style={{ width: '200px' }}>
							<div>
								<label>% Desviación:</label>
								<input
									name="deviation"
									value={fields.deviation || ''}
									style={{
										width: '50px',
										fontWeight: 'bold',
									}}
									type="number"
									onChange={(e) =>
										setFields((prev) => ({
											...prev,
											[e.target.name]: e.target.value,
										}))
									}
								/>
							</div>
							<p>
								Precio Final: ${' '}
								{Math.round(
									fields.finalPrice *
										(100 + parseFloat(fields.deviation))
								) / 100}
							</p>
						</div>
					</div>
				</div>
			</div>
			<Button
				variant="contained"
				color="success"
				onClick={() =>
					handleSubmit(location?.state?._id ?? null)
				}
			>
				{location.state ? (
					<>Guardar Cambios</>
				) : (
					<>Crear MOP</>
				)}
			</Button>
		</div>
	);
}

export default OrderForm;
