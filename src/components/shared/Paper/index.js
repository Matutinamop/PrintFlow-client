import React from 'react';
import {
	DndContext,
	useDroppable,
	closestCenter,
} from '@dnd-kit/core';
import {
	useSortable,
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { CSS } from '@dnd-kit/utilities';
import styles from './paper.module.css';

function Task({ task }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({
		id: task._id, // ID de la tarea
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		padding: '0.5rem',
		margin: '0.5rem 0',
		backgroundColor: '#24252A',
		borderRadius: '4px',
		cursor: 'grab',
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<h4>{task.name}</h4>
			<div className={styles.content}>
				{task.description}
			</div>
		</div>
	);
}

function Paper({
	station,
	tasks,
	newStations,
	setNewStations,
}) {
	const { setNodeRef } = useDroppable({
		id: station._id, // El ID de la estación para que se pueda hacer drop aquí
	});

	const handleDragOver = (event) => {
		const { active, over } = event;
		if (!over) return;

		// Si el 'over' es una estación y el 'active' es una tarea
		const activeStation = newStations.find((station) =>
			station.tasks.some((task) => task._id === active.id)
		);

		const overStation = newStations.find(
			(station) => station._id === over.id
		);

		if (
			activeStation &&
			overStation &&
			activeStation !== overStation
		) {
			setNewStations((prev) => {
				const activeTasks = [...activeStation.tasks];
				const overTasks = [...overStation.tasks];

				// Mover la tarea de una estación a otra
				const [movedTask] = activeTasks.splice(
					activeTasks.findIndex(
						(task) => task._id === active.id
					),
					1
				);
				overTasks.push(movedTask);

				return prev.map((station) => {
					if (station._id === activeStation._id) {
						return { ...station, tasks: activeTasks };
					} else if (station._id === overStation._id) {
						return { ...station, tasks: overTasks };
					}
					return station;
				});
			});
		}
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (!over) return;

		const activeStation = newStations.find((station) =>
			station.tasks.some((task) => task._id === active.id)
		);

		if (activeStation && activeStation._id === over.id) {
			// Reordenar dentro de la misma estación
			setNewStations((prev) => {
				return prev.map((station) => {
					if (station._id === activeStation._id) {
						const updatedTasks = arrayMove(
							station.tasks,
							station.tasks.findIndex(
								(task) => task._id === active.id
							),
							station.tasks.findIndex(
								(task) => task._id === over.id
							)
						);
						return { ...station, tasks: updatedTasks };
					}
					return station;
				});
			});
		}
	};

	return (
		<div ref={setNodeRef} className={styles.paper}>
			<div className={styles.header}>
				<h3>{station.title}</h3>
				<MoreHorizIcon />
			</div>
			<DndContext
				collisionDetection={closestCenter}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<div className={styles.taskContainer}>
					<SortableContext
						items={station.tasks.map((task) => task._id)}
						strategy={verticalListSortingStrategy}
					>
						{tasks?.map((task) => (
							<Task task={task} key={task._id} />
						))}
					</SortableContext>
				</div>
			</DndContext>
		</div>
	);
}

export default Paper;
