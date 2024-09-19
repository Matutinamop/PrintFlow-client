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

		if (changedStations) {
			setNewStations(changedStations);
		}
		return;
	};

	/* const onDragEnd = (result) => {
		movingTasks(result, newStations)
		const { destination, source, draggableId } = result;

		if (!destination || !source) return;
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}
		const stationSrc = newStations.find(
			(station) => station._id === source.droppableId
		);
		const stationDest = newStations.find(
			(station) => station._id === destination.droppableId
		);
		const movedTask = stationSrc.tasks.find(
			(task) => task._id === draggableId
		);

		if (stationSrc !== stationDest) {
			const newSrcTasks = stationSrc.tasks.filter(
				(task) => task !== movedTask
			);

			const newDestTasks = [...stationDest.tasks];
			newDestTasks.splice(destination.index, 0, movedTask);

			const changedStations = newStations.map((station) => {
				if (station === stationSrc) {
					return { ...station, tasks: newSrcTasks };
				}
				if (station === stationDest) {
					return { ...station, tasks: newDestTasks };
				}
				return station;
			});
			setNewStations(changedStations);
			updateStationTasks(stationSrc._id, newSrcTasks);
			updateStationTasks(stationDest._id, newDestTasks);
		}

		if (stationSrc === stationDest) {
			const newTasks = stationSrc.tasks.filter(
				(task) => task !== movedTask
			);
			newTasks.splice(destination.index, 0, movedTask);

			const changedStations = newStations.map((station) => {
				if (station._id === stationDest._id) {
					return { ...station, tasks: newTasks };
				}
				return station;
			});

			setNewStations(changedStations);
			updateStationTasks(stationSrc._id, newTasks);
		}

		return;
	}; */

	return (
		<DragDropContext onDragEnd={onDragEnd}>
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
