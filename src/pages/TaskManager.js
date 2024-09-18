import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './pages.module.css';
import Paper from '../components/shared/Paper';
import { fetchStations } from '../redux/workStation/workStationSlice';
import Loader from '../components/shared/Loader';
import {
	DragDropContext,
	Droppable,
} from 'react-beautiful-dnd';

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

	const onDragEnd = (result) => {
		const { destination, source, draggableId } = result;
		if (!destination) return;
		const stationSrc = newStations.find(
			(station) => station._id === source.droppableId
		);
		const stationDest = newStations.find(
			(station) => station._id === destination.droppableId
		);
		if (stationSrc !== stationDest) {
			// Buscamos la tarea que se movió
			const movedTask = stationSrc.tasks.find(
				(task) => task._id === draggableId
			);

			// Agregamos la tarea a la estación de destino (en la posición indicada por destination.index)
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

			// Actualizamos el estado con las nuevas estaciones
		}
	};

	/* 	const onDragEnd = (result) => {
		const { destination, source, draggableId } = result;

		const stationSrc = newStations.find(
			(station) => station._id === source.droppableId
		);
		const stationDest = newStations.find(
			(station) => station._id === destination.droppableId
		);

		if (stationSrc !== stationDest) {
			const changedStations = newStations;
			changedStations.map((station) => {
				if (station._id === source.droppableId) {
					return stationSrc.tasks.filter(
						(task) => task._id !== draggableId
					);
				}
			});
			stationSrc.tasks.map((task))

			const newTasks = stationSrc.tasks.filter(
				(task) => task._id !== draggableId
			);
			stationSrc.tasks = newTasks;
			console.log(changedStations[0]);
		}
		console.log(result);
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
