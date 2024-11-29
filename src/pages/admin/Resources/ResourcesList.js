import React, { useEffect } from 'react';
import styles from './resources.module.css';
import { useDispatch } from 'react-redux';
import { fetchStations } from '../../../redux/workStations/workStationSlice';
import StationsList from '../../../components/Resources/Stations/StationsList';
import { fetchMaterials } from '../../../redux/materials/materialsSlice';
import MaterialsList from '../../../components/Resources/Materials/MaterialsList';

function ResourcesList() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchStations());
		dispatch(fetchMaterials());
	}, []);

	return (
		<div className={styles.resourcesPage}>
			<div className={styles.stationsList}>
				<h2 className={styles.title}>
					ESTACIONES DE TRABAJO
				</h2>
				<StationsList />
			</div>
			<div className={styles.materialsList}>
				<h2 className={styles.title}>MATERIALES</h2>
				<MaterialsList />
			</div>
		</div>
	);
}

export default ResourcesList;
