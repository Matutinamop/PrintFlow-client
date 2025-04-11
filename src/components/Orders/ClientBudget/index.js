import React, { useRef, useState } from 'react';
import styles from './budget.module.css';
import { Button } from '@mui/material';
import html2pdf from 'html2pdf.js';
import Select from 'react-select';
import { Key } from '@mui/icons-material';
import { invisibleStyles } from '../../../utilities/selectStyles/selectStyles';
import { toFormatNumber } from '../../../utilities/functions/costCalculator';
import { updateOrder } from '../../../utilities/functions/order/updateOrder';
import { useDispatch } from 'react-redux';
import { toFormatDate } from '../../../utilities/functions/dates';

function ClientBudget({ order, toggleRefresh }) {
	const { fields } = order;
	const [newFields, setNewFields] = useState(
		fields.divEditable || fields.atte
			? fields
			: {
					...fields,
					divEditable: 'EXENTO DE IVA',
					atte: {
						key: 4,
						value: 'Dpto. Comercial',
						label: 'Dpto. comercial',
					},
			  }
	);
	const orderPDF = useRef();
	const divRef = useRef(null);

	const generatePDF = () => {
		const input = orderPDF.current;

		const options = {
			margin: 0,
			filename: `Presupuesto-Nro-${fields.orderNumber}.pdf`,
			image: { type: 'png', quality: 0.6 },
			html2canvas: { scale: 2 },
			jsPDF: {
				unit: 'mm',
				format: 'a4',
				orientation: 'portrait',
			},
		};

		html2pdf().from(input).set(options).save();
	};

	const vendorOptions = [
		{
			key: 1,
			value: 'Patricia Rivara',
			label: 'Patricia Rivara',
		},
		{
			key: 2,
			value: 'Emilio Olivera',
			label: 'Emilio Olivera',
		},
		{
			key: 3,
			value: 'Aníbal Cabrera',
			label: 'Aníbal Cabrera',
		},
		{
			key: 4,
			value: 'Dpto. Comercial',
			label: 'Dpto. comercial',
		},
	];

	const handleBlur = () => {
		if (divRef.current) {
			const cleanText = divRef.current.innerHTML
				.replace(/<div>/g, '\n')
				.replace(/<\/div>/g, '')
				.replace(/<br>/g, '');
			setNewFields((prev) => ({
				...prev,
				divEditable: cleanText,
			}));
		}
	};

	return (
		<div
			style={{
				overflow: 'auto',
				height: '80vh',
				borderRadius: '5px',
				width: '100%',
			}}
		>
			<div style={{ display: 'flex', gap: '20px' }}>
				<Button variant="contained" onClick={generatePDF}>
					crear PDF
				</Button>
				<Button
					variant="contained"
					color="success"
					onClick={(e) => {
						updateOrder(order._id, newFields);
						toggleRefresh();
					}}
				>
					Guardar Cambios
				</Button>
			</div>

			<div className={styles.a4Sheet} ref={orderPDF}>
				<div className={styles.documentContent}>
					<div className={styles.mopHeader}>
						<div className={styles.headerBlock}>
							<img
								className={styles.logo}
								src="/assets/logos/full-logo-matutina.png"
							/>
						</div>
						<h3
							className={styles.headerBlock}
							style={{ textAlign: 'center' }}
						>
							Presupuesto del Cliente
						</h3>
						<div
							className={`${styles.headerBlock} ${styles.infoHeader}`}
						>
							<p
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignSelf: 'flex-end',
									width: '160px',
								}}
							>
								Fecha de Creación:{' '}
								<span>
									{toFormatDate(order.dateCreated)}
								</span>
							</p>
							<p
								style={{
									display: 'flex',
									justifyContent: 'flex-end',
									fontWeight: 'bold',
									fontSize: '20px',
								}}
							>
								Presupuesto Nº.{' '}
								<span>{order.orderNumber} </span>
							</p>
						</div>
					</div>
					<div className={styles.blockContainer}>
						<div className={styles.leftBlock}>
							{' '}
							<div>
								<p className={styles.infoText}>Yaro 1017</p>
								<p className={styles.infoText}>
									Tel: 2412 6400 - 01
								</p>
								<p className={styles.infoText}>
									Email: matutina@imprentamatutina.com.uy
								</p>
							</div>
						</div>
						<div className={styles.rightBlock}>
							<h3 className={styles.sectionTitle}>
								Empresa cliente:
							</h3>
							<div
								style={{
									width: '450px',
									backgroundColor: 'white',
									color: 'black',
								}}
							>
								<h4>{fields.client.companyName}</h4>
								<p className={styles.infoText}>
									{fields.client.legalName}
								</p>
							</div>

							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									gap: '5px',
								}}
							>
								<div>
									<label className={styles.label}>
										Att:
									</label>
									<p className={styles.infoText}>
										{fields.contactName}
									</p>
								</div>
								<div>
									<label className={styles.label}>
										Teléfono:
									</label>
									<p className={styles.infoText}>
										{fields.contactPhone}
									</p>
								</div>
								<div>
									<label className={styles.label}>
										Email:
									</label>
									<p className={styles.infoText}>
										{fields.contactEmail ?? ''}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.block}>
						<div className={styles.workTitle}>
							<h2>Trabajo:</h2>
							<p className={styles.contentText}>
								{fields.product}
							</p>
						</div>
						<div className={styles.workDescription}>
							<h2>Descripcion:</h2>
							<p className={styles.contentText}>
								{fields.descriptionClient}
							</p>
							<p className={styles.priceText}>
								Precio final: $
								{toFormatNumber(order.budget)}
							</p>
						</div>
					</div>
					<div className={styles.blockContainer}>
						<div>
							<h3 className={styles.notesTitle}>Notas:</h3>
							<div
								ref={divRef}
								contentEditable
								suppressContentEditableWarning
								onBlur={handleBlur}
								className={styles.smallLetter}
							>
								{newFields.divEditable}
							</div>

							<p className={styles.smallLetter}>
								Precios sujetos a aumentos de materiales y/o
								jornales a partir de la fecha
							</p>
						</div>
						<div className={styles.atte}>
							<p>Atte.,</p>
							<Select
								options={vendorOptions}
								styles={invisibleStyles}
								menuPlacement="top"
								value={newFields.atte}
								onChange={(option) =>
									setNewFields((prev) => ({
										...prev,
										atte: option,
									}))
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ClientBudget;
