import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

export const updateStationTasks = async (
	stationId,
	newTasks
) => {
	const tasksToUpdate = newTasks.map((task) => task._id);
	try {
		const response = await axios.put(
			`${url}/api/workStation/${stationId}`,
			{ tasks: tasksToUpdate }
		);
		return response.data;
	} catch (error) {
		return error;
	}
};
