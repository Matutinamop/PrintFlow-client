import React, { useState } from 'react';
import styles from './orders.module.css';
import { useDispatch } from 'react-redux';
import { fetchFilteredOrders } from '../../redux/orders/ordersSlice';
import { Input } from '../shared/Inputs';
import {
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '../shared/Tables';
import { isWarning } from '../../utilities/functions/dates';
import Loader from '../shared/Loader';

function AllOrdersList({ orders }) {
	return (
		<div className={styles.allOrders}>
			{!orders ? (
				<Loader />
			) : (
				<div className={styles.allOrdersTable}>
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
								<Tr
									key={order._id}
									warning={isWarning(order)}
								>
									<Td size={'small'}>
										{order.orderNumber}
									</Td>
									<Td size={'big'}>{order.name}</Td>
									<Td>{order.product}</Td>
									<Td size={'big'}>
										{order.client.companyName}
									</Td>
									<Td>{order.status}</Td>
									<Td>{order.dateReceived}</Td>
									<Td>{order.dateFinal}</Td>
									<Td>${order.budget}</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</div>
			)}
		</div>
	);
}

export default AllOrdersList;
