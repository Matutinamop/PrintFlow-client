import React, { useEffect, useState } from 'react';
import styles from './pagination.module.css';
import { useDispatch } from 'react-redux';

function Pagination({
	count,
	itemsPerPage,
	fetchPage,
	searchTerm,
}) {
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

	const dispatch = useDispatch();

	useEffect(() => {
		const pages = Math.ceil(count / itemsPerPage);
		setTotalPages(pages);
		setCurrentPage(1);
	}, [count]);

	useEffect(() => {
		dispatch(
			fetchPage({
				searchTerm,
				page: currentPage,
			})
		);
	}, [currentPage]);

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
							setCurrentPage((prev) =>
								Math.max(prev - 1, 1)
							)
						}
						disabled={currentPage === 1}
					>
						Anterior
					</button>
					{getPaginationRange().map((page) => (
						<button
							key={page}
							onClick={() => setCurrentPage(page)}
							className={`${styles.pageBtn} ${
								page === currentPage
									? styles.currentPageBtn
									: ''
							}`} /* 
							style={{
								fontWeight:
									page === currentPage ? 'bold' : 'normal',
							}} */
						>
							{page}
						</button>
					))}
					<button
						className={styles.nextBtn}
						onClick={() =>
							setCurrentPage((next) =>
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
