import React, { useState } from 'react';
import { Input, TextArea } from '../shared/Inputs';
import styles from './orders.module.css';
import { useSelector } from 'react-redux';
import Dropdown from '../shared/Dropdown';

function Form() {
	const { ordersCount } = useSelector(
		(state) => state.orders
	);
	const [taskCount, setTaskCount] = useState(1);

	return (
		<div className={styles.orderForm}>
			<h2>Nueva Orden N {ordersCount + 1}</h2>
			<form className={styles.form}>
				<div
					className={`${styles.block} ${styles.orderInfo}`}
				>
					<h3 className={styles.blockTitle}>
						Información de la MOP
					</h3>
					<Input orientation="vertical" size="big">
						Nombre:{' '}
					</Input>
					<Input orientation="vertical" size="big">
						Producto:{' '}
					</Input>
					<Input orientation="vertical" size="big">
						Cliente:{' '}
					</Input>
					<Input
						orientation="vertical"
						size="big"
						type={'number'}
						value={taskCount}
						min={'1'}
						onChange={(e) => setTaskCount(e.target.value)}
					>
						Número de tareas:{' '}
					</Input>
				</div>
				<div
					className={`${styles.block} ${styles.clientInfo}`}
				>
					<h3 className={styles.blockTitle}>
						Información del cliente:
					</h3>{' '}
					<Dropdown></Dropdown>
					<Input orientation="vertical" size="big">
						Contacto:{' '}
					</Input>
					<Input orientation="vertical" size="big">
						Teléfono:
					</Input>
					<Input orientation="vertical" size="big">
						Email:{' '}
					</Input>
					<Input orientation="vertical" size="big">
						Datos de entrega:
					</Input>
				</div>
				<div className={styles.block}>
					<TextArea orientation="vertical" width="300px">
						Solicitud:{' '}
					</TextArea>
					<Input
						orientation="vertical"
						placeholder={'Adjuntar archivo'}
					>
						Esquema:{' '}
					</Input>
				</div>
				{Array.from({ length: taskCount }, (_, index) => (
					<div key={index}>
						<h4>Tarea {index + 1}</h4>
						<Input>Nombre: </Input>
					</div>
				))}
			</form>
		</div>
	);
}

export default Form;
