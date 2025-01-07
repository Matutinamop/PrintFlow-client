import React, { useState } from 'react';
import styles from './tasks.module.css';
import { useDroppable } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import SortableItem from './sortable_item';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const containerStyle = {
	background: '#dadada',
	padding: 10,
	margin: 10,
	flex: 1,
};

export default function Container(props) {
	const { id, items } = props;
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

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
				<IconButton
					sx={{
						position: 'absolute',
						top: 5,
						right: 5,
						color: '#9fadbc',
					}}
					onClick={handleClick}
				>
					<MoreVertIcon />
				</IconButton>
				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={handleClose}
					sx={{
						'& .MuiMenu-paper': {
							backgroundColor: '#101204',
							color: '#9fadbc',
							border: '1px solid #24252a',
							borderRadius: '8px',
							boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
							width: '200px',
						},
						'& .MuiMenuItem-root': {
							'&:hover': {
								backgroundColor: '#24252a',
							},
						},
					}}
				>
					<MenuItem onClick={handleClose}>
						Proximas tareas
					</MenuItem>
				</Menu>
			</div>
		</SortableContext>
	);
}
