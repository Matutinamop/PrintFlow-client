import React, { useEffect, useState } from 'react';
import styles from '../../pages.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchFilteredOrders,
	fetchOrderByOrderNumber,
	fetchOrdersPage,
} from '../../../redux/orders/ordersSlice';
import { Input } from '../../../components/shared/Inputs';
import { AllOrdersList } from '../../../components/Orders/AllOrdersList';
import Pagination from '../../../components/shared/Pagination';
import { Link } from 'react-router-dom'; // Cambiar aquí
import Button from '../../../components/shared/Button';
import { rolToken } from '../../../utilities/functions/login';

function OrdersList() {
	const { loadingOrders, orders, ordersCount } =
		useSelector((state) => state.orders);
	const dispatch = useDispatch();

	const [orderNumber, setOrderNumber] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [status, setStatus] = useState('');

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
		console.log(status);
		dispatch(
			fetchFilteredOrders({
				searchTerm,
				status,
				page: currentPage,
			})
		);
	}, [currentPage, status]);

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

	const orderNumberSubmit = (e) => {
		e.preventDefault();
		if (orderNumber > 0 && orderNumber <= ordersCount) {
			dispatch(fetchOrderByOrderNumber(orderNumber));
		}
	};

	const setPage = (page) => {
		setCurrentPage(page);
	};

	const changeStatus = (stat) => {
		setStatus(stat);
	};

	return (
		<div className={styles.ordersList}>
			<h2 className={styles.allOrdersTitle}>
				LISTA DE MOPS
			</h2>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					width: '95%',
				}}
			>
				<Link to="/admin/orders/form">
					<Button>Crear</Button>
				</Link>
				<div className={styles.ordersListSearch}>
					<label className={styles.label}>Buscar: </label>
					<form onSubmit={(e) => orderNumberSubmit(e)}>
						<Input
							value={orderNumber}
							type={'number'}
							onChange={(e) =>
								setOrderNumber(e.target.value)
							}
							placeholder={'Buscar por Nº orden'}
						></Input>
					</form>
					<form onSubmit={(e) => searchTermSubmit(e)}>
						<Input
							value={searchTerm}
							onChange={(e) =>
								setSearchTerm(e.target.value)
							}
							placeholder={'Buscar por cliente o producto'}
						></Input>
					</form>
				</div>
			</div>
			<AllOrdersList
				ordersLoading={loadingOrders}
				orders={orders}
				status={status}
				changeStatus={changeStatus}
			/>
			<Pagination
				count={ordersCount}
				itemsPerPage={50}
				currentPage={currentPage}
				totalPages={totalPages}
				setPage={setPage}
			/>
		</div>
	);
}

export default OrdersList;
