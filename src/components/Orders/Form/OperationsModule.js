import React, { useEffect, useState } from 'react';
import styles from './form.module.css';
import { useSelector, useDispatch } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { fetchOperations } from '../../../redux/operations/operationsSlice';

function OperationsModule({
	selectStyles,
	changeValue,
	setFields,
}) {
	const dispatch = useDispatch();
	const [operationsList, setOperationsList] = useState([]);
	const { operation, operations } = useSelector(
		(state) => state.operations
	);

	const operationOptions = operations?.map((operation) => ({
		key: operation._id,
		value: operation._id,
		label: operation.name,
	}));

	const deleteRow = (id) => {
		const newList = operationsList.filter(
			(op) => op._id !== id
		);
		setOperationsList(newList);
	};

	useEffect(() => {
		dispatch(fetchOperations());
	}, []);

	useEffect(() => {
		const startingList = operations?.filter(
			(operation) => operation.allTask === true
		);

		setOperationsList((prev) => {
			const newList = startingList.filter(
				(item) =>
					!prev.some(
						(existingItem) => existingItem._id === item._id
					)
			);
			return [...prev, ...newList];
		});
	}, []);

	return (
		<div className={styles.block}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th className={styles.th}>Operación</th>
						<th className={styles.smallth}>Descripción</th>
						<th className={styles.smallth}>Tiempo (hs)</th>
						<th className={styles.smallth}>
							Clicks, tiraje o m<sup>2</sup>
						</th>
						<th className={styles.smallth}>Costo</th>
					</tr>
				</thead>
				<tbody>
					{operationsList?.map((operation) => (
						<tr className={styles.tr} key={operation._id}>
							<td
								className={`${styles.td} ${styles.nameTd}`}
							>
								{operation.name}{' '}
								<button
									className={styles.deleteRow}
									onClick={(e) => deleteRow(operation._id)}
								>
									x
								</button>
							</td>
							<td>
								<input
									className={styles.input}
									name="description"
								/>
							</td>
							<td>
								<input
									className={styles.smallInput}
									name="time"
								/>
							</td>
							<td>
								<input
									className={styles.smallInput}
									name="quantity"
								/>
							</td>
							<td>
								<input
									className={styles.smallInput}
									name="cost"
								/>
							</td>
						</tr>
					))}
					<tr>
						<td>
							<CreatableSelect
								styles={selectStyles}
								onChange={(option) => {
									setOperationsList((prev) => [
										...prev,
										operations.find(
											(op) => op._id === option.value
										),
									]);
								}}
								options={operationOptions}
								placeholder={'Nueva Operación'}
								value={''}
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default OperationsModule;
