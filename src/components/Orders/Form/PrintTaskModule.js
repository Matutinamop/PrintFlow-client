import React, { useEffect, useState } from 'react';
import styles from './form.module.css';
import { Input } from '../../shared/Inputs';
import CreatableSelect from 'react-select/creatable';
import useCalculateFields from '../../../utilities/customHooks/orderFields';
import { changeValue } from '../../../utilities/functions/forms/fields';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deepEqual } from '../../../utilities/functions/deepEqual';

function PrintTaskModule({
	selectStyles,
	fields,
	setFields,
	module,
	info,
	index,
	deleteModule,
}) {
	const [selectedOptions, setSelectedOptions] = useState(
		[]
	);
	const [manualChanges, setManualChanges] = useState({
		totalCost: false,
	});

	useEffect(() => {
		setFields((prev) => {
			const updatedPrintTasks = [...prev.printTasks];
			updatedPrintTasks[index].selectedOptions =
				selectedOptions;

			return { ...prev, printTasks: updatedPrintTasks };
		});
	}, [selectedOptions]);

	const handleManualChange = (e) => {
		setManualChanges((prev) => ({
			...prev,
			[e.target.name]: true,
		}));
	};
	/* useEffect(() => {
		if (!deepEqual(info, printTaskFields)) {
			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[module] = printTaskFields;

				return { ...prev, printTasks: updatedPrintTasks };
			});
		}
	}, [printTaskFields]); */

	/* useEffect(() => {
		console.log(deepEqual(info, printTaskFields));
		console.log(info, printTaskFields);
		if (!deepEqual(info, printTaskFields)) {
			return setPrintTaskFields(info);
		}
	}, [fields]); */

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

	/* 	const deleteModule = () => {
		const newModules = fields.printTasks.filter(
			(mod, index) => index !== module
		);
		console.log(newModules);
		setFields((prev) => ({
			...prev,
			printTasks: newModules,
		}));
	}; */

	const changeValue = (e) => {
		const name = e.target.name;
		setFields((prev) => {
			const updatedPrintTasks = [...prev.printTasks];
			updatedPrintTasks[index][name] = e.target.value;

			return { ...prev, printTasks: updatedPrintTasks };
		});
	};

	useCalculateFields(
		fields,
		index,
		setFields,
		manualChanges
	);

	return (
		<div
			className={`${styles.block} ${styles.blockPrintTask}`}
		>
			<div className={styles.closePrintTask}>
				<Button
					variant="outlined"
					color="error"
					size="small"
					startIcon={<DeleteIcon />}
					onClick={() => deleteModule(index)}
				>
					Borrar
				</Button>
			</div>
			<div className={styles.contain}>
				<Input
					name="quantity"
					onChange={(e) => changeValue(e)}
					value={info.quantity || ''}
					size="adjusted"
				>
					Unidades:{' '}
				</Input>
				<Input
					name="finalSize"
					onChange={(e) => changeValue(e)}
					value={info.finalSize || ''}
					size="adjusted"
				>
					Medida Final{' '}
				</Input>
				<Input
					name="sizeWithMargins"
					onChange={(e) => changeValue(e)}
					value={info.sizeWithMargins || ''}
					size="adjusted"
				>
					Medida con márgenes
				</Input>

				<div className={styles.selectMaterialContainer}>
					<label className={styles.label}>Material:</label>
					<CreatableSelect
						styles={selectStyles}
						name="material"
						value={info.selectedOptions?.material || ''}
						onChange={(option) => {
							setFields((prev) => {
								const updatedPrintTasks = [
									...prev.printTasks,
								];
								updatedPrintTasks[index]['material'] =
									option.value;
								return {
									...prev,
									printTasks: updatedPrintTasks,
								};
							});
							setSelectedOptions((prev) => ({
								...prev,
								material: {
									label: option.label,
									value: option.value,
								},
							}));
						}}
						options={info.materialOptions}
						placeholder={''}
					/>
				</div>
				<div className={styles.selectContainer}>
					<label className={styles.label}>Gramaje:</label>
					<CreatableSelect
						styles={selectStyles}
						name="grammage"
						value={info.selectedOptions?.grammage || ''}
						onChange={(option) => {
							setFields((prev) => {
								const updatedPrintTasks = [
									...prev.printTasks,
								];
								updatedPrintTasks[index]['grammage'] =
									option.value;
								return {
									...prev,
									printTasks: updatedPrintTasks,
								};
							});
							setSelectedOptions((prev) => ({
								...prev,
								grammage: {
									label: option.label,
									value: option.label,
								},
							}));
						}}
						options={info.grammageOptions}
						placeholder={''}
					/>
				</div>
				<div className={styles.selectContainer}>
					<label className={styles.label}>Tam. hoja:</label>
					<CreatableSelect
						styles={selectStyles}
						name="bulkPaperSize"
						value={
							info.selectedOptions?.bulkPaperSize || ''
						}
						onChange={(option) => {
							setFields((prev) => {
								const updatedPrintTasks = [
									...prev.printTasks,
								];
								updatedPrintTasks[index]['bulkPaperSize'] =
									option.value;
								return {
									...prev,
									printTasks: updatedPrintTasks,
								};
							});
							setSelectedOptions((prev) => ({
								...prev,
								bulkPaperSize: {
									label: option.label,
									value: option.label,
								},
							}));
						}}
						options={info.sizeMaterialOptions}
						placeholder={''}
					/>
				</div>
				<div className={styles.selectContainer}>
					<label className={styles.label}>
						Tam. pliego de impresión:
					</label>
					<CreatableSelect
						styles={selectStyles}
						name="sheetSize"
						value={info.selectedOptions?.sheetSize || ''}
						onChange={(option) => {
							setFields((prev) => {
								const updatedPrintTasks = [
									...prev.printTasks,
								];
								updatedPrintTasks[index]['sheetSize'] =
									option.value;
								return {
									...prev,
									printTasks: updatedPrintTasks,
								};
							});
							setSelectedOptions((prev) => ({
								...prev,
								sheetSize: {
									label: option.label,
									value: option.label,
								},
							}));
						}}
						options={genericOptions}
						placeholder={''}
					/>
				</div>
				<Input
					name="sheetPerBulkPaper"
					onChange={(e) => changeValue(e)}
					value={info.sheetPerBulkPaper || ''}
					size="adjusted"
					isDisabled
				>
					Pli. x Hoja:
				</Input>
				<Input
					name="unitsPerSheet"
					onChange={(e) => changeValue(e)}
					value={info.unitsPerSheet || ''}
					size="adjusted"
					isDisabled
				>
					Unid. x Pli.:
				</Input>
				<Input
					name="sheetQuantity"
					size="adjusted"
					onChange={(e) => changeValue(e)}
					value={info.sheetQuantity || ''}
					isDisabled
				>
					Cant. Pli. de impresión:
				</Input>
				<Input
					name="excess"
					onChange={(e) => changeValue(e)}
					value={info.excess || ''}
					size="adjusted"
				>
					Demasía:
				</Input>
				<Input
					name="bulkPaperQuantity"
					onChange={(e) => changeValue(e)}
					value={info.bulkPaperQuantity || ''}
					size="adjusted"
					isDisabled
				>
					Hojas:
				</Input>
				<Input
					name="costPerBulkPaper"
					onChange={(e) => changeValue(e)}
					value={info.costPerBulkPaper || ''}
					size="adjusted"
					isDisabled
				>
					Costo x hoja:
				</Input>
				<Input
					name="paperCost"
					onChange={(e) => changeValue(e)}
					value={info.paperCost || ''}
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
							name="operation"
							value={info.selectedOptions?.operation || ''}
							onChange={(option) => {
								setFields((prev) => {
									const updatedPrintTasks = [
										...prev.printTasks,
									];
									updatedPrintTasks[index]['operation'] =
										option.value;
									return {
										...prev,
										printTasks: updatedPrintTasks,
									};
								});
								setSelectedOptions((prev) => ({
									...prev,
									operation: {
										label: option.label,
										value: option.value,
									},
								}));
							}}
							options={info.operationOptions}
							placeholder={''}
						/>
					</div>
					<Input
						name="plates"
						onChange={(e) => changeValue(e)}
						value={info.plates || ''}
						size="adjusted"
					>
						Chapas:
					</Input>
					<Input
						name="plateCost"
						onChange={(e) => changeValue(e)}
						value={info.plateCost || ''}
						size="adjusted"
						isDisabled
					>
						Costo Chapa:
					</Input>
				</div>
				<Input
					name="front"
					onChange={(e) => changeValue(e)}
					value={info.front || ''}
					size="adjusted"
				>
					Frente:
				</Input>
				<Input
					name="back"
					onChange={(e) => changeValue(e)}
					value={info.back || ''}
					size="adjusted"
				>
					Dorso:
				</Input>
				<Input
					name="postures"
					onChange={(e) => changeValue(e)}
					value={info.postures || ''}
					size="adjusted"
				>
					Posturas:
				</Input>
				<Input
					name="printRun"
					onChange={(e) => changeValue(e)}
					value={info.printRun || ''}
					size="adjusted"
					isDisabled
				>
					Tiraje:
				</Input>
				<Input
					name="postureCost"
					onChange={(e) => changeValue(e)}
					value={info.postureCost || ''}
					size="adjusted"
					isDisabled
				>
					Costo Postura:
				</Input>
				<Input
					name="printCost"
					onChange={(e) => changeValue(e)}
					value={info.printCost || ''}
					size="adjusted"
					isDisabled
				>
					Costo impresion:
				</Input>
				<Input
					name="sheetDescription"
					onChange={(e) => changeValue(e)}
					value={info.sheetDescription || ''}
					size="normal"
				>
					Descripción del modulo:
				</Input>
				<Input
					name="moduleRepeat"
					onChange={(e) => changeValue(e)}
					value={info.moduleRepeat || ''}
					size="normal"
				>
					Repetir costo de impresión:
				</Input>
				<Input
					name="estimatedCost"
					onChange={(e) => changeValue(e)}
					value={info.estimatedCost || ''}
					size="adjusted"
					isDisabled
				>
					Costo modulo (estimado):
				</Input>
				<Input
					name="totalCost"
					onChange={(e) => {
						changeValue(e);
						handleManualChange(e);
					}}
					value={info.totalCost || ''}
					size="adjusted"
				>
					Costo modulo:
				</Input>
			</div>
		</div>
	);
}

export default PrintTaskModule;
