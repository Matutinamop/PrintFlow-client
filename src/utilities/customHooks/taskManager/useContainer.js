import { animations } from '@formkit/drag-and-drop';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';
import { useEffect, useState } from 'react';

export const useContainer = (
	stations,
	workStation,
	orders,
	moveModal,
	setMoveModal,
	selectActiveOrders,
	setOpenNextTasksModal,
	taskManagerRef
) => {
	const billStationId = stations[stations.length - 2]._id;
	const deliveryStationId =
		stations[stations.length - 1]._id;
	const [ref, tasks, setTasks] = useDragAndDrop([], {
		draggable: (el) => {
			return el.id !== 'no-drag';
		},
		group: 'station',
		plugins: [animations()],
		name: workStation,
		onDragstart: (e) => {
			setMoveModal((prev) => ({
				...prev,
				source: e.parent.data.config.name,
				draggedEl: e.draggedNode.data.value,
			}));
		},
		onDragend: (e) => {
			handleDragEnd(e);
		},
		accepts: (parent, lastParent) => {
			const sourceId = lastParent.data.config.name._id;
			const destinationId = parent.data.config.name._id;
			if (destinationId === deliveryStationId) {
				return (
					sourceId === billStationId ||
					sourceId === destinationId
				);
			}
			if (sourceId === deliveryStationId) {
				return false;
			}
			return true;
		},
		onSort: (e) => {
			setMoveModal((prev) => ({
				...prev,
				changes: true,
			}));
		},
		onTransfer: (e) => {
			setMoveModal((prev) => ({
				...prev,
				changes: true,
			}));
		},
	});

	const [anchorEl, setAnchorEl] = useState(null);

	const handleDragEnd = (e) => {
		const sourceId = moveModal?.source?._id;
		const destination = e.parent.data.config.name;
		if (sourceId !== destination._id) {
			if (destination._id === billStationId) {
				return setMoveModal((prev) => ({
					...prev,
					destination,
					destinationTasks: e.values.map(
						(value) => value._id
					),
					bill: true,
				}));
			}
			if (destination._id === deliveryStationId) {
				if (sourceId === billStationId) {
					return setMoveModal((prev) => ({
						...prev,
						destination,
						destinationTasks: e.values.map(
							(value) => value._id
						),
						delivery: true,
					}));
				}
				return;
			}
		}
		return setMoveModal((prev) => ({
			...prev,
			destination,
			destinationTasks: e.values.map((value) => value._id),
			isOpen: prev.changes ? true : false,
		}));
	};

	useEffect(() => {
		if (orders.length > 0) {
			setTasks(
				workStation.tasks?.map((task) =>
					orders.find((order) => order?._id === task)
				)
			);
		}
	}, [orders]);

	useEffect(() => {
		if (ref.current) {
			const children = Array.from(ref.current.children);
			let count = 0;
			children?.map((child) => {
				if (child.id !== 'no-drag') {
					count = count + 1;
				}
			});
		}
	}, [ref, tasks]);

	useEffect(() => {
		let frameId;
		const scrollMargin = 50;
		const scrollSpeed = 1;

		const handleDragOver = (e) => {
			e.preventDefault();
			const { clientX, clientY } = e;

			cancelAnimationFrame(frameId);
			frameId = requestAnimationFrame(() => {
				if (!taskManagerRef.current) return;
				const rect =
					taskManagerRef.current.getBoundingClientRect();

				if (clientY - rect.top < scrollMargin) {
					taskManagerRef.current.scrollBy(0, -scrollSpeed);
				} else if (rect.bottom - clientY < scrollMargin) {
					taskManagerRef.current.scrollBy(0, scrollSpeed);
				}

				if (clientX - rect.left < scrollMargin) {
					taskManagerRef.current.scrollBy(-scrollSpeed, 0);
				} else if (rect.right - clientX < scrollMargin) {
					taskManagerRef.current.scrollBy(scrollSpeed, 0);
				}
			});
		};

		document.addEventListener('dragover', handleDragOver, {
			capture: true,
		});
		return () => {
			document.removeEventListener(
				'dragover',
				handleDragOver,
				{ capture: true }
			);
			cancelAnimationFrame(frameId);
		};
	}, []);

	const handleOpenMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleSelectOption = () => {
		selectActiveOrders(workStation);
		setOpenNextTasksModal({
			open: true,
			info: workStation,
		});
		setAnchorEl(null);
	};

	return {
		ref,
		tasks,
		anchorEl,
		setAnchorEl,
		handleOpenMenu,
		handleSelectOption,
	};
};
