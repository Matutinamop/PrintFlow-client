import React, { useEffect } from 'react';
import styles from '../../pages.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersPage } from '../../../redux/orders/ordersSlice';
import {
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '../../../components/shared/Tables';
import { Input } from '../../../components/shared/Inputs';

function OrdersList() {
	const { loadingOrders, orders, errorOrders } =
		useSelector((state) => state.orders);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchOrdersPage());
	}, []);

	return (
		<div className={styles.ordersList}>
			<div className={styles.ordersListTable}>
				<h2 className={styles.ordersListTitle}>
					Lista de órdenes
				</h2>
				<div className={styles.ordersListSearch}>
					<Input
						placeholder={'Buscar por cliente o producto'}
					>
						Buscar:{' '}
					</Input>
				</div>
				<Table>
					<Thead>
						<Th size={'small'}>Nº orden</Th>
						<Th size={'big'}>Nombre</Th>
						<Th>Producto</Th>
						<Th size={'big'}>Cliente</Th>
						<Th>Estado</Th>
						<Th>Recibido</Th>
						<Th>Presupuesto</Th>
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
								<Td>${order.budget}</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</div>
		</div>
	);
}

export default OrdersList;
