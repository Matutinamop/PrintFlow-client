import React, { useEffect, useState } from 'react';
import styles from './form.module.css';
import { Input } from '../../shared/Inputs';
import CreatableSelect from 'react-select/creatable';
import useCalculateFields from '../../../utilities/customHooks/orderFields';
import { changeValue } from '../../../utilities/functions/forms/fields';

function PrintTaskModule({
	selectStyles,
	fields,
	setFields,
	index,
}) {
	const [printTaskFields, setPrintTaskFields] = useState({
		fields,
	});

	useEffect(() => {
		setFields((prev) => ({
			...prev,
			[`printTask${index + 1}`]: printTaskFields,
		}));
	}, [printTaskFields]);

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

	useCalculateFields(printTaskFields, setPrintTaskFields);

	return (
		<div>
			<div className={styles.block}>
				<Input
					name="quantity"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.quantity || ''}
					size="adjusted"
				>
					Unidades:{' '}
				</Input>
				<Input
					name="finalSize"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.finalSize || ''}
					size="adjusted"
				>
					Medida Final{' '}
				</Input>
				<Input
					name="sizeWithMargins"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.sizeWithMargins || ''}
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
							setPrintTaskFields((prev) => ({
								...prev,
								['material']: option.value,
							}));
						}}
						options={printTaskFields.materialOptions}
						placeholder={''}
					/>
				</div>
				<div className={styles.selectContainer}>
					<label className={styles.label}>Gramaje:</label>
					<CreatableSelect
						styles={selectStyles}
						name="grammage"
						onChange={(option) => {
							setPrintTaskFields((prev) => ({
								...prev,
								['grammage']: option.value,
							}));
						}}
						options={printTaskFields.grammageOptions}
						placeholder={''}
					/>
				</div>
				<div className={styles.selectContainer}>
					<label className={styles.label}>Tam. hoja:</label>
					<CreatableSelect
						styles={selectStyles}
						name="bulkPaperSize"
						onChange={(option) => {
							setPrintTaskFields((prev) => ({
								...prev,
								['bulkPaperSize']: option.value,
							}));
						}}
						options={printTaskFields.sizeMaterialOptions}
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
							setPrintTaskFields((prev) => ({
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
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.sheetPerBulkPaper || ''}
					size="adjusted"
				>
					Pli. x Hoja:
				</Input>
				<Input
					name="unitsPerSheet"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.unitsPerSheet || ''}
					size="adjusted"
				>
					Unid. x Pli.:
				</Input>
				<Input
					name="sheetQuantity"
					size="adjusted"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.sheetQuantity || ''}
				>
					Cant. Pli.:
				</Input>
				<Input
					name="excess"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.excess || ''}
					size="adjusted"
				>
					Demasía:
				</Input>
				<Input
					name="bulkPaperQuantity"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.bulkPaperQuantity || ''}
					size="adjusted"
					isDisabled
				>
					Hojas:
				</Input>
				<Input
					name="costPerBulkPaper"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.costPerBulkPaper || ''}
					size="adjusted"
					isDisabled
				>
					Costo x hoja:
				</Input>
				<Input
					name="paperCost"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.paperCost || ''}
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
								setPrintTaskFields((prev) => ({
									...prev,
									['station']: option.value,
								}));
							}}
							options={printTaskFields.stationOptions}
							placeholder={''}
						/>
					</div>
					<Input
						name="plates"
						onChange={(e) =>
							changeValue(e, setPrintTaskFields)
						}
						value={printTaskFields.plates || ''}
						size="adjusted"
					>
						Chapas:
					</Input>
					<Input
						name="plateCost"
						onChange={(e) =>
							changeValue(e, setPrintTaskFields)
						}
						value={printTaskFields.plateCost || ''}
						size="adjusted"
						isDisabled
					>
						Costo Chapa:
					</Input>
				</div>
				<Input
					name="front"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.front || ''}
					size="adjusted"
				>
					Frente:
				</Input>
				<Input
					name="back"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.back || ''}
					size="adjusted"
				>
					Dorso:
				</Input>
				<Input
					name="postures"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.postures || ''}
					size="adjusted"
				>
					Posturas:
				</Input>
				<Input
					name="printRun"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.printRun || ''}
					size="adjusted"
				>
					Tiraje:
				</Input>
				<Input
					name="postureCost"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.postureCost || ''}
					size="adjusted"
				>
					Costo Postura:
				</Input>
				<Input
					name="inkCost"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.inkCost || ''}
					size="adjusted"
					isDisabled
				>
					Costo Tinta:
				</Input>
				<Input
					name="sheetDescription"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.sheetDescription || ''}
					size="normal"
				>
					Descripción del pliego:
				</Input>
				<Input
					name="sheetRepeat"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.sheetRepeat || ''}
					size="normal"
				>
					Repetir costo del pliego:
				</Input>
				<Input
					name="totalCost"
					onChange={(e) =>
						changeValue(e, setPrintTaskFields)
					}
					value={printTaskFields.totalCost || ''}
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
