import JSZip from 'jszip';
import {
	S3Client,
	PutObjectCommand,
} from '@aws-sdk/client-s3';

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

export const handleFileChange = (
	event,
	selectedFiles,
	setSelectedFiles,
	setFilesReady
) => {
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
	setFilesReady(false);
};

export const removeFile = (
	fileIndex,
	selectedFiles,
	setSelectedFiles
) => {
	const newFiles = selectedFiles.filter(
		(file, index) => index !== fileIndex
	);
	setSelectedFiles(newFiles);
};

export const handleUpload = async (
	selectedFiles,
	schemeField,
	setLoadingFile,
	setFilesReady
) => {
	if (selectedFiles.length > 0) {
		setFilesReady(false);
		setLoadingFile(true);
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
			setLoadingFile(false);
			setFilesReady(true);
		} catch (err) {
			console.error(
				'Error al generar o subir el archivo:',
				err
			);
			setLoadingFile(false);
		}
	} else {
		alert('Por favor selecciona al menos un archivo.');
		setLoadingFile(false);
	}
};

export const fetchFilesFromZip = async (zipUrl) => {
	try {
		// 1️⃣ Descargar el archivo ZIP desde S3
		const response = await fetch(zipUrl);
		const blob = await response.blob();

		// 2️⃣ Cargar el ZIP en JSZip
		const zip = await JSZip.loadAsync(blob);

		// 3️⃣ Extraer los archivos y convertirlos a objetos `File`
		const files = [];
		for (const fileName in zip.files) {
			const file = zip.files[fileName];

			// Verifica que el archivo no sea un directorio dentro del ZIP
			if (!file.dir) {
				// Extraer el contenido del archivo como un Blob
				const fileBlob = await file.async('blob'); // Devuelve un Blob

				// Crear un objeto File utilizando el Blob
				const fileObject = new File([fileBlob], file.name, {
					type: fileBlob.type, // Tipo MIME del archivo
				});

				// Añadir el archivo al array
				files.push(fileObject);
			}
		}
		return files;
	} catch (error) {
		console.error('Error al procesar el ZIP:', error);
		return [];
	}
};
