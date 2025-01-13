import React, { useEffect, useState } from 'react';
import styles from './order.module.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import OrderInfoModule from '../../../components/Orders/Form/OrderInfoModule';
import ClientInfoModule from '../../../components/Orders/Form/ClientInfoModule';
import RequestInfoModule from '../../../components/Orders/Form/RequestInfoModule';
import PrintTaskModule from '../../../components/Orders/Form/PrintTaskModule';
import { fetchClients } from '../../../redux/clients/clientsSlice';
import { Button } from '@mui/material';
import { fetchMaterials } from '../../../redux/materials/materialsSlice';
import { fetchStations } from '../../../redux/workStations/workStationSlice';
import OperationsModule from '../../../components/Orders/Form/OperationsModule';
import zIndex from '@mui/material/styles/zIndex';
import { createNewOrder } from '../../../utilities/functions/order/createNewOrder';

function OrderForm() {
	const dispatch = useDispatch();
	const { allOrdersCount } = useSelector(
		(state) => state.orders
	);
	const { client, clients } = useSelector(
		(state) => state.clients
	);

	const today = format(new Date(), 'dd/MM/yyyy');

	const [fields, setFields] = useState({
		orderNumber: allOrdersCount + 1,
		printTasks: [{ id: 0 }],
		client: '',
		otherTasks: [{}],
	});

	useEffect(() => {
		dispatch(fetchClients());
		dispatch(fetchMaterials());
		dispatch(fetchStations());
	}, []);

	const setContactInfo = (index) => {
		const { name, email, phone } = client?.contact[index];

		setFields((prev) => ({
			...prev,
			contactName: name,
			contactEmail: email,
			contactPhone: phone,
		}));
	};

	useEffect(() => {
		if (client?.contact?.length > 0) {
			/*{
			const { name, email, phone } = client?.contact[0];

			setFields((prev) => ({
				...prev,
				['contactName']: name,
				['contactEmail']: email,
				['contactPhone']: phone,
			}));
		} */ setContactInfo(0);
		}
	}, [client]);

	/* 	useEffect(() => {
		console.log(fields);
	}, [JSON.stringify(fields)]); */

	const createMOP = async () => {
		try {
			const res = await createNewOrder(fields);
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};

	/* const selectStyles = {
		menu: (provided, state) => ({
			...provided,
			height: '150px',
		}),

		menuList: (provided, state) => ({
			...provided,
			height: '150px',
		}),

		control: (provided, state) => ({
			...provided,

			minHeight: '25px',
			height: '25px',
			minWidth: '100%',
			width: '100%',
			fontSize: '11px',
			border: '1px solid #ccc',
			borderRadius: '4px',
			boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
		}),

		valueContainer: (provided, state) => ({
			...provided,
			height: '25px',
			padding: '0 6px',
		}),

		container: (provided, state) => ({
			...provided,
			height: '18px',
		}),

		input: (provided, state) => ({
			...provided,
			margin: '0px',
		}),
		indicatorSeparator: (state) => ({
			display: 'none',
		}),
		indicatorsContainer: (provided, state) => ({
			...provided,
			height: '25px',
		}),
		option: (provided, state) => ({
			...provided,
			fontSize: '12px',
		}),
	}; */

	const newPrintTask = () => {
		const newTask = { id: fields.printTasks.length };
		/* console.log(Array.isArray(fields.printTasks)); */
		setFields((prev) => ({
			...prev,
			printTasks: [...prev.printTasks, newTask],
		}));
	};

	const deletePrintModule = (i) => {
		/* console.log(i); */
		const newModules = fields.printTasks.filter(
			(mod, index) => index !== i
		);
		setFields((prev) => ({
			...prev,
			printTasks: newModules,
		}));
	};

	/* 	const changePrintTaskCount = (e) => {
		const newValue = e.target.value;
		if (newValue >= 0 && newValue <= 10) {
			setFields((prevFields) => ({
				...prevFields,
				tasks: [...tasks, { [`printTask${newValue}`]: {} }],
			}));
		}
	}; */

	useEffect(() => {
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
								MOP Nº. <span>{allOrdersCount + 1} </span>
							</p>
						</div>
					</div>
					<OrderInfoModule
						fields={fields}
						clients={clients}
						setFields={setFields}
					/>
					<ClientInfoModule
						setContactInfo={setContactInfo}
						client={client}
						fields={fields}
						setFields={setFields}
					/>
					<RequestInfoModule
						fields={fields}
						setFields={setFields}
					/>
					{fields?.printTasks?.map((task, index) => (
						<PrintTaskModule
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
						setFields={setFields}
						fields={fields}
					/>
					<p>Precio Final: $ {fields.finalPrice}</p>
				</div>
			</div>
			<Button
				variant="contained"
				color="success"
				onClick={() => createMOP()}
			>
				Crear MOP
			</Button>
		</div>
	);
}

export default OrderForm;
