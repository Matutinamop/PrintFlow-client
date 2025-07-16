import React from 'react';
import styles from './cutVisualizer.module.css';

const CutVisualizer = ({ visualizerData }) => {
	const { bulkWidth, bulkHeight, cutWidth, cutHeight } =
		visualizerData;

	/* if (
		!bulkWidth ||
		!bulkHeight ||
		!cutWidth ||
		!cutHeight ||
		isNaN(bulkWidth) ||
		isNaN(bulkHeight) ||
		isNaN(cutWidth) ||
		isNaN(cutHeight)
	) {
		return <></>;
	} */
	// Usar lado más largo como ancho para forzar visualización horizontal
	const sheetWidth = Math.max(bulkWidth, bulkHeight);
	const sheetHeight = Math.min(bulkWidth, bulkHeight);

	// Calcular cortes en ambas orientaciones
	const colsNormal = Math.floor(sheetWidth / cutWidth);
	const rowsNormal = Math.floor(sheetHeight / cutHeight);
	const totalNormal = colsNormal * rowsNormal;

	const colsRotated = Math.floor(sheetWidth / cutHeight);
	const rowsRotated = Math.floor(sheetHeight / cutWidth);
	const totalRotated = colsRotated * rowsRotated;

	// Usar orientación que permita más cortes
	const useRotated = totalRotated > totalNormal;

	const finalCutWidth = useRotated ? cutHeight : cutWidth;
	const finalCutHeight = useRotated ? cutWidth : cutHeight;
	const cols = useRotated ? colsRotated : colsNormal;
	const rows = useRotated ? rowsRotated : rowsNormal;

	// Escala por ancho
	const maxDisplayWidth = 130;
	const scale = maxDisplayWidth / sheetWidth;

	const scaledCutWidth = finalCutWidth * scale;
	const scaledCutHeight = finalCutHeight * scale;
	const scaledSheetWidth = sheetWidth * scale;
	const scaledSheetHeight = sheetHeight * scale;

	const totalCuts = rows * cols;

	return (
		<div
			className={styles.bulk}
			style={{
				width: `${scaledSheetWidth}px`,
				height: `${scaledSheetHeight}px`,
				display: 'grid',
				gridTemplateColumns: `repeat(${cols}, ${scaledCutWidth}px)`,
				gridTemplateRows: `repeat(${rows}, ${scaledCutHeight}px)`,
				justifyContent: 'center',
				alignContent: 'center',
				gap: '2px',
			}}
		>
			{Array.from({ length: totalCuts }).map((_, i) => (
				<div
					key={i}
					className={styles.cut}
					style={{
						width: `${scaledCutWidth}px`,
						height: `${scaledCutHeight}px`,
					}}
				/>
			))}
		</div>
	);
};

export default CutVisualizer;
