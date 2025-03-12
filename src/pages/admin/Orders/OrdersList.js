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
import { Link } from 'react-router-dom';
import { rolToken } from '../../../utilities/functions/login';
import { Button } from '@mui/material';

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

	return (
		<div className={styles.ordersList}>
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
				<Link to="/admin/orders/form">
					<Button variant="contained">Crear</Button>
				</Link>
			</div>
			<AllOrdersList
				ordersLoading={loadingOrders}
				orders={orders}
				status={status}
				changeStatus={changeStatus}
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
