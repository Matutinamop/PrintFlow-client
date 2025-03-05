import React, { useEffect, useState } from 'react';
import styles from './exchanges.module.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { fetchExchanges } from '../../../redux/exchanges/exchangesSlice';
import axios from 'axios';

function ExchangesList() {
	const dispatch = useDispatch();
	const [exchangesList, setExchangesList] = useState();
	const [error, setError] = useState(false);
	const [flag, setFlag] = useState(false);

	const numbersRegex = /^\d+(\.\d+)?$/;

	const { exchanges } = useSelector(
		(state) => state.exchanges
	);

	useEffect(() => {
		setTimeout(() => {
			dispatch(fetchExchanges());
		}, 2000);
	}, [flag]);

	useEffect(() => {
		setExchangesList(exchanges);
	}, [exchanges]);

	const handleChange = (e, id) => {
		const newExchanges = exchangesList.map((ex) =>
			ex._id === id
				? { ...ex, conversion: e.target.value }
				: ex
		);
		setExchangesList(newExchanges);
		setError(
			!numbersRegex.test(e.target.value) &&
				e.target.value !== ''
		);
	};

	const handleSubmit = async (id) => {
		const newExchange = exchangesList.find(
			(ex) => ex._id === id
		);
		try {
			if (!error) {
				const res = axios.put(
					`${process.env.REACT_APP_API_URL}/api/exchange/${id}`,
					newExchange
				);
			}
			setFlag(!flag);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={styles.exchanges}>
			<div className={styles.exchangesTable}>
				<div className={styles.table}>
					<table>
						<tbody>
							{exchangesList?.map((exchange, index) => (
								<tr key={exchange?._id}>
									<td className={styles.exchangeName}>
										{exchange?.name} ({exchange?.symbol})
									</td>
									<td></td>
									<td size={'big'}>
										<input
											className={styles.input}
											value={exchange?.conversion}
											onChange={(e) =>
												handleChange(e, exchange?._id)
											}
										/>
										{error && (
											<p style={{ color: 'red' }}>
												Entrada no válida
											</p>
										)}
									</td>
									<td>
										<Button
											variant="contained"
											disabled={
												exchange?.conversion ==
												exchanges[index]?.conversion
											}
											onClick={() =>
												handleSubmit(exchange?._id)
											}
										>
											Guardar
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default ExchangesList;
