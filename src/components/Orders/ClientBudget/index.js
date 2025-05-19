import React, { useEffect, useRef, useState } from 'react';
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
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ClientBudget({ toggleRefresh }) {
	const { order, loadingOrders } = useSelector(
		(state) => state.orders
	);

	const [fields, setFields] = useState({});

	const [newFields, setNewFields] = useState({});

	useEffect(() => {
		setFields(order?.fields?.values);
	}, [order]);

	const orderPDF = useRef();
	const divRef = useRef(null);

	useEffect(() => {
		console.log('newFields', newFields);
	}, [newFields]);
	useEffect(() => {
		setNewFields(
			fields?.divEditable || fields?.atte
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
	}, [fields]);

	const generatePDF = async () => {
		const input = orderPDF.current;
		const scale = 2;
		if (!input) {
			console.error('El nodo PDF no está montado.');
			return;
		}

		// Asegurarse de que las fuentes estén cargadas
		await document.fonts.ready;

		// Generamos el canvas
		const canvas = await html2canvas(input, {
			scale,
			useCORS: true,
		});

		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;

		// Creamos el PDF en tamaño A4 (mm)
		const pdf = new jsPDF({
			orientation: 'portrait',
			unit: 'mm',
			format: 'a4',
		});

		// Dimensiones del PDF en mm y en píxeles
		const pdfWidthMM = pdf.internal.pageSize.getWidth(); // 210 mm
		const pdfHeightMM = pdf.internal.pageSize.getHeight(); // 297 mm
		const pdfWidthPx = Math.floor(
			(pdfWidthMM / 25.4) * 96 * scale
		);
		const pdfHeightPx = Math.floor(
			(pdfHeightMM / 25.4) * 96 * scale
		);

		// Margen deseado en mm (definí 10 mm, pero podés cambiarlo)
		const marginMM = 10;
		// Área disponible en mm
		const availableWidthMM = pdfWidthMM - marginMM * 2;
		const availableHeightMM = pdfHeightMM - marginMM * 2;
		// Convertimos el margen y área disponible a píxeles
		const mmToPx = (mm) =>
			Math.floor((mm / 25.4) * 96 * scale);
		const pxToMm = (px) => (px / (96 * scale)) * 25.4;
		const availableWidthPx = mmToPx(availableWidthMM);
		const availableHeightPx = mmToPx(availableHeightMM);

		let currentHeight = 0;
		let pageCount = 0;

		while (currentHeight < canvasHeight) {
			// Cortamos el canvas en slices del alto disponible en la página (sin márgenes)
			const sliceHeight = Math.min(
				availableHeightPx,
				canvasHeight - currentHeight
			);

			// Canvas temporal para el slice
			const tempCanvas = document.createElement('canvas');
			tempCanvas.width = canvasWidth;
			tempCanvas.height = sliceHeight;
			const ctx = tempCanvas.getContext('2d');
			ctx.drawImage(
				canvas,
				0,
				currentHeight, // desde dónde recortar en Y
				canvasWidth, // ancho a recortar
				sliceHeight, // alto a recortar
				0,
				0,
				canvasWidth,
				sliceHeight
			);

			const imgData = tempCanvas.toDataURL('image/png');

			if (pageCount > 0) {
				pdf.addPage();
			}

			// Convertir dimensiones del slice de px a mm
			const sliceWidthMM = pxToMm(canvasWidth);
			const sliceHeightMM = pxToMm(sliceHeight);

			// Calcular el factor de escala para que la imagen se ajuste en el área disponible
			const scaleRatio = Math.min(
				availableWidthMM / sliceWidthMM,
				availableHeightMM / sliceHeightMM
			);
			const finalWidth = sliceWidthMM * scaleRatio;
			const finalHeight = sliceHeightMM * scaleRatio;

			// Posicionar la imagen en (margen, margen)
			pdf.addImage(
				imgData,
				'PNG',
				marginMM,
				marginMM,
				finalWidth,
				finalHeight
			);

			currentHeight += sliceHeight;
			pageCount++;
		}

		pdf.save('orden.pdf');
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
		<>
			{!fields ||
			loadingOrders ||
			Object.keys(fields).length === 0 ? (
				<div></div>
			) : (
				<div
					style={{
						overflow: 'auto',
						height: '80vh',
						borderRadius: '5px',
						width: '100%',
					}}
				>
					<div style={{ display: 'flex', gap: '20px' }}>
						<Button
							variant="contained"
							onClick={generatePDF}
						>
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
								<div className={styles.matutinaInfo}>
									<img
										className={styles.logo}
										src="/assets/logos/logo-matutina.png"
									/>
									<div>
										<h3>Matutina S.A.S</h3>
										<h3>RUT. 21 970232 0017 </h3>
										<p>
											Yaro 1017, 11.200 Montevideo, Uruguay
										</p>
										<p>
											Tels.: 24126400 - 24126401 -{' '}
											<img
												className={styles.logoWp}
												src="/assets/logos/whatsapp.png"
											/>{' '}
											091 307 002
										</p>
									</div>
								</div>
								{/* <h3
							className={styles.headerBlock}
							style={{ textAlign: 'center' }}
						>
							Presupuesto del Cliente
						</h3> */}
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
								{/* <div className={styles.leftBlock}>
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
						</div> */}
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
										<h4>{fields?.client.companyName}</h4>
										<p className={styles.infoText}>
											{fields?.client.legalName}
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
												{fields?.contactName}
											</p>
										</div>
										<div>
											<label className={styles.label}>
												Teléfono:
											</label>
											<p className={styles.infoText}>
												{fields?.contactPhone}
											</p>
										</div>
										<div>
											<label className={styles.label}>
												Email:
											</label>
											<p className={styles.infoText}>
												{fields?.contactEmail ?? ''}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className={styles.block}>
								{/* <div className={styles.workTitle}>
							<h2>Trabajo:</h2>
							<p className={styles.contentText}>
								{fields.product}
							</p>
						</div> */}
								<div className={styles.workDescription}>
									<h2>Descripcion:</h2>
									<p className={styles.contentText}>
										{fields?.descriptionClient}
									</p>
									<p className={styles.priceText}>
										Precio final: $
										{toFormatNumber(order.budget)}
									</p>
								</div>
							</div>
							<div className={styles.blockContainer}>
								<div>
									<h3 className={styles.notesTitle}>
										Notas:
									</h3>
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
										Precios sujetos a aumentos de materiales
										y/o jornales a partir de la fecha
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
			)}
		</>
	);
}

export default ClientBudget;
