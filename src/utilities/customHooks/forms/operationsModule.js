import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchOperations } from '../../../redux/operations/operationsSlice';
import { useEffect, useState } from 'react';
import {
	costCalculator,
	toRawNumber,
} from '../../functions/costCalculator';

export const useOperationsModule = (fields, setFields) => {
	const dispatch = useDispatch();
	const { operation, operations } = useSelector(
		(state) => state.operations
	);

	const [operationsList, setOperationsList] = useState([]);
	const [operationOptions, setOperationOptions] = useState(
		[]
	);

	useEffect(() => {
		setOperationOptions(
			operations
				?.filter((operation) => !operation.isPrintable)
				.map((operation) => ({
					key: operation._id,
					value: operation._id,
					label: operation.name,
				}))
		);
	}, [operationsList]);

	useEffect(() => {
		dispatch(fetchOperations());
	}, []);

	useEffect(() => {
		setFields((prev) => {
			return { ...prev, otherTasks: operationsList };
		});
	}, [JSON.stringify(operationsList)]);

	useEffect(() => {
		if (fields.otherTasks.length != 1) {
			setOperationsList(
				fields.otherTasks.map((task) => ({
					operation: task.operation,
					description: task.description,
					unitType: task.unitType,
					quantity: task.quantity,
					estimatedCost: task.estimatedCost,
					cost: task.cost,
				}))
			);
			return;
		}

		if (!operations || operations.length === 0) return;

		const startingList = operations?.filter(
			(operation) => operation.isAllTask === true
		);
		const listModified = startingList.map((item) => ({
			operation: item,
			description: '',
			unitType: item.unitType,
			quantity: '0',
			estimatedCost: '0',
			cost: '0',
		}));

		setOperationsList((prev) => {
			const newList = listModified.filter(
				(item) =>
					!prev.some(
						(existingItem) =>
							existingItem.operation._id ===
							item.operation._id
					)
			);
			return [...prev, ...newList];
		});
	}, []);

	useEffect(() => {
		operationsList.map((op, index) => {
			if (op.quantity) {
				const fixedQuantity =
					parseFloat(
						op.quantity.replace(',', '.').trim()
					) || 0;
				setOperationsList((prev) => {
					const updatedTasks = [...prev];
					updatedTasks[index].cost = costCalculator(
						op.operation,
						fixedQuantity
					);
					return updatedTasks;
				});
			}
		});
	}, [operationsList.map((op) => op.quantity).join(',')]);

	const deleteRow = (index) => {
		const newList = operationsList.filter(
			(op, i) => i !== index
		);
		setOperationsList(newList);
	};

	const handleNewRow = (option) => {
		if (!option.__isNew__) {
			setOperationsList((prev) => {
				return [
					...prev,
					{
						operation: operations.find(
							(op) => op._id === option.value
						),

						description: '',
						unitType: operation.unitType,
						quantity: 0,
						estimatedCost: 0,
						cost: 0,
					},
				];
			});
		} else {
			const newOperation = {
				operation: {
					_id: option.value,
					name: option.value,
				},

				description: '',
				unitType: '',
				quantity: 0,
				estimatedCost: 0,
				cost: 0,
			};

			setOperationsList((prev) => [...prev, newOperation]);
		}
	};

	const changeValue = (e, index) => {
		setOperationsList((prev) => {
			const name = e.target.name;
			const value = e.target.value;
			const updatedOptions = [...prev];

			if (name === 'cost') {
				const number = value.replace('$', '').trim();
				const rawNumber = toRawNumber(number);
				updatedOptions[index][name] = rawNumber;
			} else {
				updatedOptions[index][name] = e.target.value;
			}

			return updatedOptions;
		});
	};

	return {
		operationsList,
		operationOptions,
		handleNewRow,
		deleteRow,
		changeValue,
	};
};
