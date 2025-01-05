import {
	Button,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
	DatePicker,
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

	/* 	const changePrintTaskCount = (e) => {
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
	}; */

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
					value={fields.descriptionClient ?? ''}
					onChange={(e) => changeValue(e, setFields)}
				/>
			</div>
			<div className={styles.inputContainer}>
				<label>Comentarios para el Taller:</label>
				<textarea
					name="descriptionWork"
					className={styles.textArea}
					value={fields.descriptionWork ?? ''}
					onChange={(e) => changeValue(e, setFields)}
				/>
			</div>
			<div className={styles.inputContainer}>
				<label>Comentarios Internos:</label>
				<textarea
					name="descriptionPrivate"
					className={styles.textArea}
					value={fields.descriptionPrivate ?? ''}
					onChange={(e) => changeValue(e, setFields)}
				/>
			</div>
			<div className={styles.datesContainer}>
				<label>Fecha Estimada:</label>
				<input
					className={styles.dateInput}
					type="date"
					name="dateEstimate"
					value={fields.dateEstimate ?? ''}
					onChange={(e) => changeValue(e, setFields)}
				/>
				<label>Fecha Limite:</label>
				<input
					className={styles.dateInput}
					type="date"
					name="dateFinal"
					value={fields.dateFinal ?? ''}
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
				<div style={{ width: '100%' }}>
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
								width: '100%',
							}}
						>
							<Typography>
								Archivos seleccionados:
							</Typography>
							<List sx={{ width: '100%' }}>
								{selectedFiles.map((file, index) => (
									<ListItem
										key={index}
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
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
											{file.type.startsWith('image/') ? (
												<img
													src={URL.createObjectURL(file)}
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
										<Button
											sx={{
												minWidth: '30px',
												height: '30px',
											}}
											variant="contained"
											color="error"
											size="small"
											onClick={() =>
												removeFile(
													index,
													selectedFiles,
													setSelectedFiles
												)
											}
										>
											x
										</Button>
									</ListItem>
								))}
							</List>
						</div>
					)}
					{selectedFiles.length > 0 ? (
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
					) : (
						''
					)}
				</div>
			</div>
		</div>
	);
}

export default RequestInfoModule;
