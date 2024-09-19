import { updateStationTasks } from './workStation/updateTasks';

export const movingTasks = (result, newStations) => {
	const { destination, source, draggableId } = result;

	if (!destination || !source) return;
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

	if (stationSrc !== stationDest) {
		const newSrcTasks = stationSrc.tasks.filter(
			(task) => task !== movedTask
		);

		const newDestTasks = [...stationDest.tasks];
		newDestTasks.splice(destination.index, 0, movedTask);

		const changedStations = newStations.map((station) => {
			if (station === stationSrc) {
				return { ...station, tasks: newSrcTasks };
			}
			if (station === stationDest) {
				return { ...station, tasks: newDestTasks };
			}
			return station;
		});

		(async () => {
			try {
				const removeTask = await updateStationTasks(
					stationSrc._id,
					newSrcTasks
				);
				console.log(removeTask);

				// Si la eliminación de la tarea en la estación de origen fue exitosa
				if (removeTask) {
					console.log('empieza');
					await updateStationTasks(
						stationDest._id,
						newDestTasks
					);
					console.log('termino');
				}
			} catch (error) {
				console.error(
					'Error al actualizar las estaciones:',
					error
				);
			}
		})();

		return changedStations;
	}

	if (stationSrc === stationDest) {
		const newTasks = stationSrc.tasks.filter(
			(task) => task !== movedTask
		);
		newTasks.splice(destination.index, 0, movedTask);

		const changedStations = newStations.map((station) => {
			if (station._id === stationDest._id) {
				return { ...station, tasks: newTasks };
			}
			return station;
		});

		updateStationTasks(stationSrc._id, newTasks);
		return changedStations;
	}
};
