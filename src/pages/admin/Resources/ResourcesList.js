import React, { useState } from 'react';
import styles from './resources.module.css';
import MaterialsList from '../../../components/Resources/Materials/MaterialsList';
import OperationsList from '../../../components/Resources/Operations/OperationsList';
import { Button } from '@mui/material';
import Modal from '../../../components/shared/Modal';
import OperationsForm from '../../../components/Resources/Operations/OperationsForm';
import { changeValue } from '../../../utilities/functions/forms/fields';
import MaterialsForm from '../../../components/Resources/Materials/MaterialsForm';
import ExchangesList from '../../../components/Resources/Exchanges/ExchangesList';

function ResourcesList() {
	const [openOperationModal, setOpenOperationModal] =
		useState(false);
	const [openMaterialModal, setOpenMaterialModal] =
		useState(false);
	const [openExchangeModal, setOpenExchangeModal] =
		useState(false);
	const [searchTerm, setSearchTerm] = useState({
		operation: '',
		material: '',
	});
	const [isEditOperation, setIsEditOperation] =
		useState(false);
	const [isEditMaterial, setIsEditMaterial] =
		useState(false);
	const initialOpFields = {
		progressivePrice: false,
		isPrintable: false,
		isAllTask: false,
		pricingRules: [],
	};

	const initialMatFields = {
		sizes: [],
		grammage: [],
	};
	const [operationFields, setOperationFields] =
		useState(initialOpFields);
	const [materialFields, setMaterialFields] = useState(
		initialMatFields
	);
	/* 
	useEffect(() => {
		dispatch(fetchFilteredOperations());
		dispatch(fetchFilteredMaterials());
	}, [openOperationModal]); */

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
				onClose={() => (
					setOpenOperationModal(false),
					setIsEditOperation(false)
				)}
			>
				<OperationsForm
					fields={operationFields}
					setFields={setOperationFields}
					selectStyles={selectStyles}
					isEdit={isEditOperation}
					setOpenOperationModal={setOpenOperationModal}
				/>
			</Modal>
			<Modal
				isOpen={openMaterialModal}
				onClose={() => (
					setOpenMaterialModal(false),
					setIsEditMaterial(false)
				)}
			>
				<MaterialsForm
					fields={materialFields}
					setFields={setMaterialFields}
					selectStyles={selectStyles}
					isEdit={isEditMaterial}
					setOpenMaterialModal={setOpenMaterialModal}
				/>
			</Modal>
			<Modal
				isOpen={openExchangeModal}
				onClose={() => setOpenExchangeModal(false)}
			>
				<ExchangesList />
			</Modal>
			<div className={styles.operationsList}>
				<h2 className={styles.title}>TAREAS</h2>
				<div className={styles.auxiliarRow}>
					<div className={styles.inputBox}>
						<label>Buscar:</label>
						<input
							name="operation"
							onChange={(e) =>
								changeValue(e, setSearchTerm)
							}
						></input>
					</div>
					<Button
						variant="contained"
						value={searchTerm.operation}
						onClick={() => (
							setOpenOperationModal(true),
							setOperationFields(initialOpFields)
						)}
						sx={{ padding: '5px' }}
					>
						Nueva Operación
					</Button>
				</div>
				<OperationsList
					setIsEdit={setIsEditOperation}
					setFields={setOperationFields}
					searchTerm={searchTerm.operation}
					openOperationModal={openOperationModal}
					setOpenOperationModal={setOpenOperationModal}
				/>
			</div>
			<div className={styles.materialsList}>
				<h2 className={styles.title}>MATERIALES</h2>
				<div className={styles.auxiliarRow}>
					<div className={styles.inputBox}>
						<label>Buscar:</label>
						<input
							name="material"
							value={searchTerm.material}
							onChange={(e) =>
								changeValue(e, setSearchTerm)
							}
						></input>
					</div>
					<div style={{ display: 'flex', gap: '15px' }}>
						<Button
							variant="contained"
							onClick={() => setOpenExchangeModal(true)}
							sx={{ padding: '5px' }}
						>
							Divisas
						</Button>
						<Button
							variant="contained"
							onClick={() => (
								setOpenMaterialModal(true),
								setMaterialFields(initialMatFields)
							)}
							sx={{ padding: '5px' }}
						>
							Nuevo Material
						</Button>
					</div>
				</div>
				<MaterialsList
					searchTerm={searchTerm.material}
					setIsEdit={setIsEditMaterial}
					setFields={setMaterialFields}
					openMaterialModal={openMaterialModal}
					setOpenMaterialModal={setOpenMaterialModal}
				/>
			</div>
		</div>
	);
}

export default ResourcesList;
