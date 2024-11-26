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
import {
	S3Client,
	PutObjectCommand,
} from '@aws-sdk/client-s3';

function RequestInfoModule({
	changeValue,
	changeTaskCount,
	fields,
	selectStyles,
	schemeField,
}) {
	const [selectedFiles, setSelectedFiles] = useState([]);

	useEffect(() => {
		console.log(selectedFiles);
	}, [selectedFiles]);

	const accessKey = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
	const secretKey =
		process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
	const region = process.env.REACT_APP_AWS_REGION;
	const bucketName = 'print-flow';

	const s3 = new S3Client({
		credentials: {
			accessKeyId: accessKey,
			secretAccessKey: secretKey,
		},
		region: region,
	});

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

			selectedFiles.forEach((file) => {
				zip.file(file.name, file);
			});

			try {
				const content = await zip.generateAsync({
					type: 'blob',
				});

				const now = new Date();
				const timestamp = now
					.toISOString()
					.replace(/[-:T]/g, '')
					.split('.')[0];

				const zipFileName = `upload/orders/${timestamp}.zip`;

				const params = {
					Bucket: bucketName,
					Key: zipFileName,
					Body: content,
					ContentType: 'application/zip',
					ACL: 'public-read',
				};

				const command = new PutObjectCommand(params);

				await s3.send(command);

				const fileLink = `https://${bucketName}.s3.${region}.amazonaws.com/${zipFileName}`;

				schemeField(fileLink, selectedFiles);
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
				<textarea
					name="descriptionClient"
					className={styles.textArea}
					onChange={(e) => changeValue(e)}
				/>
			</div>
			<div className={styles.inputContainer}>
				<label>Comentarios para el Taller:</label>
				<textarea
					name="descriptionWork"
					className={styles.textArea}
					onChange={(e) => changeValue(e)}
				/>
			</div>
			<div className={styles.inputContainer}>
				<label>Comentarios Internos:</label>
				<textarea
					name="descriptionPrivate"
					className={styles.textArea}
					onChange={(e) => changeValue(e)}
				/>
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
