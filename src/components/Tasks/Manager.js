import React, { useEffect, useState } from 'react';
import styles from './tasks.module.css';
import Loader from '../shared/Loader';
import Modal from '../shared/Modal';
import { TextArea } from '../shared/Inputs';
import Button from '../shared/Button';
import Paper from '../shared/Paper';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
	fetchStationById,
	fetchStations,
} from '../../redux/workStations/workStationSlice';
import { fetchTaskById } from '../../redux/tasks/tasksSlice';
import { movingTasks } from '../../utilities/functions/movingTasks';
import { DragDropContext } from 'react-beautiful-dnd';

function Manager() {
	const dispatch = useDispatch();

	const {
		loadingStation,
		stations,
		station,
		errorStation,
	} = useSelector((state) => state.workStations);
	const { loadingTask, task } = useSelector(
		(state) => state.tasks
	);

	const [infoModal, setInfoModal] = useState({
		open: false,
		info: {},
	});
	const [newStations, setNewStations] = useState([]);

	useEffect(() => {
		dispatch(fetchStations());
	}, []);

	useEffect(() => {
		setNewStations(stations);
	}, [stations]);

	const onDragEnd = async (result) => {
		dispatch(fetchTaskById(result.draggableId));
		dispatch(
			fetchStationById(result.destination.droppableId)
		);
		setInfoModal({ open: true, info: result });

		return;
	};

	const handleMoved = async () => {
		const changedStations = await movingTasks(
			infoModal.info,
			newStations
		);

		if (changedStations) {
			setNewStations(changedStations);
		}
		setInfoModal({ open: false, info: {} });
	};

	return (
		<DragDropContext
			onDragEnd={(result) => {
				onDragEnd(result);
			}}
		>
			<div className={styles.taskManager}>
				{loadingStation ? (
					<div className={styles.loader}>
						<Loader />
					</div>
				) : (
					<div className={styles.paperGrid}>
						<Modal
							isOpen={infoModal.open}
							onClose={() =>
								setInfoModal({ open: false, info: {} })
							}
							title={'Estás seguro?'}
						>
							<p>
								Mover <strong>{task?.name}</strong> a {''}
								<strong>{station?.name}</strong>?
							</p>
							<TextArea
								orientation="vertical"
								width="300px"
							>
								Quieres dejar un comentario?
							</TextArea>
							<Button onClick={handleMoved}>Aceptar</Button>
							<Button
								onClick={() =>
									setInfoModal({ open: false, info: {} })
								}
							>
								Cancelar
							</Button>
						</Modal>
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

export default Manager;
