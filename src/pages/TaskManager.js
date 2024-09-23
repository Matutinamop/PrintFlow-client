import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './pages.module.css';
import Paper from '../components/shared/Paper';
import { fetchStations } from '../redux/workStation/workStationSlice';
import Loader from '../components/shared/Loader';
import { DragDropContext } from 'react-beautiful-dnd';
import { movingTasks } from '../utilities/functions/movingTasks';

function TaskManager() {
	const dispatch = useDispatch();
	const { loadingStation, stations, errorStation } =
		useSelector((state) => state.workStation);
	const [newStations, setNewStations] = useState([]);
	const [isDragAllowed, setIsDragAllowed] = useState(true);

	useEffect(() => {
		dispatch(fetchStations());
	}, []);

	useEffect(() => {
		setNewStations(stations);
	}, [stations]);

	const onDragEnd = async (result) => {
		const changedStations = await movingTasks(
			result,
			newStations
		);

		setIsDragAllowed(false);

		if (changedStations) {
			setNewStations(changedStations);
		}
		setTimeout(() => {
			setIsDragAllowed(true);
		}, 500);

		return;
	};

	return (
		<DragDropContext
			onDragEnd={(result) => {
				if (isDragAllowed) {
					onDragEnd(result);
				}
			}}
		>
			<div className={styles.taskManager}>
				{loadingStation ? (
					<div className={styles.loader}>
						<Loader />
					</div>
				) : (
					<div className={styles.paperGrid}>
						{newStations.map((station) => (
							<div
								className={styles.list}
								key={station._id}
							>
								<Paper
									title={station.name}
									tasks={station.tasks}
									station={station}
								/>
							</div>
						))}
					</div>
				)}
			</div>
		</DragDropContext>
	);
}

export default TaskManager;
