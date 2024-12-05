import {
	Button,
	List,
	ListItem,
	ListItemText,
	Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import styles from './form.module.css';
import {
	handleUpload,
	removeFile,
	handleFileChange,
} from '../../../utilities/functions/forms/uploadFile';
import React, { useEffect, useState } from 'react';
import { changeValue } from '../../../utilities/functions/forms/fields';

function RequestInfoModule({
	setFields,
	fields,
	selectStyles,
}) {
	const [selectedFiles, setSelectedFiles] = useState([]);

	const changePrintTaskCount = (e) => {
		const newValue = e.target.value;
		if (newValue >= 0 && newValue <= 10) {
			setFields((prevFields) => ({
				...prevFields,
				[e.target.name]: newValue,
				[`printTask${newValue}`]: {},
			}));
		}
	};

	const changeOtherTaskCount = (e) => {
		const newValue = e.target.value;
		if (newValue >= 0 && newValue <= 10) {
			setFields((prevFields) => ({
				...prevFields,
				[e.target.name]: newValue,
			}));
		}
	};

	const schemeField = (fileLink, files) => {
		setFields((prevFields) => ({
			...prevFields,
			scheme: { link: fileLink, files: files },
		}));
	};

	/* 	useEffect(() => {
		console.log(selectedFiles);
	}, [selectedFiles]); */

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
					onChange={(e) => changeValue(e, setFields)}
				/>
			</div>
			<div className={styles.inputContainer}>
				<label>Comentarios para el Taller:</label>
				<textarea
					name="descriptionWork"
					className={styles.textArea}
					onChange={(e) => changeValue(e, setFields)}
				/>
			</div>
			<div className={styles.inputContainer}>
				<label>Comentarios Internos:</label>
				<textarea
					name="descriptionPrivate"
					className={styles.textArea}
					onChange={(e) => changeValue(e, setFields)}
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
					<label>Tareas de impresión:</label>
					<input
						className={styles.inputNumber}
						name="printTaskCount"
						type="number"
						min={1}
						value={fields.printTaskCount}
						onChange={(e) => {
							changePrintTaskCount(e);
						}}
					/>
					<label>Otras tareas:</label>
					<input
						className={styles.inputNumber}
						name="otherTaskCount"
						type="number"
						min={1}
						value={fields.otherTaskCount}
						onChange={(e) => {
							changeOtherTaskCount(e);
						}}
					/>
				</div>
				<div>
					<input
						type="file"
						id="upload-button"
						style={{ display: 'none' }}
						multiple
						onChange={(e) =>
							handleFileChange(
								e,
								selectedFiles,
								setSelectedFiles
							)
						}
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
											onClick={() =>
												removeFile(
													index,
													selectedFiles,
													setSelectedFiles
												)
											}
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
						onClick={() =>
							handleUpload(selectedFiles, schemeField)
						}
					>
						Subir
					</Button>
				</div>
			</div>
		</div>
	);
}

export default RequestInfoModule;
