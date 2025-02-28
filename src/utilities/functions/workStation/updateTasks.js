import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

export const removeTask = async (stationId, taskId) => {
	try {
		const oldStation = await axios.get(
			`${url}/api/workStation/${stationId}`
		);
		if (!oldStation.data.station) {
			window.location.reload();
			return;
		}
		const hasTask = oldStation.data.station.tasks.find(
			(task) => task._id === taskId
		);
		if (!hasTask) {
			window.location.reload();
			return;
		}
		const newTasks = oldStation.data.station.tasks.filter(
			(task) => task._id !== taskId
		);
		const response = await axios.put(
			`${url}/api/workStation/${stationId}`,
			{ tasks: newTasks }
		);
		return response.data.updatedStation;
	} catch (error) {
		window.location.reload();
		return error;
	}
};

export const addTask = async (destination, taskId) => {
	const stationId = destination.droppableId;
	try {
		const oldStation = await axios.get(
			`${url}/api/workStation/${stationId}`
		);
		if (!oldStation.data.station) {
			window.location.reload();
			return;
		}
		const hasTask = oldStation.data.station.tasks.find(
			(task) => task._id === taskId
		);
		if (hasTask) {
			window.location.reload();
			return;
		}
		const newTasks = [...oldStation.data.station.tasks];
		newTasks.splice(destination.index, 0, taskId);

		const response = await axios.put(
			`${url}/api/workStation/${stationId}`,
			{ tasks: newTasks }
		);
		return response.data.updatedStation;
	} catch (error) {
		window.location.reload();
		return error;
	}
};

export const updateStationsList = async (
	stationId,
	orderId
) => {
	/* const { data: station } = await axios.get(
		`${url}/api/workStation/${stationId}`
	); */
	const { data: order } = await axios.get(
		`${url}/api/order/${orderId}`
	);

	if (order.order) {
		console.log(order.order);
		const orderTasks = order.order.stationsList
			.map((stations) => stations.station?.workStation)
			.filter(Boolean);

		console.log('tasks', orderTasks);
		const taskInStation = orderTasks.some(
			(id) => id === stationId
		);

		if (taskInStation) {
			console.log('llego aca');
			const newStationsList = order.order.stationsList.map(
				(station) => {
					if (station.station.workStation === stationId) {
						return { ...station, completed: true };
					}
					return station;
				}
			);
			await axios.put(`${url}/api/order/${orderId}`, {
				stationsList: newStationsList,
			});
		}
	}
};
