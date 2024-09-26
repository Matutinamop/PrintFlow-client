import React, { useEffect, useState } from 'react';
import styles from '../../pages.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchFilteredOrders,
	fetchOrderByOrderNumber,
} from '../../../redux/orders/ordersSlice';
import { Input } from '../../../components/shared/Inputs';
import AllOrdersList from '../../../components/orders/AllOrdersList';
import Pagination from '../../../components/shared/Pagination';

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
				Lista de órdenes
			</h2>
			<div className={styles.ordersListSearch}>
				<form onSubmit={(e) => orderNumberSubmit(e)}>
					<Input
						value={orderNumber}
						type={'number'}
						onChange={(e) => setOrderNumber(e.target.value)}
						placeholder={'Buscar por Nº orden'}
					>
						Buscar:{' '}
					</Input>
				</form>

				<form onSubmit={(e) => searchTermSubmit(e)}>
					<Input
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder={'Buscar por cliente o producto'}
					></Input>
				</form>
			</div>
			<AllOrdersList
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
