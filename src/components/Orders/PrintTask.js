import React, { useEffect, useState } from 'react';
import styles from './orders.module.css';
import { Input, SearchableInput } from '../shared/Inputs';
import calculateItemInArea from '../../utilities/functions/calculateItemInArea';
import CreatableSelect from 'react-select/creatable';

function PrintTask() {
	const [fields, setFields] = useState({
		/* bulkPaperSize: '0x0',
    finalSize: '0x0',
    sheetSize: '0x0', */
	});

	const selectStyles = {
		control: (provided, state) => ({
			...provided,
			minHeight: '25px',
			height: '25px',
			minWidth: '100%',
			width: '100%',
			fontSize: '11px',
			border: '1px solid #ccc',
			borderRadius: '4px',
			boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
		}),

		valueContainer: (provided, state) => ({
			...provided,
			height: '25px',
			padding: '0 6px',
		}),

		container: (provided, state) => ({
			...provided,
			height: '18px',
		}),

		input: (provided, state) => ({
			...provided,
			margin: '0px',
		}),
		indicatorSeparator: (state) => ({
			display: 'none',
		}),
		indicatorsContainer: (provided, state) => ({
			...provided,
			display: 'none',
		}),
		option: (provided, state) => ({
			...provided,
			fontSize: '12px',
		}),
	};

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
		if (fields.sheetSize && fields.finalSize) {
			setFields((prev) => ({
				...prev,
				['unitsPerSheet']: calculateItemInArea(
					fields.sheetSize,
					fields.finalSize
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
		fields.finalSize,
		fields.quantity,
		fields.unitsPerSheet,
	]);

	useEffect(() => {
		console.log(fields);
	}, [fields]);

	const matchMaterial = (option) => {
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
	};

	/* 
	const matchClient = (name) => {
		const clientsMatched = clients.filter(
			(client) => name === client.companyName
		);

		if (clientsMatched.length === 1) {
			const clientId = clientsMatched[0]._id;
			dispatch(fetchClientById(clientId));
		}
		return;
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
					Medida Final:
				</Input>
				<div className={styles.selectMaterialContainer}>
					<label className={styles.label}>Material:</label>
					<CreatableSelect
						/* 							className={styles['container']}
							classNamePrefix={'searchable'} */
						styles={selectStyles}
						name="material"
						onChange={(option) => {
							setFields((prev) => ({
								...prev,
								['material']: option.value,
							}));
						}}
						options={genericOptions}
						placeholder={''}
					/>
				</div>
				{/* 
				<SearchableInput
					name="material"
					onChange={(e) => changeValue(e)}
					value={fields.material}
					size="normal"
					orientation="vertical"
					options={['1', '2', '3']}
					ifMatch={matchMaterial}
				>
					Material:{' '}
				</SearchableInput> */}
				{/* <SearchableInput
					name="grammage"
					onChange={(e) => changeValue(e)}
					value={fields.grammage}
					size="adjusted"
					options={['1', '2', '3']}
					ifMatch={matchGrammage}
				>
					Gramaje:{' '}
				</SearchableInput> */}
				<div className={styles.selectContainer}>
					<label className={styles.label}>Gramaje:</label>
					<CreatableSelect
						/* 							className={styles['container']}
							classNamePrefix={'searchable'} */
						styles={selectStyles}
						name="grammage"
						onChange={(option) => {
							setFields((prev) => ({
								...prev,
								['grammage']: option.value,
							}));
						}}
						options={genericOptions}
						placeholder={''}
					/>
				</div>
				<div className={styles.selectContainer}>
					<label className={styles.label}>Tam. hoja:</label>
					<CreatableSelect
						/* 							className={styles['container']}
							classNamePrefix={'searchable'} */
						styles={selectStyles}
						name="bulkPaperSize"
						onChange={(option) => {
							setFields((prev) => ({
								...prev,
								['bulkPaperSize']: option.value,
							}));
						}}
						options={genericOptions}
						placeholder={''}
					/>
				</div>
				<div className={styles.selectContainer}>
					<label className={styles.label}>
						Tam. pliego:
					</label>
					<CreatableSelect
						/* 							className={styles['container']}
							classNamePrefix={'searchable'} */
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
				{/* <Input
					name="bulkPaperSize"
					onChange={(e) => changeValue(e)}
					value={fields.bulkPaperSize}
					size="adjusted"
				>
					Tam. hoja:{' '}
				</Input>
				<Input
					name="sheetSize"
					onChange={(e) => changeValue(e)}
					value={fields.sheetSize}
					size="adjusted"
				>
					Tam. Pli.:{' '}
				</Input> */}
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
							/* 							className={styles['container']}
							classNamePrefix={'searchable'} */
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
					{/* <Input
						name="station"
						onChange={(e) => changeValue(e)}
						value={fields.station}
						size="adjusted"
					>
						Maquina:
					</Input> */}
					<Input
						name="plates"
						onChange={(e) => changeValue(e)}
						value={fields.plates}
						size="adjusted"
					>
						Chapas:
					</Input>
					<Input
						name="platesQuantity"
						placeholder="creo que no va"
						onChange={(e) => changeValue(e)}
						value={fields.platesQuantity}
						size="adjusted"
					>
						Cant.:
					</Input>
					{/* 					<Input name="costPerPlate" size="adjusted">
						Costo Unit.:
					</Input> */}
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
				{/* 				<Input name="" size="adjusted">
					Imp. y Ret.:
				</Input> */}
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

export default PrintTask;
