import {
	Button,
	List,
	ListItem,
	ListItemText,
	Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import styles from './form.module.css';

import React, { useEffect, useState } from 'react';
import JSZip from 'jszip';
import AWS from 'aws-sdk';

function RequestInfoModule({
	changeValue,
	changeTaskCount,
	fields,
	selectStyles,
}) {
	const [selectedFiles, setSelectedFiles] = useState([]);

	useEffect(() => {
		console.log(selectedFiles);
	}, [selectedFiles]);

	AWS.config.update({
		accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
		secretAccessKey:
			process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
		region: process.env.REACT_APP_AWS_REGION,
	});

	const s3 = new AWS.S3();

	const handleFileChange = (event) => {
		const files = Array.from(event.target.files);
		const combinedArray = [
			...new Map(
				[...files, ...selectedFiles].map((file) => [
					file.name,
					file,
				])
			), // Usa el nombre del archivo como clave
		].map(([key, file]) => file);
		setSelectedFiles(combinedArray);
	};

	const removeFile = (fileIndex) => {
		const newFiles = selectedFiles.filter(
			(file, index) => index !== fileIndex
		);
		setSelectedFiles(newFiles);
	};

	const handleUpload = async () => {
		if (selectedFiles.length > 0) {
			const zip = new JSZip();

			// Añadir los archivos al ZIP
			selectedFiles.forEach((file) => {
				zip.file(file.name, file); // Usamos file.name como el nombre del archivo dentro del ZIP
			});

			try {
				// Generar el archivo ZIP como un Blob
				const content = await zip.generateAsync({
					type: 'blob',
				});

				// Obtener el timestamp para el nombre del archivo
				const now = new Date();
				const timestamp = now
					.toISOString()
					.replace(/[-:T]/g, '')
					.split('.')[0]; // "2024-11-17_153022"

				// Nombre del archivo zip
				const zipFileName = `upload/orders/${timestamp}.zip`;

				// Parámetros para subir el archivo
				const params = {
					Bucket: 'print-flow', // Nombre del bucket de S3
					Key: zipFileName, // Nombre del archivo en el bucket
					Body: content, // El contenido del archivo ZIP
					ContentType: 'application/zip', // Tipo de contenido del archivo
					ACL: 'public-read', // Establecer permisos (puedes cambiarlo según tus necesidades)
				};

				// Subir el archivo a S3
				const data = await s3.upload(params).promise();
				console.log(zipFileName, content);
				console.log('Archivo subido exitosamente:', data);
			} catch (err) {
				console.error(
					'Error al generar o subir el archivo:',
					err
				);
			}
		} else {
			alert('Por favor selecciona al menos un archivo.');
		}
	};

	return (
		<div className={styles.block}>
			<div className={styles.blockTitle}>
				<h3>Información del pedido: </h3>
			</div>
			<div className={styles.inputContainer}>
				<label>Comentarios para el Cliente:</label>
				<textarea className={styles.textArea} />
			</div>
			<div className={styles.inputContainer}>
				<label>Comentarios para el Taller:</label>
				<textarea className={styles.textArea} />
			</div>
			<div className={styles.inputContainer}>
				<label>Comentarios Internos:</label>
				<textarea className={styles.textArea} />
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					width: '100%',
					paddingTop: '15px',
				}}
			>
				<div className={styles.inputNumberContainer}>
					<label>Número de tareas:</label>
					<input
						className={styles.inputNumber}
						name="taskCount"
						type="number"
						min={1}
						value={fields.taskCount}
						onChange={(e) => {
							changeTaskCount(e);
						}}
					/>
				</div>
				<div>
					<input
						type="file"
						id="upload-button"
						style={{ display: 'none' }}
						multiple
						onChange={handleFileChange}
					/>
					<label htmlFor="upload-button">
						<Button
							variant="contained"
							component="span"
							startIcon={<UploadFileIcon />}
							color="primary"
						>
							Adjuntar archivos
						</Button>
					</label>
					{selectedFiles.length > 0 && (
						<div
							style={{
								marginTop: '20px',
								textAlign: 'left',
							}}
						>
							<Typography>
								Archivos seleccionados:
							</Typography>
							<List>
								{selectedFiles.map((file, index) => (
									<ListItem key={index}>
										<ListItemText
											primary={file.name}
											secondary={`Tamaño: ${(
												file.size / 1024
											).toFixed(2)} KB`}
										/>
										<button
											onClick={() => removeFile(index)}
										>
											x
										</button>
									</ListItem>
								))}
							</List>
						</div>
					)}
					<Button
						variant="contained"
						color="success"
						style={{ marginTop: '20px' }}
						onClick={handleUpload}
					>
						Subir
					</Button>
				</div>
			</div>
		</div>
	);
}

export default RequestInfoModule;
