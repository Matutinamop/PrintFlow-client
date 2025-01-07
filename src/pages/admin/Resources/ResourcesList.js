import React, { useEffect, useState } from 'react';
import styles from './resources.module.css';
import { useDispatch } from 'react-redux';
import { fetchMaterials } from '../../../redux/materials/materialsSlice';
import MaterialsList from '../../../components/Resources/Materials/MaterialsList';
import OperationsList from '../../../components/Resources/Operations/OperationsList';
import { Button } from '@mui/material';
import Modal from '../../../components/shared/Modal';
import OperationsForm from '../../../components/Resources/Operations/OperationsForm';
import { fetchOperations } from '../../../redux/operations/operationsSlice';

function ResourcesList() {
	const dispatch = useDispatch();

	const [modalContent, setModalContent] = useState({});
	const [openOperationModal, setOpenOperationModal] =
		useState(false);
	const [openMaterialModal, setMaterialModal] =
		useState(false);

	const [fields, setFields] = useState({
		progressivePrice: false,
		isPrintable: false,
		isAllTask: false,
		pricingRules: [{}],
	});

	useEffect(() => {
		dispatch(fetchOperations());
		dispatch(fetchMaterials());
	}, [openOperationModal]);

	const selectStyles = {
		menu: (provided, state) => ({
			...provided,
			height: '150px',
		}),

		menuList: (provided, state) => ({
			...provided,
			height: '150px',
		}),

		control: (provided, state) => ({
			...provided,

			minHeight: '25px',
			height: '30px',
			minWidth: '100%',
			width: '100%',
			fontSize: '11px',
			border: '1px solid #ccc',
			borderRadius: '4px',
			boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
		}),

		valueContainer: (provided, state) => ({
			...provided,
			height: '30px',
			padding: '0 6px',
			fontSize: '14px',
			color: 'black',
			fontWeight: 'bold',
		}),

		container: (provided, state) => ({
			...provided,
			height: '30px',
		}),

		input: (provided, state) => ({
			...provided,
			margin: '0px',
			height: '30px',
		}),
		indicatorSeparator: (state) => ({
			display: 'none',
		}),
		indicatorsContainer: (provided, state) => ({
			...provided,
			height: '25px',
		}),
		option: (provided, state) => ({
			...provided,
			fontSize: '14px',
			color: 'black',
			fontWeight: 'bold',
		}),
	};

	return (
		<div className={styles.resourcesPage}>
			<Modal
				isOpen={openOperationModal}
				onClose={() => setOpenOperationModal(false)}
			>
				<OperationsForm
					fields={fields}
					setFields={setFields}
					selectStyles={selectStyles}
					setOpenOperationModal={setOpenOperationModal}
				/>
			</Modal>
			<div className={styles.operationsList}>
				<h2 className={styles.title}>OPERACIONES</h2>
				<Button
					variant="contained"
					onClick={() => setOpenOperationModal(true)}
				>
					Nueva Operación
				</Button>
				<OperationsList
					setFields={setFields}
					setOpenOperationModal={setOpenOperationModal}
				/>
			</div>
			<div className={styles.materialsList}>
				<h2 className={styles.title}>MATERIALES</h2>
				<Button variant="contained">Nuevo Material</Button>
				<MaterialsList />
			</div>
		</div>
	);
}

export default ResourcesList;
