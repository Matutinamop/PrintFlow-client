import { useEffect, useState } from 'react';
import calculateItemInArea from '../../functions/printTask/calculateItemInArea';
import {
	bulkPaperQuantity,
	paperCostByWeight,
} from '../../functions/printTask/bulkPaper';
import { useSelector } from 'react-redux';
import {
	costCalculator,
	printCost,
	printModuleCost,
} from '../../functions/costCalculator';

const useCalculateFields = (
	fields,
	index,
	setFields,
	manualChanges,
	quickMaterial
) => {
	const [material, setMaterial] = useState({});
	const [dollarPrice, setDollarPrice] = useState(0);

	const module = fields.printTasks[index];

	const { materials } = useSelector(
		(state) => state.materials
	);

	const { operations } = useSelector(
		(state) => state.operations
	);

	const { exchanges } = useSelector(
		(state) => state.exchanges
	);

	useEffect(() => {
		setDollarPrice(exchanges[0]?.conversion);
	}, [exchanges]);

	useEffect(() => {
		if (module.material) {
			const newMaterial = materials?.find(
				(material) => module.material === material._id
			);
			setMaterial(newMaterial);
		}
	}, [module.material]);

	useEffect(() => {
		if (material) {
			const newOptions = material?.grammage?.map(
				(grammage, index) => ({
					key: index,
					value: grammage,
					label: grammage,
				})
			);

			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].grammageOptions =
					newOptions;
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}
	}, [material]);

	useEffect(() => {
		if (material) {
			const newOptions = material?.sizes?.map(
				(size, index) => ({
					key: index,
					value: size,
					label: size,
				})
			);

			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].sizeMaterialOptions =
					newOptions;
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}
	}, [material]);

	useEffect(() => {
		const newOptions = materials?.map((material) => ({
			key: material._id,
			value: material._id,
			label: material.name,
		}));
		if (
			quickMaterial &&
			Object.keys(quickMaterial).length > 0
		) {
			newOptions.push({
				key: quickMaterial._id,
				value: quickMaterial._id,
				label: quickMaterial.name,
			});
			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].materialOptions =
					newOptions;
				updatedPrintTasks[index]['material'] =
					quickMaterial._id;
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
			setMaterial(quickMaterial);
			return;
		}
		setFields((prev) => {
			const updatedPrintTasks = [...prev.printTasks];
			updatedPrintTasks[index].materialOptions = newOptions;
			return {
				...prev,
				printTasks: updatedPrintTasks,
			};
		});
	}, [materials, quickMaterial]);

	useEffect(() => {
		const newOptions = operations
			?.filter((operation) => operation.isPrintable)
			.map((operation, index) => ({
				key: index,
				value: operation._id,
				label: operation.name,
			}));

		setFields((prev) => {
			const updatedPrintTasks = [...prev.printTasks];
			updatedPrintTasks[index].operationOptions =
				newOptions;
			return {
				...prev,
				printTasks: updatedPrintTasks,
			};
		});
	}, [operations]);

	useEffect(() => {
		if (module.bulkPaperSize && module.sheetSize) {
			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].sheetPerBulkPaper =
					calculateItemInArea(
						module.bulkPaperSize,
						module.sheetSize
					);
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}
		if (module.sheetSize && module.sizeWithMargins) {
			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].unitsPerSheet =
					calculateItemInArea(
						module.sheetSize,
						module.sizeWithMargins
					);
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}
		if (module.quantity && module.unitsPerSheet) {
			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].sheetQuantity = Math.ceil(
					module.quantity / module.unitsPerSheet
				);
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}
		if (module.sheetQuantity && module.sheetPerBulkPaper) {
			console.log(
				module.sheetQuantity,
				module.sheetPerBulkPaper
			);
			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].bulkPaperQuantity =
					bulkPaperQuantity(
						module.sheetPerBulkPaper,
						module.sheetQuantity,
						module.excess
					);
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}

		if (
			module.grammage &&
			module.bulkPaperSize &&
			module.material &&
			material?.pricePerUnitType &&
			material?.unitType === 'Tonelada'
		) {
			const [width, height] = module.bulkPaperSize
				.replace(/,/g, '.')
				.split(/x/i)
				.map((value) => Number(value.trim()));

			const area = (width * height) / 10000;
			const paperWeight = module.grammage * area;

			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].costPerBulkPaper =
					paperCostByWeight(
						paperWeight,
						material.pricePerUnitType * dollarPrice
					);
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}

		if (
			module.material &&
			material?.unitType === 'Unidad' &&
			material?.pricePerUnitType
		) {
			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].costPerBulkPaper =
					material.pricePerUnitType * dollarPrice;
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}
		if (
			module.bulkPaperQuantity &&
			module.costPerBulkPaper
		) {
			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].paperCost = Math.round(
					module.bulkPaperQuantity * module.costPerBulkPaper
				);
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}

		if (module.sheetQuantity && module.postures) {
			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].printRun =
					(module.sheetQuantity + parseInt(module.excess)) *
					module.postures;
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}

		if (module.operation && module.plates) {
			const selectedOperation = operations.find(
				(op) => op._id === module.operation
			);
			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].plateCost =
					selectedOperation.plateCost
						? Math.round(
								selectedOperation.plateCost * module.plates
						  )
						: 0;
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}

		if (
			module.operation &&
			module.postures &&
			module.printRun
		) {
			const selectedOperation = operations.find(
				(op) => op._id === module.operation
			);
			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].postureCost =
					costCalculator(
						selectedOperation,
						module.sheetQuantity + parseInt(module.excess)
					) * module.postures;
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}

		setFields((prev) => {
			const updatedPrintTasks = [...prev.printTasks];
			updatedPrintTasks[index].printCost =
				printCost(module);
			return {
				...prev,
				printTasks: updatedPrintTasks,
			};
		});

		setFields((prev) => {
			const updatedPrintTasks = [...prev.printTasks];
			updatedPrintTasks[index].estimatedCost =
				printModuleCost(module);
			return {
				...prev,
				printTasks: updatedPrintTasks,
			};
		});

		if (!manualChanges.totalCost) {
			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].totalCost =
					printModuleCost(module);
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}
	}, [JSON.stringify(module), material]);
};

export default useCalculateFields;
