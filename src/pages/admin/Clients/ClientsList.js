import React, { useEffect, useState } from 'react';
import styles from './clients.module.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchFilteredClients } from '../../../redux/clients/clientsSlice';
import Button from '../../../components/shared/Button';
import { Input } from '../../../components/shared/Inputs';
import Pagination from '../../../components/shared/Pagination';
import { AllClientsList } from '../../../components/Clients/AllClientsList';
import Modal from '../../../components/shared/Modal';
import ClientsForm from '../../../components/Clients/Form/index';

function ClientsList() {
	const { loadingClient, clients, clientsCount } =
		useSelector((state) => state.clients);
	const dispatch = useDispatch();

	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [openClientModal, setOpenClientModal] =
		useState(false);

	useEffect(() => {
		const pages = Math.ceil(clientsCount / 50);
		setTotalPages(pages);
		setCurrentPage(1);
	}, [clientsCount]);

	useEffect(() => {
		dispatch(fetchFilteredClients());
	}, []);

	useEffect(() => {
		dispatch(
			fetchFilteredClients({
				searchTerm,
				page: currentPage,
			})
		);
	}, [currentPage]);

	const searchTermSubmit = (e) => {
		e.preventDefault();
		dispatch(
			fetchFilteredClients({
				searchTerm,
				page: currentPage,
			})
		);
	};

	const setPage = (page) => {
		setCurrentPage(page);
	};

	const handleCreate = () => {
		setOpenClientModal(true);
	};

	return (
		<div className={styles.clientsList}>
			<Modal
				isOpen={openClientModal}
				onClose={() => setOpenClientModal(false)}
			>
				<ClientsForm></ClientsForm>
			</Modal>
			<h2 className={styles.allOrdersTitle}>
				LISTA DE CLIENTES
			</h2>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					width: '85%',
				}}
			>
				{' '}
				{/* Cambio aquí para usar rutas de React Router */}
				<Button onClick={handleCreate}>Crear</Button>
				<div className={styles.clientsListSearch}>
					<label className={styles.label}>Buscar: </label>
					<form onSubmit={(e) => searchTermSubmit(e)}>
						<Input
							value={searchTerm}
							onChange={(e) =>
								setSearchTerm(e.target.value)
							}
							placeholder={'Buscar por cliente o producto'}
						></Input>
					</form>
				</div>
			</div>
			<AllClientsList
				loadingClient={loadingClient}
				clients={clients}
			/>
			<Pagination
				count={clientsCount}
				itemsPerPage={50}
				currentPage={currentPage}
				totalPages={totalPages}
				setPage={setPage}
			/>
		</div>
	);
}

export default ClientsList;
