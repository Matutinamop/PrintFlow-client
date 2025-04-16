import axios from 'axios';

export const deactivateOrder = async (orderId) => {
	try {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/api/workStation/lite`
		);

		const stationWithOrder = res.data.stations.find(
			(station) =>
				station.tasks.some((task) => task === orderId)
		);
		if (!stationWithOrder) {
			return;
		}
		const newTasks = stationWithOrder.tasks.filter(
			(task) => task !== orderId
		);
		const body = {
			tasks: newTasks,
		};

		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/workStation/${stationWithOrder._id}`,
			body
		);
		return response;
	} catch (error) {
		console.error(error);
	}
};
