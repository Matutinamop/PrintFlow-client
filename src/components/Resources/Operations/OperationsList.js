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

function OperationsList() {
	const { loadingOperation, operations } = useSelector(
		(state) => state.operations
	);

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
									<Th size={'big'}>Tipo</Th>
									<Th size={'big'}>Responsable</Th>
								</Tr>
							</Thead>
							<Tbody>
								{operations.map((operation) => (
									<Tr key={operation?._id}>
										<Td size={'big'}>{operation?.name}</Td>
										<Td size={'big'}>{operation?.type}</Td>
										<Td size={'big'}>
											{operation?.responsible}
										</Td>
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
