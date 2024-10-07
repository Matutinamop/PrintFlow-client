import React, { useEffect } from 'react';
import styles from './paper.module.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Draggable, Droppable } from 'react-beautiful-dnd';

function Paper({ title, tasks, station }) {
	return (
		<div className={styles.paper}>
			<div className={styles.header}>
				<h3>{title}</h3>
				<MoreHorizIcon />
			</div>
			<Droppable
				droppableId={station._id}
				type="list"
				key={station._id}
			>
				{(provided) => (
					<div
						className={styles.taskContainer}
						ref={provided.innerRef}
						{...provided.droppableProps}
					>
						{tasks.map((task, index) => (
							<Draggable
								draggableId={task._id}
								index={index}
								key={task._id}
							>
								{(provided) => (
									<div
										className={styles.task}
										ref={provided.innerRef}
										{...provided.dragHandleProps}
										{...provided.draggableProps}
									>
										<h4>{task.name}</h4>
										<div className={styles.content}>
											{task.description}
										</div>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</div>
	);
}

export default Paper;
