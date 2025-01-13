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
import Pagination from '../../shared/Pagination';
import { useDispatch } from 'react-redux';
import { fetchFilteredMaterials } from '../../../redux/materials/materialsSlice';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

function MaterialsList({ searchTerm }) {
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
	}, [currentPage, searchTerm]);

	const setPage = (page) => {
		setCurrentPage(page);
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
												/* onClick={() =>
													handleEditClick(operation)
												} */
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
			<Pagination
				count={materialsCount}
				itemsPerPage={15}
				currentPage={currentPage}
				totalPages={totalPages}
				setPage={setPage}
			/>
		</div>
	);
}

export default MaterialsList;
