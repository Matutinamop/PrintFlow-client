import React from 'react';
import styles from './tasks.module.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function Item(props) {
	const { id, task } = props;

	const style = {
		width: '100%',
		height: 50,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: '1px solid black',
		margin: '0',
		background: 'white',
	};

	return (
		<div className={styles.task} id={id}>
			<h4>{task?.name}</h4>
			<div className={styles.content}>
				{task?.description}
			</div>
		</div>
	);
}

export default function SortableItem(props) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id: props.id });

	const style = {
		transform: transform
			? CSS.Transform.toString(transform)
			: undefined,
		transition,
	};

	return (
		<div
			className={styles.taskContainer}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<Item id={props.id} task={props.task} />
		</div>
	);
}
