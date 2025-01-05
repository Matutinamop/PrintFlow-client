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

function OperationsForm({ selectStyles }) {
	const [isEdit, setIsEdit] = useState(false);
	const [stationsOptions, setStationsOptions] = useState(
		[]
	);
	const [priceRanges, setPriceRanges] = useState([{}]);
	const [progressivePrice, setProgressivePrice] =
		useState(false);

	const { stations } = useSelector(
		(state) => state.workStations
	);

	const unitTypeOptions = [
		{ key: 1, label: 'Horas', value: 'Horas' },
		{ key: 2, label: 'Clicks', value: 'Clicks' },
		{
			key: 3,
			label: 'Metro cuadrado',
			value: 'Metro cuadrado',
		},
		{ key: 4, label: 'Tiraje', value: 'Tiraje' },
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
		setProgressivePrice(e.target.checked);
	};

	const handleRangeChange = (e, index) => {
		const updatedRanges = [...priceRanges];
		updatedRanges[index] = {
			...updatedRanges[index],
			[e.target.name]: e.target.value,
		};

		setPriceRanges(updatedRanges);
	};

	const handleNewRange = () => {
		setPriceRanges((prev) => [...prev, {}]);
	};

	const deleteRangeRow = (i) => {
		const newRanges = priceRanges.filter(
			(range, index) => i !== index
		);
		setPriceRanges(newRanges);
	};

	/* 	useEffect(() => {
		console.log(priceRanges);
	}, [priceRanges]); */

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
					<input className={styles.input} />
				</div>
				<div className={styles.labelInput}>
					<label>Estación</label>
					<div className={styles.input}>
						<Select
							styles={selectStyles}
							options={stationsOptions}
						/>
					</div>
				</div>
				<div className={styles.labelInput}>
					<label>Tipo de unidad</label>
					<div className={styles.input}>
						<Select
							styles={selectStyles}
							options={unitTypeOptions}
						/>
					</div>
				</div>
				<div className={styles.labelInput}>
					<label>Precio por unidad:</label>
					<input className={styles.input} />
				</div>
				<div className={styles.labelInput}>
					<label>Precio progresivo</label>
					<div className={styles.input}>
						<Checkbox onChange={handleCheckBox} />
					</div>
				</div>
				{progressivePrice ? (
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
							{priceRanges.map((range, index) => (
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
											name="price"
											className={styles.priceInput}
											value={range?.price}
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
						<Checkbox onChange={handleCheckBox} />
					</div>
				</div>
			</form>
		</div>
	);
}

export default OperationsForm;
