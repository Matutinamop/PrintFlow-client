import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStations } from '../../../redux/workStations/workStationSlice';
import { fetchActiveOrders } from '../../../redux/orders/ordersSlice';
import { fetchOperations } from '../../../redux/operations/operationsSlice';
import { movingTasks } from '../../functions/movingTasks';
import { activateOrder } from '../../functions/order/activateOrder';

export const useTaskManager = () => {
  const dispatch = useDispatch();
  const taskManagerRef = useRef(null);
  const { stations } = useSelector((state) => state.workStations);
  const { activeOrders } = useSelector((state) => state.orders);
  const [activeOrdersToShow, setActiveOrdersToShow] = useState({
    orders: [],
    station: {},
  });
  const [openNextTasksModal, setOpenNextTasksModal] = useState({
    open: false,
    info: {},
  });
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

  useEffect(() => {
    if (!Array.isArray(stations)) return;

    const tasksArray = new Set(stations.flatMap((station) => station.tasks));
    const ordersOut = activeOrders.filter(
      (order) => !tasksArray.has(order._id)
    );
    console.log('tasksArray', tasksArray);
    console.log('ordersOut', ordersOut);
    if (ordersOut.length > 0) {
      ordersOut.forEach((order) => activateOrder(order._id));
    }
  }, [stations]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = () => {
    dispatch(fetchStations());
    dispatch(fetchActiveOrders());
    dispatch(fetchOperations());
  };

  useEffect(() => {
    fetchAll(); // ejecución inicial

    const interval = setInterval(() => {
      fetchAll();
    }, 60000); // 60 segundos

    return () => clearInterval(interval); // limpieza
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
    const allSelectActiveOrders = activeOrders.filter((order) =>
      order.stationsList.some((st) => st.station.workStation === station._id)
    );

    const finalSelectActiveOrders = allSelectActiveOrders.filter(
      (order) =>
        !station.tasks.some((task) => task === order._id) &&
        !order.stationsList.find((st) => st.station.workStation === station._id)
          .completed
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
