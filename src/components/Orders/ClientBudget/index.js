import React, { useRef } from 'react';
import styles from './budget.module.css';
import { Button } from '@mui/material';
import html2pdf from 'html2pdf.js';
import CreatableSelect from 'react-select/creatable';
import { Key } from '@mui/icons-material';
import { invisibleStyles } from '../../../utilities/selectStyles/selectStyles';

function ClientBudget({ order }) {
	const { fields } = order;
	const orderPDF = useRef();

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

	const handleInput = (e) => {
		const textarea = e.target;
		textarea.style.height = 'auto'; // Resetea la altura para que ajuste correctamente
		textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta la altura al contenido
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

	return (
		<div
			style={{
				overflow: 'auto',
				height: '80vh',
				borderRadius: '5px',
				width: '100%',
			}}
		>
			<Button variant="contained" onClick={generatePDF}>
				crear PDF
			</Button>
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
								<span>{order.dateCreated}</span>
							</p>
							<p
								style={{
									display: 'flex',
									justifyContent: 'flex-end',
									fontWeight: 'bold',
								}}
							>
								<div style={{ fontSize: '20px' }}>
									Presupuseto Nº.{' '}
									<span>{order.orderNumber} </span>
								</div>
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
								Precio final: ${order.budget}
							</p>
						</div>
					</div>
					<div className={styles.blockContainer}>
						<div>
							<h3 className={styles.notesTitle}>Notas:</h3>
							<textarea
								onInput={handleInput}
								className={styles.smallLetter}
							>
								EXENTO DE IVA
							</textarea>
							<p className={styles.smallLetter}>
								Precios sujetos a aumentos de materiales y/o
								jornales a partir de la fecha
							</p>
						</div>
						<div className={styles.atte}>
							<p>Atte.,</p>
							<CreatableSelect
								options={vendorOptions}
								styles={invisibleStyles}
								menuPlacement="top"
								placeholder="Dpto. Comercial"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ClientBudget;
