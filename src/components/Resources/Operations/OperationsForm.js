import styles from './operations.module.css';
import Select from 'react-select';
import {
	Button,
	Checkbox,
	IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { changeValue } from '../../../utilities/functions/forms/fields';
import { useOperationsForm } from '../../../utilities/customHooks/forms/operationsForm';

function OperationsForm({
	isEdit,
	selectStyles,
	setOpenOperationModal,
	fields,
	setFields,
}) {
	const {
		stationsOptions,
		progressiveCheck,
		unitTypeOptions,
		handleCheckBox,
		handleRangeChange,
		handleNewRange,
		deleteRangeRow,
		setSelect,
		handleSubmit,
	} = useOperationsForm(
		fields,
		setFields,
		isEdit,
		setOpenOperationModal
	);

	return (
		<div className={styles.formContainer}>
			{isEdit ? (
				<h2>Editar Operación</h2>
			) : (
				<h2>Nueva Operación</h2>
			)}
			<form>
				<div className={styles.labelInput}>
					<label>Nombre:</label>
					<input
						name="name"
						value={fields.name ?? ''}
						className={styles.input}
						onChange={(e) => changeValue(e, setFields)}
					/>
				</div>
				<div className={styles.labelInput}>
					<label>Estación</label>
					<div className={styles.input}>
						<Select
							name="workStation"
							value={
								stationsOptions.find(
									(station) =>
										station.value ===
											fields.workStation?._id ||
										station.value === fields.workStation
								) ?? ''
							}
							styles={selectStyles}
							options={stationsOptions}
							onChange={(option, e) => setSelect(option, e)}
						/>
					</div>
				</div>
				{fields.isPrintable ? (
					<div className={styles.labelInput}>
						<label>Precio chapa:</label>
						<input
							name="plateCost"
							value={fields.plateCost ?? 0}
							className={styles.input}
							onChange={(e) => changeValue(e, setFields)}
						/>
					</div>
				) : (
					''
				)}
				<div className={styles.labelInput}>
					<label>Tipo de unidad</label>
					<div className={styles.input}>
						<Select
							name="unitType"
							value={
								unitTypeOptions.find(
									(unit) => unit.value === fields.unitType
								) ?? ''
							}
							styles={selectStyles}
							options={unitTypeOptions}
							onChange={(option, e) => setSelect(option, e)}
						/>
					</div>
				</div>
				<div className={styles.labelInput}>
					<label>Precio por unidad:</label>
					<input
						name="unitCost"
						value={fields.unitCost ?? 0}
						className={styles.input}
						onChange={(e) => changeValue(e, setFields)}
					/>
				</div>
				<div className={styles.labelInput}>
					<label>Precio mínimo:</label>
					<input
						name="minPrice"
						value={fields.minPrice ?? 0}
						className={styles.input}
						onChange={(e) => changeValue(e, setFields)}
					/>
				</div>
				<div className={styles.labelInput}>
					<label>Precio por rangos?</label>
					<div className={styles.input}>
						<Checkbox
							checked={progressiveCheck}
							name="progressivePrice"
							onChange={handleCheckBox}
						/>
					</div>
				</div>
				{fields.progressivePrice ? (
					<table>
						<thead>
							<tr>
								<th>Desde</th>
								<th>Hasta</th>
								<th>Cantidad</th>
								<th>Precio por cantidad</th>
							</tr>
						</thead>
						<tbody>
							{fields.pricingRules.map((range, index) => (
								<tr key={index}>
									<td>
										<input
											name="rangeStart"
											className={styles.priceInput}
											value={range?.rangeStart}
											onChange={(e) =>
												handleRangeChange(e, index)
											}
										/>
									</td>
									<td>
										<input
											name="rangeEnd"
											className={styles.priceInput}
											value={range?.rangeEnd}
											onChange={(e) =>
												handleRangeChange(e, index)
											}
										/>
									</td>
									<td>
										<input
											name="step"
											className={styles.priceInput}
											value={range?.step}
											onChange={(e) =>
												handleRangeChange(e, index)
											}
										/>
									</td>
									<td>
										<input
											name="price"
											className={styles.priceInput}
											value={range?.price}
											onChange={(e) =>
												handleRangeChange(e, index)
											}
										/>
									</td>
									<td>
										<IconButton
											color="error"
											onClick={() => deleteRangeRow(index)}
											sx={{
												height: '20px',
												width: '20px',
											}}
										>
											<CloseIcon />
										</IconButton>
									</td>
								</tr>
							))}
							<tr>
								<td className={styles.tdButton}>
									<Button
										variant="contained"
										sx={{ fontSize: '10px' }}
										onClick={handleNewRange}
									>
										nuevo rango
									</Button>
								</td>
							</tr>
						</tbody>
					</table>
				) : (
					''
				)}
				<div className={styles.labelInput}>
					<label>Obligatorio?</label>
					<div className={styles.input}>
						<Checkbox
							value={fields.isAllTask ?? false}
							name="isAllTask"
							onChange={handleCheckBox}
						/>
					</div>
				</div>

				<Button variant="contained" onClick={handleSubmit}>
					Guardar
				</Button>
			</form>
		</div>
	);
}

export default OperationsForm;
