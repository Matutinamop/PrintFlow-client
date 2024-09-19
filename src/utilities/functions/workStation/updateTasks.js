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
		const newArray = response.data.updatedStation.tasks;
		const oldArray = response.data.oldStation.tasks;

		console.log(newArray, oldArray);

		if (
			(oldArray.length === 0 && newArray.length === 0) ||
			(newArray.length === oldArray.length &&
				oldArray.every(
					(value, index) => value === newArray[index]
				))
		) {
			window.location.reload();
		}
		return response.data.updatedStation;
	} catch (error) {
		window.location.reload();
		return error;
	}
};
