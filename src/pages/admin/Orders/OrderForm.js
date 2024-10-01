import React, { useState } from 'react';
import {
	Input,
	TextArea,
} from '../../../components/shared/Inputs';

function OrderForm() {
	/* 	const [newTasks, setNewTasks] = useState([]);

	const arrayOfObjects = Array.from({ length: number }, (_, index) => ({
		id: index + 1,
		value: `Objeto ${index + 1}`,
	  })); */

	return (
		<div>
			<h2>Nueva Orden</h2>
			<form>
				<div>
					<Input>Nombre: </Input>
					<Input>Producto: </Input>
					<div>Información del cliente: </div>
					<Input>Nombre de la empresa: </Input>
					<Input>Nombre del contacto: </Input>
					<Input>Teléfono:</Input>
					<Input>Email: </Input>
					<Input>Datos de entrega:</Input>
				</div>
				<div>
					<TextArea>Solicitud: </TextArea>
					<Input placeholder={'Adjuntar archivo'}>
						Esquema:{' '}
					</Input>
					<Input>Número de tareas: </Input>
				</div>
			</form>
		</div>
	);
}

export default OrderForm;
