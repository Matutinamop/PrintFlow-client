import styles from './tasks.module.css';
import React, { useEffect, useState } from 'react';
import { animations, state } from '@formkit/drag-and-drop';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchStations } from '../../redux/workStations/workStationSlice';
import { fetchActiveOrders } from '../../redux/orders/ordersSlice';
import { fetchOperations } from '../../redux/operations/operationsSlice';
import Modal from '../shared/Modal';
import { Button } from '@mui/material';
import Loader from '../shared/Loader';
import { movingTasks } from '../../utilities/functions/movingTasks';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NextTasks from './NextTasks';
import WorkShopOrder from '../Orders/WorkshopOrder';

function NewManager() {
	const dispatch = useDispatch();
	const { stations } = useSelector(
		(state) => state.workStations
	);
	const { activeOrders } = useSelector(
		(state) => state.orders
	);
	const [activeOrdersToShow, setActiveOrdersToShow] =
		useState({ orders: [], station: {} });
	const [openNextTasksModal, setOpenNextTasksModal] =
		useState({ open: false, info: {} });
	const [openOrderModal, setOpenOrderModal] = useState({});
	const moveModalInit = {
		isOpen: false,
		changes: false,
		source: null,
		draggedEl: null,
		destinationTasks: null,
		destination: null,
	};
	const [moveModal, setMoveModal] = useState(moveModalInit);

	const [isLoading, setIsLoading] = useState(true);

	const fetchAll = () => {
		dispatch(fetchStations());
		dispatch(fetchActiveOrders());
		dispatch(fetchOperations());
	};

	useEffect(() => {
		fetchAll();
	}, []);

	const cancelMove = () => {
		setMoveModal(moveModalInit);
		dispatch(fetchStations());
		dispatch(fetchActiveOrders());
	};

	const handleMove = async () => {
		movingTasks(moveModal, setIsLoading);
	};

	useEffect(() => {
		if (!isLoading) {
			setMoveModal(moveModalInit);
			fetchAll();
		}
	}, [isLoading]);

	useEffect(() => {
		if (activeOrders.length > 0) {
			setIsLoading(false);
		}
	}, [activeOrders]);

	/* 	useEffect(() => {
		if (moveModal.draggedEl && !moveModal.changes) {
			setOpenOrderModal({
				open: true,
				order: moveModal.draggedEl,
			});
		}
		console.log(moveModal);
	}, [moveModal]); */

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

	return (
		<div className={styles.taskManager}>
			<Modal
				isOpen={moveModal.isOpen}
				onClose={cancelMove}
				title={'Estás seguro?'}
			>
				<p>
					Mover{' '}
					<strong>{moveModal.draggedEl?.product}</strong> a{' '}
					{''}
					<strong>{moveModal.destination?.name}</strong>?
				</p>
				<label>Quieres dejar un comentario?</label>
				<textarea />

				<Button
					variant="contained"
					color="success"
					onClick={handleMove}
				>
					Aceptar
				</Button>
				<Button
					variant="contained"
					color="error"
					onClick={cancelMove}
				>
					Cancelar
				</Button>
			</Modal>
			<Modal transparent isOpen={isLoading}>
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
				{stations.map((station) => (
					<Container
						workStation={station}
						key={station._id}
						orders={activeOrders}
						setMoveModal={setMoveModal}
						selectActiveOrders={selectActiveOrders}
						setOpenNextTasksModal={setOpenNextTasksModal}
						setOpenOrderModal={setOpenOrderModal}
					/>
				))}
			</div>
		</div>
	);
}

function Container({
	workStation,
	orders,
	setMoveModal,
	selectActiveOrders,
	setOpenNextTasksModal,
	setOpenOrderModal,
}) {
	const [ref, tasks, setTasks] = useDragAndDrop([], {
		draggable: (el) => {
			return el.id !== 'no-drag';
		},
		group: 'station',
		plugins: [animations()],
		name: workStation,
		onDragstart: (e) => {
			setMoveModal((prev) => ({
				...prev,
				source: e.parent.data.config.name,
				draggedEl: e.draggedNode.data.value,
			}));
		},
		onDragend: (e) => {
			setMoveModal((prev) => ({
				...prev,
				destination: e.parent.data.config.name,
				destinationTasks: e.values.map(
					(value) => value._id
				),
				isOpen: prev.changes ? true : false,
			}));
		},

		onSort: (e) => {
			setMoveModal((prev) => ({
				...prev,
				changes: true,
			}));
		},
		onTransfer: (e) => {
			setMoveModal((prev) => ({
				...prev,
				changes: true,
			}));
		},
	});

	useEffect(() => {
		if (orders.length > 0) {
			setTasks(
				workStation.tasks.map((task) =>
					orders.find((order) => order?._id === task)
				)
			);
		}
	}, [orders]);

	const [anchorEl, setAnchorEl] = useState(null);

	const handleOpenMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleSelectOption = () => {
		selectActiveOrders(workStation);
		setOpenNextTasksModal({
			open: true,
			info: workStation,
		});
		setAnchorEl(null);
	};

	useEffect(() => {
		if (ref.current) {
			const children = Array.from(ref.current.children);
			let count = 0;
			children.map((child) => {
				if (child.id !== 'no-drag') {
					count = count + 1;
				}
			});
		}
	}, [ref, tasks]);

	return (
		<div className={styles.container} ref={ref}>
			<h3 id="no-drag">{workStation.name}</h3>
			{tasks?.map((task) => (
				<div
					className={styles.task}
					key={task?._id}
					onClick={() =>
						setOpenOrderModal({
							open: true,
							order: task,
						})
					}
				>
					<h4>
						{task?.orderNumber}
						{task?.product}
					</h4>
					<div className={styles.content}>
						{task?.client.companyName}
					</div>
				</div>
			))}
			<IconButton
				id="no-drag"
				sx={{
					position: 'absolute',
					top: 5,
					right: 5,
					color: '#9fadbc',
				}}
				onClick={handleOpenMenu}
			>
				<MoreVertIcon id="no-drag" />
			</IconButton>
			<Menu
				id="no-drag"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(false)}
				sx={{
					'& .MuiMenu-paper': {
						backgroundColor: '#101204',
						color: '#9fadbc',
						border: '1px solid #24252a',
						borderRadius: '8px',
						boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
						width: '200px',
					},
					'& .MuiMenuItem-root': {
						'&:hover': {
							backgroundColor: '#24252a',
						},
					},
				}}
			>
				<MenuItem id="no-drag" onClick={handleSelectOption}>
					Proximas tareas
				</MenuItem>
			</Menu>
		</div>
	);
}

export default NewManager;
