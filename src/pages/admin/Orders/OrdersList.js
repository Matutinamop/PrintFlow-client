import React, { useEffect, useState } from 'react';
import styles from './order.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchFilteredOrders,
	fetchOrderByOrderNumber,
	fetchOrdersPage,
} from '../../../redux/orders/ordersSlice';
import { Input } from '../../../components/shared/Inputs';
import { AllOrdersList } from '../../../components/Orders/AllOrdersList';
import Pagination from '../../../components/shared/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import { rolToken } from '../../../utilities/functions/login';
import { Button, setRef } from '@mui/material';
import Modal from '../../../components/shared/Modal';
import {
	cleanClient,
	fetchClients,
} from '../../../redux/clients/clientsSlice';
import { fetchMaterials } from '../../../redux/materials/materialsSlice';
import { fetchOperations } from '../../../redux/operations/operationsSlice';
import { fetchStations } from '../../../redux/workStations/workStationSlice';
import { fetchExchanges } from '../../../redux/exchanges/exchangesSlice';

function OrdersList() {
	const {
		loadingOrders,
		orders,
		ordersCount,
		allOrdersCount,
	} = useSelector((state) => state.orders);
	const dispatch = useDispatch();

	const [orderNumber, setOrderNumber] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [status, setStatus] = useState('');
	const [prevFieldsModal, setPrevFieldsModal] =
		useState(false);
	const [prevFields, setPrevFields] = useState({});
	const [refresh, setRefresh] = useState(false);

	const toggleRefresh = () => {
		setRefresh(!refresh);
	};

	const navigate = useNavigate();

	const recoverData = () => {
		const fields = prevFields;
		navigate('/admin/orders/form', { state: { fields } });
	};

	useEffect(() => {
		const pages = Math.ceil(ordersCount / 50);
		setTotalPages(pages);
		setCurrentPage(1);
	}, [ordersCount]);

	useEffect(() => {
		rolToken();
		dispatch(fetchOrdersPage());
	}, []);

	useEffect(() => {
		dispatch(fetchClients());
		dispatch(fetchMaterials());
		dispatch(fetchOperations());
		dispatch(fetchStations());
		dispatch(cleanClient());
		dispatch(fetchMaterials());
		dispatch(fetchExchanges());
	}, []);

	useEffect(() => {
		dispatch(
			fetchFilteredOrders({
				searchTerm,
				status,
				page: currentPage,
			})
		);
	}, [currentPage, status, refresh]);

	const searchTermSubmit = (e) => {
		e.preventDefault();
		dispatch(
			fetchFilteredOrders({
				searchTerm,
				status,
				page: currentPage,
			})
		);
	};

	const handleChangeSearchInput = (e) => {
		setSearchTerm(e.target.value);
		dispatch(
			fetchFilteredOrders({
				searchTerm: e.target.value,
				status,
				page: currentPage,
			})
		);
	};

	const orderNumberSubmit = (e) => {
		e.preventDefault();
		if (orderNumber > 0 && orderNumber <= allOrdersCount) {
			dispatch(fetchOrderByOrderNumber(orderNumber));
		}
	};

	const setPage = (e, page) => {
		setCurrentPage(page);
	};

	const changeStatus = (stat) => {
		setStatus(stat);
	};

	const openModal = () => {
		const savedFields = localStorage.getItem('fields');
		if (savedFields) {
			const recoveredFields = JSON.parse(savedFields);
			setPrevFields(recoveredFields);
			return setPrevFieldsModal(true);
		} else {
			return navigate('/admin/orders/form');
		}
	};

	return (
		<div className={styles.ordersList}>
			<Modal
				isOpen={prevFieldsModal}
				onClose={() => setPrevFieldsModal(false)}
			>
				<div className={styles.prevModal}>
					<h3>
						Quieres recuperar los datos de la ultima MOP?
					</h3>
					<div className={styles.prevButtons}>
						<Link to={'/admin/orders/form'}>
							<Button
								variant="contained"
								onClick={() => setPrevFieldsModal(false)}
							>
								Empezar nueva
							</Button>
						</Link>
						<Button
							variant="contained"
							color="success"
							onClick={() => {
								setPrevFieldsModal(false);
								recoverData();
							}}
						>
							Recuperar
						</Button>
					</div>
				</div>
			</Modal>
			<h2 className={styles.allOrdersTitle}>
				LISTA DE MOPS
			</h2>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '95%',
				}}
			>
				<div className={styles.ordersListSearch}>
					<label className={styles.label}>Buscar: </label>
					<form onSubmit={(e) => orderNumberSubmit(e)}>
						<Input
							value={orderNumber}
							type={'number'}
							onChange={(e) =>
								setOrderNumber(e.target.value)
							}
							placeholder={'Nº orden'}
							size={'mediumSize'}
						></Input>
					</form>
					<form onSubmit={(e) => searchTermSubmit(e)}>
						<Input
							value={searchTerm}
							onChange={(e) => handleChangeSearchInput(e)}
							placeholder={'Buscar por cliente o producto'}
							size={'mailSize'}
						></Input>
					</form>
				</div>
				<Button variant="contained" onClick={openModal}>
					Crear
				</Button>
			</div>
			<AllOrdersList
				ordersLoading={loadingOrders}
				orders={orders}
				status={status}
				changeStatus={changeStatus}
				toggleRefresh={toggleRefresh}
			/>
			<div className={styles.paginationContainer}>
				<Pagination
					count={totalPages}
					page={currentPage}
					onChange={setPage}
					variant="contained"
					shape="rounded"
					sx={{
						'& .MuiPaginationItem-root': {
							color: 'white',
							backgroundColor: '#1976D2',
							'&:hover': {
								backgroundColor: 'lightblue',
							},
						},
						'& .MuiPaginationItem-root.Mui-selected': {
							backgroundColor: '#0D47A1',
						},
					}}
				/>
			</div>
		</div>
	);
}

export default OrdersList;
