import React, { useEffect, useState } from 'react';
import styles from './operations.module.css';
import {
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '../../shared/Tables';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from 'react-redux';
import { fetchFilteredOperations } from '../../../redux/operations/operationsSlice';
import Pagination from '../../shared/Pagination';

function OperationsList({
	setFields,
	openOperationModal,
	setOpenOperationModal,
	searchTerm,
	setIsEdit,
}) {
	const dispatch = useDispatch();
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

	const { operations, operationsCount } = useSelector(
		(state) => state.operations
	);

	useEffect(() => {
		const pages = Math.ceil(operationsCount / 15);
		setTotalPages(pages);
		setCurrentPage(1);
	}, [operationsCount]);

	useEffect(() => {
		dispatch(
			fetchFilteredOperations({
				searchTerm,
				page: currentPage,
			})
		);
	}, [currentPage, searchTerm, openOperationModal]);

	const setPage = (page) => {
		setCurrentPage(page);
	};

	const handleEditClick = (info) => {
		if (info.pricingRules) {
			setFields({ ...info, progressivePrice: true });
		}
		setFields({ ...info });
		setIsEdit(true);
		setOpenOperationModal(true);
	};

	return (
		<div className={styles.allOperations}>
			<div className={styles.allOperationsTable}>
				<div className={styles.tables}>
					<Table>
						<Thead>
							<Tr>
								<Th size={'big'}>Nombre</Th>
								<Th size={'normal'}>Tipo de unidad</Th>
								<Th size={'big'}>Estación</Th>
								<th className={styles.editTh}>Editar</th>
							</Tr>
						</Thead>
						<Tbody>
							{operations.map((operation) => (
								<Tr key={operation?._id}>
									<Td size={'big'}>{operation?.name}</Td>
									<Td size={'normal'}>
										{operation?.unitType ?? '-'}
									</Td>
									<Td size={'big'}>
										{operation?.workStation.name}
									</Td>
									<td className={styles.editTd}>
										<IconButton
											style={{ padding: 0 }}
											onClick={() =>
												handleEditClick(operation)
											}
											color="primary"
										>
											<EditIcon fontSize="small" />
										</IconButton>
									</td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</div>
			</div>
			<Pagination
				count={operationsCount}
				itemsPerPage={15}
				currentPage={currentPage}
				totalPages={totalPages}
				setPage={setPage}
			/>
		</div>
	);
}

export default OperationsList;
