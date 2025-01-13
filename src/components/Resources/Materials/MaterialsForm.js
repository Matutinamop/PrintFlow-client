import React, { useEffect, useState } from 'react';
import styles from './materials.module.css';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import {
	creatableMultiStyles,
	selectStyles,
} from '../../../utilities/selectStyles/selectStyles';
import { changeValue } from '../../../utilities/functions/forms/fields';
import { Button } from '@mui/material';

function MaterialsForm({
	isEdit,
	setOpenMaterialModal,
	fields,
	setFields,
}) {
	const [sizesOptions, setSizesOptions] = useState([
		{ key: 1, label: '70x100', value: '70x100' },
	]);
	const [grammagesOptions, setGrammageOptions] = useState([
		{
			key: 1,
			label: '50',
			value: '50',
		},
		{
			key: 2,
			label: '60',
			value: '60',
		},
		{
			key: 3,
			label: '70',
			value: '70',
		},
		{
			key: 4,
			label: '75',
			value: '75',
		},
		{
			key: 5,
			label: '80',
			value: '80',
		},
		{
			key: 6,
			label: '90',
			value: '90',
		},
		{
			key: 7,
			label: '100',
			value: '100',
		},
		{
			key: 8,
			label: '115',
			value: '115',
		},
		{
			key: 9,
			label: '120',
			value: '120',
		},
		{
			key: 10,
			label: '130',
			value: '130',
		},
		{
			key: 11,
			label: '140',
			value: '140',
		},
		{
			key: 12,
			label: '150',
			value: '150',
		},
		{
			key: 13,
			label: '170',
			value: '170',
		},
		{
			key: 14,
			label: '180',
			value: '180',
		},
		{
			key: 15,
			label: '200',
			value: '200',
		},
		{
			key: 16,
			label: '210',
			value: '210',
		},
		{
			key: 17,
			label: '250',
			value: '250',
		},
		{
			key: 18,
			label: '270',
			value: '270',
		},
		{
			key: 19,
			label: '295',
			value: '295',
		},
		{
			key: 20,
			label: '300',
			value: '300',
		},
		{
			key: 21,
			label: '325',
			value: '325',
		},
		{
			key: 22,
			label: '350',
			value: '350',
		},
	]);

	const unitTypeOptions = [
		{ key: 1, label: 'Tonelada', value: 'Tonelada' },
		{ key: 2, label: 'Unidad', value: 'Unidad' },
		{
			key: 3,
			label: 'Metro cuadrado',
			value: 'Metro cuadrado',
		},
	];
	/* 
    useEffect(() => {

    },[]) */

	const setSelect = (option, e) => {
		const { name } = e;
		setFields((prev) => ({
			...prev,
			[name]: option.value,
		}));
	};

	const setSelectMulti = (option, e) => {
		const { name } = e;
		setFields((prev) => ({
			...prev,
			[name]: option.map((size) => size.value),
		}));
	};

	const handleNewOption = (input, name) => {
		const newOption = { value: input, label: input };
		if (name === 'sizes') {
			setSizesOptions((prev) => [...prev, newOption]);
			const newOptions = [...fields.sizes, newOption.value];

			setFields((prev) => ({
				...prev,
				sizes: newOptions,
			}));
		}
		if (name === 'grammages') {
			setGrammageOptions((prev) => [...prev, newOption]);
			const newOptions = [
				...fields.grammages,
				newOption.value,
			];
			setFields((prev) => ({
				...prev,
				grammages: newOptions,
			}));
		}
	};

	return (
		<div className={styles.formContainer}>
			{isEdit ? (
				<h2>Editar Material</h2>
			) : (
				<h2>Nueva Material</h2>
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
					<label>Tamaños</label>
					<div className={styles.input}>
						<CreatableSelect
							name="sizes"
							value={
								sizesOptions.filter(
									(size) => (
										console.log(fields),
										fields?.sizes.some(
											(item) => size.value === item
										)
									)
								) ?? ''
							}
							onCreateOption={(e) =>
								handleNewOption(e, 'sizes')
							}
							styles={creatableMultiStyles}
							isMulti
							options={sizesOptions}
							onChange={(option, e) =>
								setSelectMulti(option, e)
							}
						/>
					</div>
				</div>
				<div className={styles.labelInput}>
					<label>Gramaje</label>
					<div className={styles.input}>
						<CreatableSelect
							name="grammages"
							value={
								grammagesOptions.filter(
									(grammage) => (
										console.log(fields),
										fields?.grammages.some(
											(item) => grammage.value === item
										)
									)
								) ?? ''
							}
							onCreateOption={(e) =>
								handleNewOption(e, 'grammages')
							}
							styles={creatableMultiStyles}
							isMulti
							options={grammagesOptions}
							onChange={(option, e) =>
								setSelectMulti(option, e)
							}
						/>
					</div>
				</div>
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
							styles={creatableMultiStyles}
							options={unitTypeOptions}
							onChange={(option, e) => setSelect(option, e)}
						/>
					</div>
				</div>
				<div className={styles.labelInput}>
					<label>Precio por unidad (U$S):</label>
					<input
						name="pricePerUnitType"
						value={fields.pricePerUnitType ?? ''}
						className={styles.input}
						onChange={(e) => changeValue(e, setFields)}
					/>
				</div>
				{isEdit ? (
					<Button
						variant="contained"
						/* onClick={handleSubmit} */
					>
						Editar
					</Button>
				) : (
					<Button
						variant="contained"
						/* onClick={handleSubmit} */
					>
						Crear
					</Button>
				)}
			</form>
		</div>
	);
}

export default MaterialsForm;
