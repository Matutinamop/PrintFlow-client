import styles from './tasks.module.css';
import React, { useEffect, useState } from 'react';
import { animations } from '@formkit/drag-and-drop';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';
import Modal from '../shared/Modal';
import { Button } from '@mui/material';
import Loader from '../shared/Loader';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NextTasks from './NextTasks';
import WorkShopOrder from '../Orders/WorkshopOrder';
import { useTaskManager } from '../../utilities/customHooks/taskManager/useTaskManager';
import { useContainer } from '../../utilities/customHooks/taskManager/useContainer';
import {
	billOrder,
	completeOrder,
} from '../../utilities/functions/order/updateOrder';
import {
	toFormatDate,
	warningLevel,
} from '../../utilities/functions/dates';
import clsx from 'clsx';
import { fetchOrderById } from '../../redux/orders/ordersSlice';
import { useDispatch } from 'react-redux';

function NewManager() {
	const {
		taskManagerRef,
		stations,
		activeOrders,
		activeOrdersToShow,
		openNextTasksModal,
		setOpenNextTasksModal,
		openOrderModal,
		setOpenOrderModal,
		moveModal,
		setMoveModal,
		isLoading,
		cancelMove,
		handleMove,
		selectActiveOrders,
	} = useTaskManager();

	return (
		<div
			className={styles.taskManager}
			ref={taskManagerRef}
		>
			<Modal isOpen={moveModal.isOpen} onClose={cancelMove}>
				<div className={styles.modal}>
					<p className={styles.modalTitle}>
						Mover{' '}
						<strong>{moveModal.draggedEl?.product}</strong>{' '}
						a {''}
						<strong>{moveModal.destination?.name}</strong>?
					</p>
					<label className={styles.modalDescription}>
						Quieres dejar un comentario?
					</label>
					<textarea
						className={styles.modalTextarea}
						value={moveModal.comment}
						onChange={(e) =>
							setMoveModal((prev) => ({
								...prev,
								comment: e.target.value,
							}))
						}
					/>
					<div className={styles.modalButtons}>
						<Button
							variant="contained"
							color="success"
							onClick={handleMove}
						>
							Aceptar
						</Button>
						<Button
							variant="contained"
							color="error"
							onClick={cancelMove}
						>
							Cancelar
						</Button>
					</div>
				</div>
			</Modal>
			<Modal transparent isOpen={isLoading}>
				<Loader />
			</Modal>
			<Modal
				isOpen={openNextTasksModal.open}
				onClose={() => setOpenNextTasksModal(false)}
			>
				<NextTasks
					activeOrders={activeOrdersToShow}
					setOpenModal={setOpenNextTasksModal}
					setOpenOrder={setOpenOrderModal}
				/>
			</Modal>
			<Modal
				isOpen={openOrderModal.open}
				onClose={() => setOpenOrderModal({ open: false })}
			>
				<WorkShopOrder order={openOrderModal.order} />
			</Modal>
			<Modal isOpen={moveModal.bill} onClose={cancelMove}>
				<div className={styles.modal}>
					<p className={styles.modalTitle}>
						Si desea mover la orden{' '}
						<strong>{moveModal.draggedEl?.product}</strong>{' '}
						a <strong>{moveModal.destination?.name}</strong>{' '}
						es porque ésta ya está completa
					</p>
					<label className={styles.modalDescription}>
						Quieres dejar un comentario?
					</label>
					<textarea
						className={styles.modalTextarea}
						value={moveModal.comment}
						onChange={(e) =>
							setMoveModal((prev) => ({
								...prev,
								comment: e.target.value,
							}))
						}
					/>
					<div className={styles.modalButtons}>
						<Button
							variant="contained"
							color="success"
							onClick={() => {
								setMoveModal((prev) => ({
									...prev,
									bill: false,
								}));
								handleMove();
								completeOrder(moveModal.draggedEl._id);
							}}
						>
							Aceptar
						</Button>
						<Button
							variant="contained"
							color="error"
							onClick={() => {
								cancelMove();
								setMoveModal((prev) => ({
									...prev,
									bill: false,
								}));
							}}
						>
							Cancelar
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				isOpen={moveModal.delivery}
				onClose={cancelMove}
				title={'Ingrese Nº de factura'}
			>
				<div className={styles.modal}>
					<p className={styles.modalTitle}>
						Necesita ingresar numero de factura para
						continuar
					</p>
					<input
						className={styles.modalInput}
						name="billNumber"
						onChange={(e) =>
							setMoveModal((prev) => ({
								...prev,
								billNumber: e.target.value,
							}))
						}
					/>
					<div className={styles.modalButtons}>
						<Button
							variant="contained"
							color="success"
							onClick={() => {
								setMoveModal((prev) => ({
									...prev,
									delivery: false,
								}));
								handleMove();
								billOrder(
									moveModal.draggedEl._id,
									moveModal.billNumber
								);
							}}
							disabled={!moveModal.billNumber}
							sx={{
								'&.Mui-disabled': {
									backgroundColor: 'lightgray',
									color: 'gray',
									cursor: 'not-allowed',
								},
							}}
						>
							Aceptar
						</Button>
						<Button
							variant="contained"
							color="error"
							onClick={() => {
								cancelMove();
								setMoveModal((prev) => ({
									...prev,
									delivery: false,
								}));
							}}
						>
							Cancelar
						</Button>
					</div>
				</div>
			</Modal>
			<div className={styles.paperGrid}>
				{stations.map((station) => (
					<Container
						stations={stations}
						workStation={station}
						key={station._id}
						orders={activeOrders}
						moveModal={moveModal}
						setMoveModal={setMoveModal}
						selectActiveOrders={selectActiveOrders}
						setOpenNextTasksModal={setOpenNextTasksModal}
						setOpenOrderModal={setOpenOrderModal}
						taskManagerRef={taskManagerRef}
					/>
				))}
			</div>
		</div>
	);
}

function Container({
	stations,
	workStation,
	orders,
	moveModal,
	setMoveModal,
	selectActiveOrders,
	setOpenNextTasksModal,
	setOpenOrderModal,
	taskManagerRef,
}) {
	const dispatch = useDispatch();
	const {
		ref,
		tasks,
		anchorEl,
		setAnchorEl,
		handleOpenMenu,
		handleSelectOption,
	} = useContainer(
		stations,
		workStation,
		orders,
		moveModal,
		setMoveModal,
		selectActiveOrders,
		setOpenNextTasksModal,
		taskManagerRef
	);
	/* 	useEffect(() => {
		console.log('tasks', tasks);
	}, [tasks]); */

	return (
		<div className={styles.container} ref={ref}>
			<h2 id="no-drag">{workStation.name}</h2>
			{tasks?.map((task) => {
				const levelClass =
					styles[
						`warningLevel${warningLevel(task)}` ||
							styles.warningLevel0
					];

				return (
					<div
						className={clsx(styles.task, levelClass)}
						key={task?._id}
						onClick={() => {
							setOpenOrderModal({
								open: true,
								order: task,
							});
							dispatch(fetchOrderById(task._id));
						}}
					>
						<h3>{task?.product}</h3>
						<p style={{ fontSize: '12px' }}>
							Orden Nº
							{task?.orderNumber}
						</p>
						<div className={styles.content}>
							{task?.client.companyName}
						</div>
						<div className={styles.taskDate}>
							Fecha limite:{' '}
							{task?.dateFinal
								? toFormatDate(task?.dateFinal)
								: task?.dateEstimate
								? toFormatDate(task?.dateEstimate)
								: ''}
						</div>
						{task.status === 'Detenida' ? (
							<div className={styles.stopedTask}>
								DETENIDA
							</div>
						) : (
							''
						)}
					</div>
				);
			})}
			<IconButton
				id="no-drag"
				sx={{
					position: 'absolute',
					top: 5,
					right: 5,
					color: '#9fadbc',
				}}
				onClick={handleOpenMenu}
			>
				<MoreVertIcon id="no-drag" />
			</IconButton>
			<Menu
				id="no-drag"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(false)}
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
				<MenuItem id="no-drag" onClick={handleSelectOption}>
					Proximas tareas
				</MenuItem>
			</Menu>
		</div>
	);
}

export default NewManager;
