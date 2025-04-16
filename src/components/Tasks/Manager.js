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
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import Container from './Container';
import { Item } from './sortable_item';
import { fetchTaskById } from '../../redux/tasks/tasksSlice';
import { fetchActiveOrders } from '../../redux/orders/ordersSlice';
import NextTasks from './NextTasks';
import { fetchOperations } from '../../redux/operations/operationsSlice';
import WorkShopOrder from '../Orders/WorkshopOrder';
import Loader from '../shared/Loader';

function Manager() {
	const dispatch = useDispatch();
	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor)
	);

	const { stations, station } = useSelector(
		(state) => state.workStations
	);

	const { operations } = useSelector(
		(state) => state.operations
	);
	const { activeOrders } = useSelector(
		(state) => state.orders
	);
	const { task } = useSelector((state) => state.tasks);

	const [openNextTasksModal, setOpenNextTasksModal] =
		useState({ open: false, info: {} });
	const [openOrderModal, setOpenOrderModal] = useState({});
	const [activeOrdersToShow, setActiveOrdersToShow] =
		useState({ orders: [], station: {} });

	const [infoModal, setInfoModal] = useState({
		open: false,
		info: {},
	});
	const [loaderModal, setLoaderModal] = useState(false);
	const [newStations, setNewStations] = useState([]);
	const [activeTask, setActiveTask] = useState();
	const [stationSource, setStationSource] = useState();
	const [stationDestiny, setStationDestiny] = useState();
	const [destinationIndex, setDestinationIndex] =
		useState();

	const fetchAll = () => {
		dispatch(fetchStations());
		dispatch(fetchActiveOrders());
		dispatch(fetchOperations());
	};

	useEffect(() => {
		fetchAll();
	}, [fetch]);

	useEffect(() => {
		setNewStations(stations);
	}, [stations]);

	const handleMoved = async () => {
		const res = await movingTasks(
			infoModal.info,
			newStations,
			setLoaderModal
		);
		setInfoModal({ open: false, info: {} });
	};

	function selectActiveOrders(station) {
		const allSelectActiveOrders = activeOrders.filter(
			(order) =>
				order.stationsList.some(
					(st) => st.station.workStation === station._id
				)
		);

		const finalSelectActiveOrders =
			allSelectActiveOrders.filter(
				(order) =>
					!station.tasks.some(
						(task) => task._id === order._id
					) &&
					!order.stationsList.find(
						(st) => st.station.workStation === station._id
					).completed
			);
		setActiveOrdersToShow({
			orders: finalSelectActiveOrders,
			station: station,
		});
	}

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

		const newSource = newStations.find((station) =>
			station.tasks.some(
				(task) => task._id === taskActivated._id
			)
		);

		setActiveTask(taskActivated);
		setStationSource(newSource);
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
		const idStation =
			over?.data?.current?.sortable?.containerId;

		const station = newStations.find(
			(station) => station._id === idStation
		);

		setStationDestiny(station);

		const updatedStations = newStations.map((station) => ({
			...station,
			tasks: station.tasks.filter(
				(task) => task._id !== id
			),
		}));

		if (overIsStation && activeTask) {
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

	function handleDragEnd() {
		if (stationDestiny && stationSource && activeTask) {
			const taskSourceIndex = stations
				.find(
					(station) => station._id === stationSource._id
				)
				.tasks.findIndex(
					(task) => task._id === activeTask._id
				);

			const result = {
				destination: {
					index: destinationIndex,
					droppableId: stationDestiny._id,
				},
				source: {
					index: taskSourceIndex,
					droppableId: stationSource._id,
				},
				draggableId: activeTask._id,
			};

			if (
				stationDestiny._id !== stationSource._id ||
				(Number.isInteger(destinationIndex) &&
					Number.isInteger(taskSourceIndex) &&
					destinationIndex !== taskSourceIndex)
			) {
				setInfoModal({ open: true, info: result });

				setDestinationIndex();

				setActiveTask(null);
			}
		} else {
			setOpenOrderModal({ open: true, order: activeTask });
		}
		setStationDestiny();
		setStationSource();
	}
	useEffect(() => {
		console.log('station', newStations);
	}, [newStations]);

	const cancelMove = () => {
		setInfoModal({ open: false, info: {} });
		setNewStations(stations);
	};

	useEffect(() => {
		console.log(infoModal);
	}, [infoModal]);

	return (
		<div className={styles.taskManager}>
			<Modal
				isOpen={infoModal.open}
				onClose={cancelMove}
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
				<Button onClick={cancelMove}>Cancelar</Button>
			</Modal>
			<Modal transparent isOpen={loaderModal}>
				<Loader />
			</Modal>
			<Modal
				isOpen={openNextTasksModal.open}
				onClose={() => setOpenNextTasksModal(false)}
			>
				<NextTasks
					activeOrders={activeOrdersToShow}
					setOpenModal={setOpenNextTasksModal}
					setOpenOrder={setOpenOrderModal}
				/>
			</Modal>
			<Modal
				isOpen={openOrderModal.open}
				onClose={() => setOpenOrderModal({ open: false })}
			>
				<WorkShopOrder order={openOrderModal.order} />
			</Modal>
			<div className={styles.paperGrid}>
				<DndContext
					collisionDetection={closestCorners}
					sensors={sensors}
					onDragStart={handleDragStart}
					onDragMove={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					{newStations?.map((station) => (
						<Container
							selectActiveOrders={selectActiveOrders}
							setOpenNextTasksModal={setOpenNextTasksModal}
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
}
export default Manager;
