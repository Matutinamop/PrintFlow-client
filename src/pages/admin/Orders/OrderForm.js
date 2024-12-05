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
import OtherTaskModule from '../../../components/Orders/Form/OtherTaskModule';

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
		otherTaskCount: '0',
		printTaskCount: '1',
		client: '',
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
			['contactName']: name,
			['contactEmail']: email,
			['contactPhone']: phone,
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

	useEffect(() => {
		console.log(fields);
	}, [fields]);

	const createMOP = () => {
		console.log(fields);
	};

	const selectStyles = {
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
	};

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
						selectStyles={selectStyles}
						setFields={setFields}
					/>
					<ClientInfoModule
						setContactInfo={setContactInfo}
						client={client}
						selectStyles={selectStyles}
						fields={fields}
						setFields={setFields}
					/>
					<RequestInfoModule
						selectStyles={selectStyles}
						fields={fields}
						setFields={setFields}
					/>
					{Array.from(
						{ length: fields.printTaskCount },
						(_, index) => (
							<PrintTaskModule
								key={index}
								selectStyles={selectStyles}
								fields={fields[`printTask${index + 1}`]}
								setFields={setFields}
								index={index}
							/>
						)
					)}
					{Array.from(
						{ length: fields.otherTaskCount },
						(_, index) => (
							<OtherTaskModule
								key={index}
								selectStyles={selectStyles}
								fields={fields}
							/>
						)
					)}
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
