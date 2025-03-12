import React, { useEffect, useState } from 'react';
import styles from './pagination.module.css';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';

function Pagination({
	count,
	itemsPerPage,
	currentPage,
	totalPages,
	setPage,
}) {
	const getPaginationRange = () => {
		const range = [];
		let start = Math.max(1, currentPage - 2);
		let end = Math.min(totalPages, currentPage + 2);

		for (let i = start; i <= end; i++) {
			range.push(i);
		}
		return range;
	};

	return (
		<div className={styles.pagination}>
			{count > itemsPerPage ? (
				<div className={styles.paginationBtns}>
					<Button
						variant="contained"
						/* className={styles.prevBtn} */
						onClick={() =>
							setPage((prev) => Math.max(prev - 1, 1))
						}
						disabled={currentPage === 1}
					>
						Anterior
					</Button>
					{getPaginationRange().map((page) => (
						<Button
							key={page}
							onClick={() => setPage(page)}
							variant="contained"
							sx={{
								padding: '0', // El padding del botón en general
								'& .MuiButton-label': {
									padding: '12px 24px', // Modificamos el padding de la etiqueta interna del botón
									fontSize: '18px', // Cambiamos el tamaño de la fuente
									fontWeight: 'bold', // Cambiamos el peso de la fuente
								},
								'& .MuiTouchRipple-root': {
									display: 'none', // Ocultamos el ripple (onda)
								},
							}}
							/* className={`${styles.pageBtn} ${
								page === currentPage
									? styles.currentPageBtn
									: ''
							}`} */
						>
							{page}
						</Button>
					))}
					<Button
						variant="contained"
						/* className={styles.nextBtn} */
						onClick={() =>
							setPage((next) =>
								Math.min(next + 1, totalPages)
							)
						}
						disabled={currentPage === totalPages}
					>
						Siguiente
					</Button>
				</div>
			) : (
				''
			)}
		</div>
	);
}

export default Pagination;
