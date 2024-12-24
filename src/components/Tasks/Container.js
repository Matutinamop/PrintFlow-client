import React from 'react';
import styles from './tasks.module.css';
import { useDroppable } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import SortableItem from './sortable_item';

const containerStyle = {
	background: '#dadada',
	padding: 10,
	margin: 10,
	flex: 1,
};

export default function Container(props) {
	const { id, items } = props;

	const { setNodeRef } = useDroppable({
		id,
	});

	return (
		<SortableContext
			id={id}
			items={items}
			strategy={verticalListSortingStrategy}
		>
			<div ref={setNodeRef} className={styles.container}>
				<h2>{props.station.name}</h2>
				{items.map((item) => (
					<SortableItem
						task={item}
						key={item?._id}
						id={item?._id}
					/>
				))}
			</div>
		</SortableContext>
	);
}
