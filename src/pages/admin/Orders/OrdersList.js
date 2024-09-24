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

function OrdersList() {
	const [searchTerm, setSearchTerm] = useState('');

	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const { loadingOrders, orders, ordersCount } =
		useSelector((state) => state.orders);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchOrdersPage());
	}, []);

	useEffect(() => {
		console.log(ordersCount, currentPage);
		dispatch(
			fetchOrdersPage(ordersCount - (currentPage - 1) * 50)
		);
	}, [currentPage]);

	useEffect(() => {
		const pages = Math.ceil(ordersCount / 50);
		setTotalPages(pages);
	}, [ordersCount]);

	const searchTermSubmit = (e) => {
		e.preventDefault();
		dispatch(fetchFilteredOrders({ searchTerm }));
	};

	const getPaginationRange = () => {
		const range = [];
		let start = Math.max(1, currentPage - 2);
		let end = Math.min(totalPages, currentPage + 2);

		for (let i = start; i <= end; i++) {
			range.push(i);
		}
		return range;
	};

	return (
		<div className={styles.ordersList}>
			<div className={styles.ordersListTable}>
				<h2 className={styles.ordersListTitle}>
					Lista de órdenes
				</h2>
				<div className={styles.ordersListSearch}>
					<form onSubmit={(e) => searchTermSubmit(e)}>
						<Input
							value={searchTerm}
							onChange={(e) =>
								setSearchTerm(e.target.value)
							}
							placeholder={'Buscar por cliente o producto'}
						>
							Buscar:{' '}
						</Input>
					</form>
				</div>
				<Table>
					<Thead>
						<Tr>
							<Th size={'small'}>Nº orden</Th>
							<Th size={'big'}>Nombre</Th>
							<Th>Producto</Th>
							<Th size={'big'}>Cliente</Th>
							<Th>Estado</Th>
							<Th>Recibido</Th>
							<Th>Fecha límite</Th>
							<Th>Presupuesto</Th>
						</Tr>
					</Thead>
				</Table>
				<Table>
					<Tbody>
						{orders.map((order) => (
							<Tr key={order._id}>
								<Td size={'small'}>{order.orderNumber}</Td>
								<Td size={'big'}>{order.name}</Td>
								<Td>{order.product}</Td>
								<Td size={'big'}>
									{order.client.companyName}
								</Td>
								<Td>{order.status}</Td>
								<Td>{order.dateReceived}</Td>
								<Td warning={isWarning(order)}>
									{order.dateFinal}
								</Td>
								<Td>${order.budget}</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</div>
			{ordersCount > 50 ? (
				<div className={styles.pagination}>
					<button
						onClick={() =>
							setCurrentPage((prev) =>
								Math.max(prev - 1, 1)
							)
						}
						disabled={currentPage === 1}
					>
						Anterior
					</button>
					{getPaginationRange().map((page) => (
						<button
							key={page}
							onClick={() => setCurrentPage(page)}
							style={{
								fontWeight:
									page === currentPage ? 'bold' : 'normal',
							}}
						>
							{page}
						</button>
					))}
					<button
						onClick={() =>
							setCurrentPage((prev) =>
								Math.min(prev + 1, totalPages)
							)
						}
						disabled={currentPage === totalPages}
					>
						Siguiente
					</button>
				</div>
			) : (
				''
			)}
		</div>
	);
}

export default OrdersList;
