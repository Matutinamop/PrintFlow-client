import React, { useEffect, useState } from 'react';
import styles from './materials.module.css';
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
/* import Pagination from '../../shared/Pagination'; */
import { useDispatch } from 'react-redux';
import { fetchFilteredMaterials } from '../../../redux/materials/materialsSlice';
import { IconButton, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

function MaterialsList({
	searchTerm,
	setIsEdit,
	setFields,
	openMaterialModal,
	setOpenMaterialModal,
}) {
	const dispatch = useDispatch();
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

	const { loadingMaterials, materials, materialsCount } =
		useSelector((state) => state.materials);

	useEffect(() => {
		const pages = Math.ceil(materialsCount / 15);
		setTotalPages(pages);
		setCurrentPage(1);
	}, [materialsCount]);

	useEffect(() => {
		dispatch(
			fetchFilteredMaterials({
				searchTerm: searchTerm ? searchTerm : '',
				page: currentPage,
			})
		);
	}, [currentPage, searchTerm, openMaterialModal]);

	const setPage = (event, page) => {
		setCurrentPage(page);
	};

	const handleEditClick = (info) => {
		setFields({ ...info });
		setIsEdit(true);
		setOpenMaterialModal(true);
	};

	return (
		<div className={styles.allMaterials}>
			<div className={styles.allMaterialsTable}>
				{loadingMaterials ? (
					<div className={styles.loader}>
						<Loader />
					</div>
				) : (
					<div className={styles.table}>
						<Table>
							<Thead>
								<Tr>
									<Th size={'big'}>Nombre</Th>
									<Th size={'big'}>Tipo de unidad</Th>
									<Th size={'big'}>Precio</Th>

									<th className={styles.editTh}>Editar</th>
								</Tr>
							</Thead>
							<Tbody>
								{materials?.map((material) => (
									<Tr key={material?._id}>
										<Td size={'big'}>{material?.name}</Td>
										<Td size={'big'}>
											{material?.unitType}
										</Td>
										<Td size={'big'}>
											{material?.pricePerUnitType}
										</Td>
										<td className={styles.editTd}>
											<IconButton
												style={{ padding: 0 }}
												onClick={() =>
													handleEditClick(material)
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
				)}
			</div>
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

export default MaterialsList;
