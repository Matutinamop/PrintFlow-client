import React, { useEffect, useRef, useState } from 'react';
import styles from './workshop.module.css';
import { toFormatDate } from '../../../utilities/functions/dates';
import { Button } from '@mui/material';
import html2pdf from 'html2pdf.js';
import { acceptOrder } from '../../../utilities/functions/order/updateOrder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';
import { fetchFilesFromZip } from '../../../utilities/functions/forms/uploadFile';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function WorkShopOrder({ order, toggleRefresh }) {
	const orderPDF = useRef();
	const { fields } = order;

	const [selectedFiles, setSelectedFiles] = useState({});
	const imageExtensions = [
		'jpg',
		'jpeg',
		'png',
		'gif',
		'webp',
		'svg',
	];

	useEffect(() => {
		if (order.scheme?.link) {
			const loadFiles = async () => {
				const files = await fetchFilesFromZip(
					order.scheme.link
				);
				setSelectedFiles(files);
			};

			loadFiles();
		}
	}, [order.scheme]);

	const generatePDF = async () => {
		if (order.status === 'Abierta') {
			acceptOrder(order._id);
			toggleRefresh();
		}
		const input = orderPDF.current;
		const scale = 2;

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

		// Abrir el PDF generado en una nueva pestaña
		const pdfOutput = pdf.output('bloburl');
		window.open(pdfOutput, '_blank');
	};

	const Input = ({ name, value }) => {
		return (
			<div>
				<label className={styles.label}>{name}</label>
				<p className={styles.inputWorkshop}>{value}</p>
			</div>
		);
	};

	const handleDownload = () => {
		const link = document.createElement('a');

		link.href = order.scheme.link;
		link.download = `Archivos-Presupuesto-${order.orderNumber}`;

		link.click();
	};

	return (
		<div
			style={{
				overflow: 'auto',
				height: '80vh',
				borderRadius: '5px',
			}}
		>
			<Button
				variant="contained"
				color="success"
				onClick={generatePDF}
				style={{
					margin: '15px',
				}}
			>
				crear PDF
			</Button>
			<Button variant="contained" onClick={handleDownload}>
				Descargar archivos
			</Button>
			<div className={styles.a4Sheet} ref={orderPDF}>
				<div className={styles.documentContent}>
					<div className={styles.mopHeader}>
						<div className={styles.headerBlock}>
							<h4>Imprenta</h4>
							<h2>MATUTINA</h2>
						</div>
						<h3
							className={styles.headerBlock}
							style={{ textAlign: 'center' }}
						>
							Orden de producción
						</h3>
						<div
							className={`${styles.headerBlock} ${styles.infoHeader} `}
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
								}}
							>
								<div style={{ fontSize: '24px' }}>
									ORDEN Nº.{' '}
									<span>{order.orderNumber} </span>
								</div>
							</p>
						</div>
					</div>
					<div
						className={`${styles.blockContainer} ${styles.noBreak}`}
					>
						<div className={styles.leftBlock}>
							{' '}
							<div>
								<h3 className={styles.sectionTitle}>
									Familia:
								</h3>{' '}
								<p className={styles.familyInput}>
									{fields?.product ?? ''}
								</p>
							</div>
							<div>
								<label>Fecha estimada:</label>{' '}
								<p className={styles.familyInput}>
									{fields.dateEstimate ?? '-'}
								</p>
							</div>
							<div>
								<label>Fecha limite:</label>{' '}
								<p className={styles.familyInput}>
									{fields.dateFinal ?? '-'}
								</p>
							</div>
						</div>
						<div className={styles.rightBlock}>
							<h3 className={styles.sectionTitle}>
								Cliente:
							</h3>
							<div
								style={{
									padding: '10px',
									width: '500px',
									backgroundColor: 'white',
									color: 'black',
								}}
							>
								<h4>{fields.client.companyName}</h4>
								<p>{fields.client.legalName}</p>
								<p>{fields.client.address}</p>
								<p>{fields.client.phone}</p>
							</div>

							<div className={styles.blockTitle}>
								<h3>Información de contacto: </h3>
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
										Nombre:
									</label>
									<p
										className={styles.inputWorkshopContact}
									>
										{fields.contactName}
									</p>
								</div>
								<div>
									<label className={styles.label}>
										Teléfono:
									</label>
									<p
										className={styles.inputWorkshopContact}
									>
										{fields.contactPhone}
									</p>
								</div>
								<div>
									<label className={styles.label}>
										Email:
									</label>
									<p
										className={styles.inputWorkshopContact}
									>
										{fields.contactEmail}
									</p>
								</div>
							</div>
						</div>
						<div className={styles.inputContainer}>
							<h3 style={{ fontSize: '16px' }}>
								Datos de entrega:
							</h3>
							<p className={styles.textArea}>
								{fields.deliveryData ?? ''}
							</p>
						</div>
					</div>

					<div className={`${styles.block}`}>
						<div className={styles.blockTitle}>
							<h3>Información del pedido: </h3>
						</div>
						<div className={styles.inputContainer}>
							<h3 style={{ fontSize: '16px' }}>
								Comentarios para el Cliente:
							</h3>
							<p className={styles.textArea}>
								{fields.descriptioClient ?? ''}
							</p>
						</div>
						<div className={styles.inputContainer}>
							<h3 style={{ fontSize: '16px' }}>
								Comentarios para el Taller:
							</h3>
							<p className={styles.textArea}>
								{fields.descriptionWork ?? ''}
							</p>
						</div>
						{order.scheme?.link ? (
							<div className={styles.inputContainer}>
								<div style={{ width: '100%' }}>
									<h3 style={{ fontSize: '16px' }}>
										Archivos adjuntos:
									</h3>
									{selectedFiles.length > 0 && (
										<div
											style={{
												textAlign: 'left',
												width: '100%',
											}}
										>
											<List sx={{ width: '100%' }}>
												{selectedFiles.map(
													(file, index) => (
														<ListItem
															key={index}
															sx={{
																display: 'flex',
																gap: '10px',
																justifyContent:
																	'space-between',
																width: '100%',
															}}
														>
															<ListItemText
																primary={file.name}
																secondary={`Tamaño: ${(
																	file.size / 1024
																).toFixed(2)} KB`}
															/>

															<ListItemIcon>
																{imageExtensions.includes(
																	file.name
																		.split('.')
																		.pop()
																		.toLowerCase()
																) ? (
																	<img
																		src={URL.createObjectURL(
																			file
																		)}
																		alt={file.name}
																		style={{
																			width: '50px',
																			height: '50px',
																			objectFit: 'cover',
																			borderRadius: '4px',
																		}}
																	/>
																) : (
																	<UploadFileIcon />
																)}
															</ListItemIcon>
														</ListItem>
													)
												)}
											</List>
										</div>
									)}
									{selectedFiles.length > 0 ? (
										<>
											<Button
												variant="contained"
												onClick={() => handleDownload()}
											>
												Descargar
											</Button>
										</>
									) : (
										''
									)}
								</div>
							</div>
						) : (
							''
						)}
					</div>
					{fields.printTasks.map((info, index) => (
						<div
							className={`${styles.block} ${styles.blockPrintTask} ${styles.noBreak}`}
							key={index}
						>
							<div className={styles.contain}>
								<div
									style={{
										display: 'flex',
										gap: '50px',
										/* justifyContent: 'space-between', */
										width: '100%',
									}}
								>
									<h2 className={styles.printTitle}>
										Módulo de impresión
									</h2>
									<Input
										name="Descripción del módulo"
										value={info.sheetDescription || ''}
									/>
								</div>
								<Input
									name={'Unidades:'}
									value={info.quantity}
								/>
								<Input
									name={'Medida final:'}
									value={info.finalSize}
								/>
								<Input
									name={'Con márgenes:'}
									value={info.sizeWithMargins}
								/>
								<div
									className={styles.selectMaterialContainer}
								>
									<label className={styles.label}>
										Material:
									</label>
									<p className={styles.inputWorkshop}>
										{info?.materialOptions &&
										Array.isArray(info.materialOptions)
											? info.materialOptions.find(
													(material) =>
														material.value ===
														info?.material
											  )?.label || '-'
											: '-'}
									</p>
								</div>
								<Input
									name={'Gramaje:'}
									value={info.grammage}
								/>
								<Input
									name={'Tam. hoja:'}
									value={info.bulkPaperSize}
								/>
								<Input
									name={'Pliego:'}
									value={info.sheetSize}
								/>
								<Input
									name={'Pli. x hoja:'}
									value={info.sheetPerBulkPaper}
								/>
								<Input
									name={'Unid. x pli:'}
									value={info.unitsPerSheet}
								/>
								<Input
									name={'Nro pliegos:'}
									value={info.sheetQuantity}
								/>
								<Input
									name={'Demasía:'}
									value={info.excess}
								/>
								<Input
									name={'Nro hojas:'}
									value={info.bulkPaperQuantity}
								/>
								<div
									className={styles.selectMaterialContainer}
								>
									<label className={styles.label}>
										Maquina:
									</label>
									<p className={styles.inputWorkshop}>
										{info.operationOptions &&
										Array.isArray(info.operationOptions)
											? info.operationOptions.find(
													(station) =>
														station.value ===
														info?.operation
											  )?.label || '-'
											: '-'}
									</p>
								</div>
								<Input
									name="Chapas:"
									value={info.plates || ''}
								/>

								<Input
									name="Posturas:"
									value={info.postures || ''}
								/>

								<Input
									name="Tiraje:"
									value={info.printRun || ''}
								/>

								<Input
									name="Repetir:"
									value={info.moduleRepeat}
								/>
							</div>
							<div className={styles.lastItem}></div>
							<div
								className={styles.printFirstRow}
								style={{ alignItems: 'flex-end' }}
							>
								<div>
									<h3>TINTAS</h3>
									<div
										style={{
											display: 'flex',
											width: '720px',
											gap: '20px',
										}}
									>
										<div style={{ width: '50%' }}>
											<label className={styles.label}>
												Frente:
											</label>
											<p className={styles.textArea}>
												{info.front}
											</p>
										</div>
										<div style={{ width: '50%' }}>
											<label className={styles.label}>
												Dorso:
											</label>
											<p className={styles.textArea}>
												{info.back}
											</p>
										</div>
									</div>
								</div>
								<div className={styles.rightRow}>
									<div
										className={styles.rightRowContainer}
									></div>
									<div
										className={styles.rightRowContainer}
									></div>
								</div>
							</div>
						</div>
					))}
					<div
						className={`${styles.block} ${styles.blockPrintTask} ${styles.noBreak}`}
					>
						<table className={styles.table}>
							<thead>
								<tr>
									<th className={styles.th}>Operación</th>
									<th className={styles.smallth}>
										Descripción
									</th>
									<th className={styles.smallth}>Unidad</th>
									<th className={styles.smallth}>
										Cantidad
									</th>
								</tr>
							</thead>
							<tbody>
								{fields.otherTasks?.map((op, index) => (
									<tr className={styles.tr} key={index}>
										<td
											className={`${styles.td} ${styles.nameTd}`}
										>
											{op.operation?.name}{' '}
										</td>
										<td>
											<input
												className={`${styles.input} ${styles.td}`}
												name="description"
												value={op.description ?? ''}
											/>
										</td>
										<td>
											<input
												className={styles.smallInput}
												name="unitType"
												value={op.operation?.unitType ?? ''}
												disabled
											/>
										</td>
										<td>
											<input
												className={styles.smallInput}
												name="quantity"
												value={op?.quantity ?? ''}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default WorkShopOrder;
