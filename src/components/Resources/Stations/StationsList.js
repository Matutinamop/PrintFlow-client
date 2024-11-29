import React from 'react';
import styles from './stations.module.css';
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

function StationsList() {
	const { loadingStation, stations } = useSelector(
		(state) => state.workStations
	);

	return (
		<div className={styles.allStations}>
			<div className={styles.allStationsTable}>
				{loadingStation ? (
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
								{stations.map((station) => (
									<Tr key={station?._id}>
										<Td size={'big'}>{station?.name}</Td>
										<Td size={'big'}>{station?.type}</Td>
										<Td size={'big'}>
											{station?.responsible}
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

export default StationsList;
