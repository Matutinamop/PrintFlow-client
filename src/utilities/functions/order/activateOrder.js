import axios from 'axios';

export const activateOrder = async (orderId) => {
	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/api/workStation/lite`
		);
		const stationWithOrder = res.data.stations.find(
			(station) =>
				station.tasks.some((task) => task === orderId)
		);
		if (stationWithOrder) {
			return;
		}

		const firstStation = res.data.stations[0];
		const firstStationTasks = firstStation.tasks;

		const newTasks = [orderId, ...firstStationTasks];
		const body = {
			tasks: newTasks,
		};

		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/workStation/${firstStation._id}`,
			body
		);
		return response;
	} catch (error) {
		console.error(error);
	}
};
