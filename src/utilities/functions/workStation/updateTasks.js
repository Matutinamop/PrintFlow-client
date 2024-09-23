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
