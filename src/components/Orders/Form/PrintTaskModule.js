import React, { useEffect, useState } from 'react';
import styles from './form.module.css';
import {
	Input,
	SearchableInput,
} from '../../shared/Inputs';
import CreatableSelect from 'react-select/creatable';
import calculateItemInArea from '../../../utilities/functions/calculateItemInArea';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchMaterialById } from '../../../redux/materials/materialsSlice';

function PrintTaskModule({ selectStyles }) {
	const dispatch = useDispatch();
	const [fields, setFields] = useState({
		/* bulkPaperSize: '0x0',
    finalSize: '0x0',
    sheetSize: '0x0', */
	});

	const { materials, material } = useSelector(
		(state) => state.materials
	);

	const materialOptions = materials?.map((material) => ({
		key: material._id,
		value: material.name,
		label: material.name,
	}));

	const grammageOptions = material?.grammage?.map(
		(grammage, index) => ({
			key: index,
			value: grammage,
			label: grammage,
		})
	);

	const sizeMaterialOptions = material?.sizes?.map(
		(size, index) => ({
			key: index,
			value: size,
			label: size,
		})
	);

	const genericOptions = [
		{
			value: 'Uno',
			label: 'Uno',
		},
		{
			value: 'Dos',
			label: 'Dos',
		},
		{
			value: 'Tres',
			label: 'Tres',
		},
	];

	const changeValue = (e) => {
		setFields((prevFields) => ({
			...prevFields,
			[e.target.name]: e.target.value,
		}));
	};

	useEffect(() => {
		if (fields.bulkPaperSize && fields.sheetSize) {
			setFields((prev) => ({
				...prev,
				['sheetPerBulkPaper']: calculateItemInArea(
					fields.bulkPaperSize,
					fields.sheetSize
				),
			}));
		}
		if (fields.sheetSize && fields.sizeWithMargins) {
			setFields((prev) => ({
				...prev,
				['unitsPerSheet']: calculateItemInArea(
					fields.sheetSize,
					fields.sizeWithMargins
				),
			}));
		}
		if (fields.quantity && fields.unitsPerSheet) {
			setFields((prev) => ({
				...prev,
				['sheetQuantity']: Math.ceil(
					fields.quantity / fields.unitsPerSheet
				),
			}));
		}
	}, [
		fields.bulkPaperSize,
		fields.sheetSize,
		fields.sizeWithMargins,
		fields.quantity,
		fields.unitsPerSheet,
	]);

	useEffect(() => {
		console.log(fields);
	}, [fields]);

	/* 	const matchMaterial = (option) => {
		setFields((prevFields) => ({
			...prevFields,
			['material']: option,
		}));
	};

	const matchGrammage = (option) => {
		setFields((prevFields) => ({
			...prevFields,
			['grammage']: option,
		}));
	}; */

	return (
		<div>
			<div className={styles.block}>
				<Input
					name="quantity"
					onChange={(e) => changeValue(e)}
					value={fields.quantity}
					size="adjusted"
				>
					Unidades:{' '}
				</Input>
				<Input
					name="finalSize"
					onChange={(e) => changeValue(e)}
					value={fields.finalSize}
					size="adjusted"
				>
					Medida Final{' '}
				</Input>
				<Input
					name="sizeWithMargins"
					onChange={(e) => changeValue(e)}
					value={fields.sizeWithMargins}
					size="adjusted"
				>
					Medida con márgenes
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
							dispatch(fetchMaterialById(option.key));
						}}
						options={materialOptions}
						placeholder={''}
					/>
				</div>
				<div className={styles.selectContainer}>
					<label className={styles.label}>Gramaje:</label>
					<CreatableSelect
						styles={selectStyles}
						name="grammage"
						onChange={(option) => {
							setFields((prev) => ({
								...prev,
								['grammage']: option.value,
							}));
						}}
						options={grammageOptions}
						placeholder={''}
					/>
				</div>
				<div className={styles.selectContainer}>
					<label className={styles.label}>Tam. hoja:</label>
					<CreatableSelect
						styles={selectStyles}
						name="bulkPaperSize"
						onChange={(option) => {
							setFields((prev) => ({
								...prev,
								['bulkPaperSize']: option.value,
							}));
						}}
						options={sizeMaterialOptions}
						placeholder={''}
					/>
				</div>
				<div className={styles.selectContainer}>
					<label className={styles.label}>
						Tam. pliego:
					</label>
					<CreatableSelect
						styles={selectStyles}
						name="sheetSize"
						onChange={(option) => {
							setFields((prev) => ({
								...prev,
								['sheetSize']: option.value,
							}));
						}}
						options={genericOptions}
						placeholder={''}
					/>
				</div>
				<Input
					name="sheetPerBulkPaper"
					onChange={(e) => changeValue(e)}
					value={fields.sheetPerBulkPaper}
					size="adjusted"
				>
					Pli. x Hoja:
				</Input>
				<Input
					name="unitsPerSheet"
					onChange={(e) => changeValue(e)}
					value={fields.unitsPerSheet}
					size="adjusted"
				>
					Unid. x Pli.:
				</Input>
				<Input
					name="sheetQuantity"
					size="adjusted"
					onChange={(e) => changeValue(e)}
					value={fields.sheetQuantity}
				>
					Cant. Pli.:
				</Input>
				<Input
					name="excess"
					onChange={(e) => changeValue(e)}
					value={fields.excess}
					size="adjusted"
				>
					Demasía:
				</Input>
				<Input
					name="costPerBulkPaper"
					onChange={(e) => changeValue(e)}
					value={fields.costPerBulkPaper}
					size="adjusted"
				>
					Costo x hoja:
				</Input>
				<Input
					name="bulkPaperQuantity"
					onChange={(e) => changeValue(e)}
					value={fields.bulkPaperQuantity}
					size="adjusted"
					isDisabled
				>
					Hojas:
				</Input>
				<Input
					name="paperCost"
					onChange={(e) => changeValue(e)}
					value={fields.paperCost}
					size="adjusted"
					isDisabled
				>
					Costo Papel:
				</Input>
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						gap: '15px',
					}}
				>
					<p
						style={{
							alignSelf: 'end',
							width: '190px',
						}}
					>
						Tintas
					</p>
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
							options={genericOptions}
							placeholder={''}
						/>
					</div>
					<Input
						name="plates"
						onChange={(e) => changeValue(e)}
						value={fields.plates}
						size="adjusted"
					>
						Chapas:
					</Input>
					<Input
						name="plateCost"
						onChange={(e) => changeValue(e)}
						value={fields.plateCost}
						size="adjusted"
						isDisabled
					>
						Costo Chapa:
					</Input>
				</div>
				<Input
					name="front"
					onChange={(e) => changeValue(e)}
					value={fields.front}
					size="adjusted"
				>
					Frente:
				</Input>
				<Input
					name="back"
					onChange={(e) => changeValue(e)}
					value={fields.back}
					size="adjusted"
				>
					Dorso:
				</Input>
				<Input
					name="postures"
					onChange={(e) => changeValue(e)}
					value={fields.postures}
					size="adjusted"
				>
					Posturas:
				</Input>
				<Input
					name="printRun"
					onChange={(e) => changeValue(e)}
					value={fields.printRun}
					size="adjusted"
				>
					Tiraje:
				</Input>
				<Input
					name="postureCost"
					onChange={(e) => changeValue(e)}
					value={fields.postureCost}
					size="adjusted"
				>
					Costo Postura:
				</Input>
				<Input
					name="inkCost"
					onChange={(e) => changeValue(e)}
					value={fields.inkCost}
					size="adjusted"
					isDisabled
				>
					Costo Tinta:
				</Input>
				<Input
					name="sheetDescription"
					onChange={(e) => changeValue(e)}
					value={fields.sheetDescription}
					size="normal"
				>
					Descripción del pliego:
				</Input>
				<Input
					name="sheetRepeat"
					onChange={(e) => changeValue(e)}
					value={fields.sheetRepeat}
					size="normal"
				>
					Repetir costo del pliego:
				</Input>
				<Input
					name="totalCost"
					onChange={(e) => changeValue(e)}
					value={fields.totalCost}
					size="adjusted"
					isDisabled
				>
					Costo Total:
				</Input>
			</div>
		</div>
	);
}

export default PrintTaskModule;
