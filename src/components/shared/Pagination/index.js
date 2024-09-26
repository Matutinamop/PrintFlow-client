import React, { useEffect, useState } from 'react';
import styles from './pagination.module.css';
import { useDispatch } from 'react-redux';

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
					<button
						className={styles.prevBtn}
						onClick={() =>
							setPage((prev) => Math.max(prev - 1, 1))
						}
						disabled={currentPage === 1}
					>
						Anterior
					</button>
					{getPaginationRange().map((page) => (
						<button
							key={page}
							onClick={() => setPage(page)}
							className={`${styles.pageBtn} ${
								page === currentPage
									? styles.currentPageBtn
									: ''
							}`}
						>
							{page}
						</button>
					))}
					<button
						className={styles.nextBtn}
						onClick={() =>
							setPage((next) =>
								Math.min(next + 1, totalPages)
							)
						}
						disabled={currentPage === totalPages}
					>
						Siguiente
					</button>
				</div>
			) : (
				''
			)}
		</div>
	);
}

export default Pagination;
