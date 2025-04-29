import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStations } from '../../../redux/workStations/workStationSlice';
import { fetchActiveOrders } from '../../../redux/orders/ordersSlice';
import { fetchOperations } from '../../../redux/operations/operationsSlice';
import { movingTasks } from '../../functions/movingTasks';

export const useTaskManager = () => {
	const dispatch = useDispatch();
	const taskManagerRef = useRef(null);
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
		comment: '',
		bill: false,
		billNumber: '',
		delivery: false,
	};
	const [moveModal, setMoveModal] = useState(moveModalInit);

	useEffect(() => {
		if (!openOrderModal.open) {
			fetchAll();
		}
	}, [openOrderModal]);

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
		setIsLoading(false);
		if (activeOrders.length > 0) {
			setIsLoading(false);
		}
	}, [activeOrders]);

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

	return {
		taskManagerRef,
		stations,
		activeOrders,
		activeOrdersToShow,
		openNextTasksModal,
		setOpenNextTasksModal,
		openOrderModal,
		setOpenOrderModal,
		moveModal,
		setMoveModal,
		isLoading,
		cancelMove,
		handleMove,
		selectActiveOrders,
	};
};
