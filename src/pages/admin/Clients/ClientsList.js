import React, { useEffect, useState } from 'react';
import styles from './clients.module.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchFilteredClients } from '../../../redux/clients/clientsSlice';
import Button from '../../../components/shared/Button';
import { Input } from '../../../components/shared/Inputs';
/* import Pagination from '../../../components/shared/Pagination'; */
import { AllClientsList } from '../../../components/Clients/AllClientsList';
import Modal from '../../../components/shared/Modal';
import ClientsForm from '../../../components/Clients/Form/index';
import { Pagination } from '@mui/material';

function ClientsList() {
	const { loadingClient, clients, clientsCount } =
		useSelector((state) => state.clients);
	const dispatch = useDispatch();

	const [searchTerm, setSearchTerm] = useState('');
	const [currentpage, setCurrentPage] = useState(1);
	const [totalpages, setTotalPages] = useState(0);
	const [openClientModal, setOpenClientModal] =
		useState(false);
	const [fields, setFields] = useState({
		contact: [
			{
				name: '',
				phone: '',
				email: '',
			},
		],
	});
	const [isEdit, setIsEdit] = useState(false);

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
				page: currentpage,
			})
		);
	}, [currentpage]);

	useEffect(() => {
		dispatch(
			fetchFilteredClients({
				searchTerm,
				page: currentpage,
			})
		);
	}, [searchTerm]);

	const setPage = (event, page) => {
		setCurrentPage(page);
	};

	const handleCreate = () => {
		setOpenClientModal(true);
	};

	return (
		<div className={styles.clientsList}>
			<Modal
				isOpen={openClientModal}
				onClose={() => (
					setOpenClientModal(false), setIsEdit(false)
				)}
			>
				<ClientsForm
					setOpenModal={setOpenClientModal}
					fields={fields}
					setFields={setFields}
					isEdit={isEdit}
					setIsEdit={setIsEdit}
				/>
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
					<Input
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder={'Buscar por cliente o producto'}
					></Input>
				</div>
			</div>
			<AllClientsList
				clients={clients}
				setFields={setFields}
				setIsEdit={setIsEdit}
				setOpenModal={setOpenClientModal}
			/>
			<div className={styles.paginationContainer}>
				<Pagination
					count={totalpages}
					page={currentpage}
					onChange={setPage}
					variant="contained"
					shape="rounded"
					sx={{
						'& .MuiPaginationItem-root': {
							color: 'white',
							backgroundColor: '#1976D2',
							'&:hover': {
								backgroundColor: 'lightblue',
							},
						},
						'& .MuiPaginationItem-root.Mui-selected': {
							backgroundColor: '#0D47A1',
						},
					}}
				/>
			</div>
		</div>
	);
}

export default ClientsList;
