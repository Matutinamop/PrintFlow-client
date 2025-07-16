import React from 'react';
import styles from './cutVisualizer.module.css';

const CutVisualizer = ({ visualizerData }) => {
	const { bulkWidth, bulkHeight, cutWidth, cutHeight } =
		visualizerData;

	const sheetWidth = Math.max(bulkWidth, bulkHeight);
	const sheetHeight = Math.min(bulkWidth, bulkHeight);

	const colsNormal = Math.floor(sheetWidth / cutWidth);
	const rowsNormal = Math.floor(sheetHeight / cutHeight);
	const totalNormal = colsNormal * rowsNormal;

	const colsRotated = Math.floor(sheetWidth / cutHeight);
	const rowsRotated = Math.floor(sheetHeight / cutWidth);
	const totalRotated = colsRotated * rowsRotated;

	const useRotated = totalRotated > totalNormal;

	const finalCutWidth = useRotated ? cutHeight : cutWidth;
	const finalCutHeight = useRotated ? cutWidth : cutHeight;
	const cols = useRotated ? colsRotated : colsNormal;
	const rows = useRotated ? rowsRotated : rowsNormal;

	const maxDisplayWidth = 130;
	const scale = maxDisplayWidth / sheetWidth;

	const scaledCutWidth = finalCutWidth * scale;
	const scaledCutHeight = finalCutHeight * scale;
	const scaledSheetWidth = sheetWidth * scale;
	const scaledSheetHeight = sheetHeight * scale;

	// Crear filas con cortes distribuidos con space-around
	const rowsArray = Array.from(
		{ length: rows },
		(_, rowIndex) => (
			<div
				key={rowIndex}
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					width: '100%',
				}}
			>
				{Array.from({ length: cols }).map((_, colIndex) => (
					<div
						key={colIndex}
						className={styles.cut}
						style={{
							width: `${scaledCutWidth}px`,
							height: `${scaledCutHeight}px`,
						}}
					/>
				))}
			</div>
		)
	);

	return (
		<div
			className={styles.bulk}
			style={{
				width: `${scaledSheetWidth}px`,
				height: `${scaledSheetHeight}px`,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-around',
			}}
		>
			{rowsArray}
		</div>
	);
};

export default CutVisualizer;
