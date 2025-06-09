import axios from 'axios';
import {
	addTask,
	removeTask,
	updateStationsList,
} from './workStation/updateTasks';
import { addComment } from './order/addComment';

const url = process.env.REACT_APP_API_URL;

/* 
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
}; */

export const movingTasks = async (info, setIsLoading) => {
	setIsLoading(true);
	const {
		destination,
		destinationTasks,
		draggedEl,
		source,
		comment,
	} = info;

	console.log('draggedEl', draggedEl);
	console.log('source', source);

	try {
		const realSource = await axios.get(
			`${url}/api/workStation/lite/${source._id}`
		);

		if (
			!realSource.data.station.tasks.find(
				(task) => task === draggedEl._id
			)
		) {
			setIsLoading(false);
			window.location.reload();
			return;
		}

		const destinationBody = { tasks: destinationTasks };

		if (destination._id === source._id) {
			const res = await axios.put(
				`${url}/api/workStation/${destination._id}`,
				destinationBody
			);
			setIsLoading(false);
			return;
		}

		const sourceBody = {
			tasks: source.tasks.filter(
				(task) => task !== draggedEl._id
			),
		};

		const newSource = await axios.put(
			`${url}/api/workStation/${source._id}`,
			sourceBody
		);

		if (newSource) {
			const newDestination = await axios.put(
				`${url}/api/workStation/${destination._id}`,
				destinationBody
			);
		}
		if (comment) {
			addComment(draggedEl._id, comment);
		}

		if (
			draggedEl.stationsList.find(
				(station) =>
					station.station.workStation === source._id
			)
		) {
			console.log('entre');
			const newStationsList = draggedEl.stationsList.map(
				(station) => {
					if (station.station.workStation === source._id) {
						console.log('station', station);
						return { ...station, completed: true };
					} else {
						return station;
					}
				}
			);
			await axios.put(`${url}/api/order/${draggedEl._id}`, {
				stationsList: newStationsList,
			});
		}

		setIsLoading(false);
		return;
	} catch (error) {
		console.error(error);
		setIsLoading(false);
		return;
	}
};
