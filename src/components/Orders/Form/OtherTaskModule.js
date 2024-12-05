import React, { useEffect, useState } from 'react';
import styles from './form.module.css';
import { Input } from '../../shared/Inputs';
import CreatableSelect from 'react-select/creatable';
import { useSelector } from 'react-redux';
import { changeValue } from '../../../utilities/functions/forms/fields';
import { useDispatch } from 'react-redux';
import { fetchMaterialById } from '../../../redux/materials/materialsSlice';

function OtherTaskModule({ selectStyles }) {
	const [fields, setFields] = useState({});

	const { materials, material } = useSelector(
		(state) => state.materials
	);

	const { stations, station } = useSelector(
		(state) => state.workStations
	);

	const materialOptions = materials?.map((material) => ({
		key: material._id,
		value: material._id,
		label: material.name,
	}));

	const stationOptions = stations
		?.filter((station) => station.type !== 'Impresión')
		.map((station, index) => ({
			key: index,
			value: station._id,
			label: station.name,
		}));

	/* 	useCalculateFields(fields, setFields, material);
	 */
	useEffect(() => {
		console.log(fields);
	}, [fields]);

	return (
		<div>
			<div className={styles.block}>
				<Input
					name="taskType"
					onChange={(e) => changeValue(e, setFields)}
					value={fields.taskType || ''}
				>
					Tipo de tarea:{' '}
				</Input>
				<div className={styles.selectMaterialContainer}>
					<label className={styles.label}>Material:</label>
					<CreatableSelect
						styles={selectStyles}
						name="material"
						onChange={(option) => {
							setFields((prev) => ({
								...prev,
								['material']: option.value,
							}));
						}}
						options={materialOptions}
						placeholder={''}
					/>
				</div>
				<div className={styles.selectContainer}>
					<label className={styles.label}>Maquina:</label>
					<CreatableSelect
						styles={selectStyles}
						name="station"
						onChange={(option) => {
							setFields((prev) => ({
								...prev,
								['station']: option.value,
							}));
						}}
						options={stationOptions}
						placeholder={''}
					/>
				</div>
				<div className={styles.inputContainer}>
					<label>Descripción:</label>
					<textarea
						name="descriptionTask"
						className={styles.textArea}
						onChange={(e) => changeValue(e, setFields)}
					/>
				</div>
			</div>
		</div>
	);
}

export default OtherTaskModule;
