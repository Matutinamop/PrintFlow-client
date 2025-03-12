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
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
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
	selectedFiles,
	setSelectedFiles,
	filesReady,
	setFilesReady,
}) {
	const [loadingFile, setLoadingFile] = useState(false);

	const schemeField = (fileLink, files) => {
		setFields((prevFields) => ({
			...prevFields,
			scheme: { link: fileLink, files: files },
		}));
	};

	useEffect(() => {
		setFilesReady(false);
	}, [selectedFiles]);

	return (
		<div className={styles.block}>
			<div className={styles.blockTitle}>
				<h3>Detalle del pedido: </h3>
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
											gap: '15px',
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
										<span className={styles.uploadStatus}>
											{loadingFile ? (
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'center',
														alignItems: 'center',
														height: '50px',
													}}
												>
													<CircularProgress />
												</Box>
											) : (
												''
											)}
											{filesReady ? (
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'center',
														alignItems: 'center',
													}}
												>
													<CheckCircleIcon
														sx={{
															color: 'green',
															fontSize: 24,
														}}
													/>
												</Box>
											) : (
												''
											)}
										</span>
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
											disabled={loadingFile}
										>
											<DeleteIcon
												sx={{
													color: 'white',
													fontSize: 16,
												}}
											/>
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
								handleUpload(
									selectedFiles,
									schemeField,
									setLoadingFile,
									setFilesReady
								)
							}
							disabled={loadingFile}
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
