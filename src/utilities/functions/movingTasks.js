import {
	addTask,
	removeTask,
	updateStationsList,
} from './workStation/updateTasks';

export const movingTasks = (
	result,
	newStations,
	setLoaderModal
) => {
	const { destination, source, draggableId } = result;

	if (!destination || !source || !destination.droppableId)
		return;
	if (
		destination.droppableId === source.droppableId &&
		destination.index === source.index
	) {
		return;
	}
	const stationSrc = newStations.find(
		(station) => station._id === source.droppableId
	);

	const stationDest = newStations.find(
		(station) => station._id === destination.droppableId
	);
	const movedTask = stationSrc.tasks.find(
		(task) => task._id === draggableId
	);
	let changedStations;

	if (stationSrc !== stationDest) {
		const newSrcTasks = stationSrc.tasks.filter(
			(task) => task !== movedTask
		);

		const newDestTasks = [...stationDest.tasks];
		newDestTasks.splice(destination?.index, 0, movedTask);

		changedStations = newStations.map((station) => {
			if (station === stationSrc) {
				return { ...station, tasks: newSrcTasks };
			}
			if (station === stationDest) {
				return { ...station, tasks: newDestTasks };
			}
			return station;
		});
	}

	if (stationSrc === stationDest) {
		const newTasks = stationSrc.tasks.filter(
			(task) => task !== movedTask
		);
		newTasks.splice(destination.index, 0, movedTask);

		changedStations = newStations.map((station) => {
			if (station._id === stationDest._id) {
				return { ...station, tasks: newTasks };
			}
			return station;
		});
	}
	(async () => {
		try {
			setLoaderModal(true);
			const removedTask = await removeTask(
				stationSrc._id,
				draggableId
			);

			if (removedTask) {
				await addTask(destination, draggableId);

				const res = await updateStationsList(
					source.droppableId,
					draggableId
				);
				console.log('dentro', res);
			}
			setLoaderModal(false);
		} catch (error) {
			console.error(
				'Error al actualizar las estaciones:',
				error
			);
		}
	})();

	return changedStations;
};
