import styles from './tasks.module.css';

function NextTasks({
	activeOrders,
	setOpenModal,
	setOpenOrder,
}) {
	const handleOpenOrder = (order) => {
		setOpenOrder({ open: true, order: order });
		setOpenModal(false);
	};

	return (
		<div className={styles.container}>
			<h3>Próximas Tareas ({activeOrders.station.name})</h3>
			{activeOrders.orders.map((order) => (
				<div
					className={styles.nextTasks}
					key={order._id}
					onClick={() => handleOpenOrder(order)}
				>
					<h4>{order?.product}</h4>
					<div className={styles.content}>
						{order?.client.companyName}
					</div>
				</div>
			))}
		</div>
	);
}

export default NextTasks;
