import React from 'react';
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

function MaterialsList() {
	const { loadingMaterials, materials } = useSelector(
		(state) => state.materials
	);

	return (
		<div className={styles.allMaterials}>
			<div className={styles.allMaterialsTable}>
				{loadingMaterials ? (
					<div className={styles.loader}>
						<Loader />
					</div>
				) : (
					<div className={styles.tables}>
						<Table>
							<Thead>
								<Tr>
									<Th size={'big'}>Nombre</Th>
									<Th size={'small'}>Tipo</Th>
									<Th size={'small'}>Precio por ton.</Th>
									<Th size={'small'}>Precio por un.</Th>
									<Th size={'small'}>
										Precio por m<sup>2</sup>
									</Th>
								</Tr>
							</Thead>
							<Tbody>
								{materials?.map((material) => (
									<Tr key={material?._id}>
										<Td size={'big'}>{material?.name}</Td>
										<Td size={'small'}>{material?.type}</Td>
										<Td size={'small'}>
											{material?.pricePerTon ?? '-'}
										</Td>
										<Td size={'small'}>
											{material?.pricePerUnit ?? '-'}
										</Td>
										<Td size={'small'}>
											{material?.pricePerSquareMeter ?? '-'}
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

export default MaterialsList;
