import React, { useEffect, useState } from 'react';
import styles from './operations.module.css';
import { Input } from '../../shared/Inputs';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { CheckBox } from '@mui/icons-material';
import {
	Button,
	Checkbox,
	IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { changeValue } from '../../../utilities/functions/forms/fields';
import { fetchStationById } from '../../../redux/workStations/workStationSlice';
import { useDispatch } from 'react-redux';
import { createNewOperation } from '../../../utilities/functions/resources/createNewOperation';

function OperationsForm({
	selectStyles,
	setOpenOperationModal,
	fields,
	setFields,
}) {
	const dispatch = useDispatch();
	const [isEdit, setIsEdit] = useState(false);
	const [stationsOptions, setStationsOptions] = useState(
		[]
	);
	const [progressiveCheck, setProgressiveCheck] =
		useState(false);

	console.log('fields', fields);

	const { stations, station } = useSelector(
		(state) => state.workStations
	);

	useEffect(() => {
		if (fields.pricingRules.length > 0) {
			setFields((prev) => ({
				...prev,
				progressivePrice: true,
			}));
			setProgressiveCheck(true);
		}
	}, []);

	useEffect(() => {
		dispatch(
			fetchStationById(
				fields.workStation._id ?? fields.workStation
			)
		);
	}, [fields.workStation]);

	useEffect(() => {
		setFields((prev) => ({
			...prev,
			isPrintable: station.isPrintable,
		}));
	}, [station]);

	const unitTypeOptions = [
		{ key: 1, label: 'Horas', value: 'Horas' },
		{ key: 2, label: 'Clicks', value: 'Clicks' },
		{
			key: 3,
			label: 'Metro cuadrado',
			value: 'Metro cuadrado',
		},
		{ key: 4, label: 'Tiraje', value: 'Tiraje' },
		{ key: 5, label: 'Unitario', value: 'Unitario' },
	];

	useEffect(() => {
		const newOptions = stations.map((station) => ({
			key: station._id,
			label: station.name,
			value: station._id,
		}));
		setStationsOptions(newOptions);
	}, [stations]);

	const handleCheckBox = (e) => {
		const { name, checked } = e.target;
		setFields((prev) => {
			return {
				...prev,
				[name]: checked,
			};
		});
		if (name === 'progressivePrice') {
			setProgressiveCheck(checked);
		}
	};

	useEffect(() => {
		console.log(fields);
	}, [fields]);

	const handleRangeChange = (e, index) => {
		const updatedRanges = [...fields.pricingRules];
		updatedRanges[index] = {
			...updatedRanges[index],
			[e.target.name]: e.target.value,
		};

		setFields((prev) => ({
			...prev,
			pricingRules: updatedRanges,
		}));
	};

	const handleNewRange = () => {
		const newRanges = [...fields.pricingRules, {}];

		setFields((prev) => ({
			...prev,
			pricingRules: newRanges,
		}));
	};

	const deleteRangeRow = (i) => {
		const newRanges = fields.pricingRules.filter(
			(range, index) => i !== index
		);
		setFields((prev) => ({
			...prev,
			pricingRules: newRanges,
		}));
	};

	const setSelect = (option, e) => {
		const { name } = e;
		setFields((prev) => ({
			...prev,
			[name]: option.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			createNewOperation(fields);
			setOpenOperationModal(false);
		} catch (error) {
			console.log(error);
		}
	};

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
											fields.workStation._id ||
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
							value={fields.plateCost ?? ''}
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
						value={fields.unitCost ?? ''}
						className={styles.input}
						onChange={(e) => changeValue(e, setFields)}
					/>
				</div>

				<div className={styles.labelInput}>
					<label>Precio progresivo?</label>
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
					Crear
				</Button>
			</form>
		</div>
	);
}

export default OperationsForm;
