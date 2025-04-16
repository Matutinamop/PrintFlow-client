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
import { IconButton, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from 'react-redux';
import { fetchFilteredOperations } from '../../../redux/operations/operationsSlice';
/* import Pagination from '../../shared/Pagination'; */

function OperationsList({
	setFields,
	openOperationModal,
	setOpenOperationModal,
	searchTerm,
	setIsEdit,
}) {
	const dispatch = useDispatch();
	const [currentpage, setCurrentPage] = useState(1);
	const [totalpages, setTotalPages] = useState(0);

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
				page: currentpage,
			})
		);
	}, [currentpage, searchTerm, openOperationModal]);

	const setPage = (event, page) => {
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
			<div className={styles.paginationContainer}>
				<Pagination
					count={totalpages}
					page={currentpage}
					onChange={setPage}
					variant="contained"
					shape="rounded"
					sx={{
						'& .MuiPaginationItem-root': {
							color: 'white',
							backgroundColor: '#1976D2', // Color de los botones
							'&:hover': {
								backgroundColor: 'lightblue', // Color al pasar el cursor
							},
						},
						'& .MuiPaginationItem-root.Mui-selected': {
							backgroundColor: '#0D47A1',
						},
					}}
				/>
			</div>

			<Pagination
				count={Math.ceil(operationsCount / 15)}
				page={currentpage}
				onChange={(event, page) => setPage(page)}
			/>
		</div>
	);
}

export default OperationsList;
