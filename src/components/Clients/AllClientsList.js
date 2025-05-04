import React, { useEffect, useState } from 'react';
import styles from './clients.module.css';
import {
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '../shared/Tables';
import Loader from '../shared/Loader';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
	cleanClient,
	fetchClientById,
} from '../../redux/clients/clientsSlice';

export function AllClientsList({
	clients,
	setFields,
	setIsEdit,
	setOpenModal,
}) {
	/* 	const [firstRender, setFirstRender] = useState(true); */
	const dispatch = useDispatch();
	/* 
	const { client } = useSelector((state) => state.clients);

	useEffect(() => {
		if (firstRender) {
			return setFirstRender(false);
		}
		if (client && Object.keys(client).length > 0) {
			setFields(client);
			
		}
	}, [client]); */

	const handleEditClick = (id) => {
		setIsEdit(true);
		dispatch(fetchClientById(id));
		setOpenModal(true);
	};
	return (
		<div className={styles.allOrders}>
			<div className={styles.allOrdersTable}>
				<div className={styles.tables}>
					<Table>
						<Thead>
							<Tr>
								<Th size={'big'}>Nombre de la empresa</Th>
								<Th size={'big'}>Razon social</Th>
								<Th size={'small'}>RUT</Th>
								<Th>Telefono</Th>
								<th className={styles.editTh}>Editar</th>
							</Tr>
						</Thead>
						<Tbody>
							{clients.map((client) => (
								<Tr key={client?._id}>
									<Td size={'big'}>
										{client?.companyName}
									</Td>
									<Td size={'big'}>{client?.legalName}</Td>
									<Td size={'small'}>{client?.RUT}</Td>
									<Td>{client?.phone}</Td>
									<td className={styles.editTd}>
										<IconButton
											style={{ padding: 0 }}
											onClick={() =>
												handleEditClick(client._id)
											}
										>
											<EditIcon
												fontSize="small"
												sx={{ color: '#101204' }}
											/>
										</IconButton>
									</td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</div>
			</div>
		</div>
	);
}
