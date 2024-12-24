import { useEffect, useState } from 'react';
import styles from './tasks.module.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Modal from '../shared/Modal';
import { TextArea } from '../shared/Inputs';
import Button from '../shared/Button';
import { movingTasks } from '../../utilities/functions/movingTasks';
import {
	fetchStationById,
	fetchStations,
} from '../../redux/workStations/workStationSlice';
import {
	closestCorners,
	DndContext,
	DragOverlay,
} from '@dnd-kit/core';
import Container from './Container';
import { Item } from './sortable_item';
import { fetchTaskById } from '../../redux/tasks/tasksSlice';

function Manager() {
	const dispatch = useDispatch();

	const { stations, station } = useSelector(
		(state) => state.workStations
	);
	const { task } = useSelector((state) => state.tasks);

	const [infoModal, setInfoModal] = useState({
		open: false,
		info: {},
	});
	const [newStations, setNewStations] = useState([]);
	const [activeTask, setActiveTask] = useState();
	const [destinationIndex, setDestinationIndex] =
		useState();

	useEffect(() => {
		dispatch(fetchStations());
	}, []);

	useEffect(() => {
		setNewStations(stations);
	}, [stations]);

	const handleMoved = async () => {
		await movingTasks(infoModal.info, newStations);

		setInfoModal({ open: false, info: {} });
	};

	return (
		<div className={styles.taskManager}>
			<Modal
				isOpen={infoModal.open}
				onClose={() => (
					setInfoModal({ open: false, info: {} }),
					dispatch(fetchStations())
				)}
				title={'Estás seguro?'}
			>
				<p>
					Mover <strong>{task?.name}</strong> a {''}
					<strong>{station?.name}</strong>?
				</p>
				<TextArea orientation="vertical" width="300px">
					Quieres dejar un comentario?
				</TextArea>
				<Button onClick={handleMoved}>Aceptar</Button>
				<Button
					onClick={() => (
						setInfoModal({ open: false, info: {} }),
						dispatch(fetchStations())
					)}
				>
					Cancelar
				</Button>
			</Modal>
			<div className={styles.paperGrid}>
				<DndContext
					collisionDetection={closestCorners}
					onDragStart={handleDragStart}
					onDragMove={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					{newStations?.map((station) => (
						<Container
							key={station._id}
							id={station._id}
							station={station}
							items={station.tasks}
						/>
					))}
					<DragOverlay>
						{activeTask ? (
							<Item id={activeTask._id} task={activeTask} />
						) : null}
					</DragOverlay>
				</DndContext>
			</div>
		</div>
	);

	function findContainer(id) {
		const station = newStations.find(
			(station) => station._id === id
		);
		if (station) {
			return id;
		}

		for (let station of newStations) {
			if (station.tasks.some((task) => task._id === id)) {
				return station._id;
			}
		}
		return;
	}

	function handleDragStart(event) {
		const { active } = event;
		const { id, data } = active;

		const taskActivated = data.current.sortable.items.find(
			(task) => task._id === id
		);

		setActiveTask(taskActivated);
	}

	function handleDragOver(event) {
		const { active, over = {} } = event;
		const { id } = active;
		const overId = over?.id;
		const { clientX, clientY } = event.activatorEvent;
		let activeContainer, overContainer;
		const { x, y } = event.delta;

		const overIsStation = newStations.find(
			(station) => station._id === overId
		);

		const updatedStations = newStations.map((station) => ({
			...station,
			tasks: station.tasks.filter(
				(task) => task._id !== id
			),
		}));

		if (overIsStation) {
			const activeTask = newStations
				.find((station) =>
					station.tasks.some((task) => task._id === id)
				)
				.tasks.find((task) => task._id === id);
			const stationIndex = newStations.findIndex(
				(station) => station._id === overId
			);

			if (
				!overIsStation.tasks.some((task) => task._id === id)
			) {
				const newOverStation = {
					...overIsStation,
					tasks: [...overIsStation.tasks, activeTask],
				};
				updatedStations[stationIndex] = newOverStation;

				setNewStations(updatedStations);
			}
		}

		if (overId && !overIsStation) {
			activeContainer = findContainer(id);
			overContainer = findContainer(overId);
		}

		if (!activeContainer || !overContainer) {
			return;
		}

		const mousePosition = {
			x: clientX + x,
			y: clientY + y,
		};

		const activeStation = newStations.find(
			(station) => station._id === activeContainer
		);
		const activeTask = activeStation.tasks.find(
			(task) => task._id === id
		);

		const stationIndex = newStations.findIndex(
			(station) => station._id === overContainer._id
		);

		const overStation = updatedStations.find(
			(station) => station._id === overContainer
		);

		const overIndex = overStation.tasks.findIndex(
			(task) => task._id === overId
		);

		if (overIndex === -1) {
			return;
		}

		const isBelowLastItem =
			over &&
			overId !== id &&
			overIndex === overStation.tasks.length - 1 &&
			mousePosition.y >
				over.rect.top + over.rect.height / 2;

		const modifier = isBelowLastItem ? 1 : 0;
		const newIndex =
			overIndex >= 0
				? overIndex + modifier
				: overStation.tasks.length;

		const newOverStation = overStation.tasks.splice(
			newIndex,
			0,
			activeTask
		);

		setDestinationIndex(newIndex);

		updatedStations[stationIndex] = newOverStation;

		setNewStations(updatedStations);
	}

	function handleDragEnd(event) {
		const { over, active } = event;

		dispatch(fetchTaskById(activeTask._id));
		dispatch(
			fetchStationById(
				over.data.current.sortable.containerId
			)
		);

		const sourceId = (() => {
			for (let station of stations) {
				if (
					station.tasks.some(
						(task) => task._id === activeTask._id
					)
				) {
					return station._id;
				}
			}
			return null;
		})();

		const sourceIndex = stations
			.find((station) => station._id === sourceId)
			.tasks.findIndex(
				(task) => task._id === activeTask._id
			);

		const result = {
			destination: {
				index: destinationIndex,
				droppableId: over.data.current.sortable.containerId,
			},
			source: {
				index: sourceIndex,
				droppableId: sourceId,
			},
			draggableId: activeTask._id,
		};

		setInfoModal({ open: true, info: result });

		setDestinationIndex();

		setActiveTask(null);
	}
}

export default Manager;
