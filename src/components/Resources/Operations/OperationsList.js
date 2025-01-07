import React from 'react';
import styles from './operations.module.css';
import {
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '../../shared/Tables';
import Loader from '../../shared/Loader';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

function OperationsList({
	setFields,
	setOpenOperationModal,
}) {
	const { loadingOperation, operations } = useSelector(
		(state) => state.operations
	);

	const handleEditClick = (info) => {
		console.log(info);
		if (info.pricingRules) {
			setFields({ ...info, progressivePrice: true });
		}
		setFields({ ...info });
		setOpenOperationModal(true);
	};

	return (
		<div className={styles.allOperations}>
			<div className={styles.allOperationsTable}>
				{loadingOperation ? (
					<div className={styles.loader}>
						<Loader />
					</div>
				) : (
					<div className={styles.tables}>
						<Table>
							<Thead>
								<Tr>
									<Th size={'big'}>Nombre</Th>
									<Th size={'big'}>Tipo de unidad</Th>
									<Th size={'big'}>Estación</Th>
									<th className={styles.editTh}>Editar</th>
								</Tr>
							</Thead>
							<Tbody>
								{operations.map((operation) => (
									<Tr key={operation?._id}>
										<Td size={'big'}>{operation?.name}</Td>
										<Td size={'big'}>
											{operation?.unitType ?? '-'}
										</Td>
										<Td size={'big'}>
											{operation?.workStation.name}
										</Td>
										<td className={styles.editTd}>
											<IconButton
												onClick={() =>
													handleEditClick(operation)
												}
												color="primary"
											>
												<EditIcon />
											</IconButton>
										</td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</div>
				)}
			</div>
		</div>
	);
}

export default OperationsList;
