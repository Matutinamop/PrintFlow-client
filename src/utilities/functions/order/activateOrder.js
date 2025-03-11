import axios from 'axios';

export const activateOrder = async (order) => {
	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/api/workStation`
		);
		const stationWithOrder = res.data.stations.find(
			(station) =>
				station.tasks.some((task) => task._id === order._id)
		);
		if (stationWithOrder) {
			return;
		}

		const firstStation = res.data.stations[0];

		const newTasks = [...firstStation.tasks, order];
		const body = {
			tasks: newTasks,
		};

		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/workStation/${firstStation._id}`,
			body
		);
		return response;
	} catch (error) {
		console.log(error);
	}
};
