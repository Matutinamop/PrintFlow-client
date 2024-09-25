import React, { useEffect, useState } from 'react';
import styles from '../../pages.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchFilteredOrders,
	fetchOrdersPage,
} from '../../../redux/orders/ordersSlice';
import {
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '../../../components/shared/Tables';
import { Input } from '../../../components/shared/Inputs';
import { isWarning } from '../../../utilities/functions/dates';
import AllOrdersList from '../../../components/orders/AllOrdersList';
import Pagination from '../../../components/shared/Pagination';

function OrdersList() {
	const { loadingOrders, orders, ordersCount } =
		useSelector((state) => state.orders);
	const [searchTerm, setSearchTerm] = useState('');

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchOrdersPage());
	}, []);

	const searchTermSubmit = (e) => {
		e.preventDefault();
		dispatch(fetchFilteredOrders({ searchTerm }));
	};

	return (
		<div className={styles.ordersList}>
			<h2 className={styles.allOrdersTitle}>
				Lista de órdenes
			</h2>
			<div className={styles.ordersListSearch}>
				<form onSubmit={(e) => searchTermSubmit(e)}>
					<Input
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder={'Buscar por cliente o producto'}
					>
						Buscar:{' '}
					</Input>
				</form>
			</div>
			<AllOrdersList orders={orders} />
			<Pagination
				count={ordersCount}
				itemsPerPage={50}
				fetchPage={fetchFilteredOrders}
				searchTerm={searchTerm}
			/>
		</div>
	);
}

export default OrdersList;
