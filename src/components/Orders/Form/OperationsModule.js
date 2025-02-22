import styles from './form.module.css';
import CreatableSelect from 'react-select/creatable';
import { costCalculator } from '../../../utilities/functions/costCalculator';
import { useOperationsModule } from '../../../utilities/customHooks/forms/operationsModule';
import {
	operationStyle,
	selectStyles,
} from '../../../utilities/selectStyles/selectStyles';
import { useEffect } from 'react';

function OperationsModule({ fields, setFields }) {
	const {
		operationsList,
		manualChange,
		operationOptions,
		handleNewRow,
		deleteRow,
		changeValue,
		handleDirtyField,
	} = useOperationsModule(fields, setFields);

	return (
		<div
			className={`${styles.block} ${styles.blockPrintTask}`}
		>
			<table className={styles.table}>
				<thead>
					<tr>
						<th className={styles.th}>Operación</th>
						<th className={styles.smallth}>Descripción</th>
						<th className={styles.smallth}>Unidad</th>
						<th className={styles.smallth}>Cantidad</th>
						<th className={styles.smallth}>Costo</th>
					</tr>
				</thead>
				<tbody>
					{operationsList?.map((op, index) => (
						<tr className={styles.tr} key={index}>
							<td
								className={`${styles.td} ${styles.nameTd}`}
							>
								{op.operation?.name}{' '}
								<button
									className={styles.deleteRow}
									onClick={(e) => deleteRow(index)}
								>
									x
								</button>
							</td>
							<td>
								<input
									className={styles.input}
									name="description"
									value={
										operationsList[index]?.description ?? ''
									}
									onChange={(e) => {
										changeValue(e, index);
									}}
								/>
							</td>
							<td>
								<input
									className={styles.smallInput}
									name="unitType"
									value={op.operation?.unitType ?? ''}
									disabled
								/>
							</td>
							<td>
								<input
									className={styles.smallInput}
									name="quantity"
									value={op?.quantity ?? ''}
									onChange={(e) => {
										changeValue(e, index);
									}}
								/>
							</td>
							<td>
								<input
									className={styles.smallInput}
									name="cost"
									value={`$ ${
										manualChange[index]
											? op.cost
											: op.estimatedCost
									}`}
									onChange={(e) => {
										handleDirtyField(index);
										changeValue(e, index);
									}}
									disabled
								/>
							</td>
						</tr>
					))}
					<tr>
						<td>
							<CreatableSelect
								styles={operationStyle}
								onChange={(option) => handleNewRow(option)}
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
