import { useEffect, useState } from 'react';
import calculateItemInArea from '../functions/printTask/calculateItemInArea';
import {
	bulkPaperQuantity,
	paperCostByWeight,
} from '../functions/printTask/bulkPaper';
import { useSelector } from 'react-redux';

const useCalculateFields = (fields, index, setFields) => {
	const [material, setMaterial] = useState({});

	const module = fields.printTasks[index];

	const { materials } = useSelector(
		(state) => state.materials
	);

	const { stations } = useSelector(
		(state) => state.workStations
	);

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

			console.log('grammages', newOptions);

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
			console.log('sizes', newOptions);

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

		console.log('material', newOptions);

		setFields((prev) => {
			const updatedPrintTasks = [...prev.printTasks];
			updatedPrintTasks[index].materialOptions = newOptions;
			return {
				...prev,
				printTasks: updatedPrintTasks,
			};
		});
	}, [materials]);

	useEffect(() => {
		const newOptions = stations
			?.filter((station) => station.type === 'Impresión')
			.map((station, index) => ({
				key: index,
				value: station._id,
				label: station.name,
			}));

		setFields((prev) => {
			const updatedPrintTasks = [...prev.printTasks];
			updatedPrintTasks[index].stationOptions = newOptions;
			return {
				...prev,
				printTasks: updatedPrintTasks,
			};
		});
	}, [stations]);

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

		if (
			module.excess &&
			module.sheetQuantity &&
			module.sheetPerBulkPaper
		) {
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
			material?.pricePerTon
		) {
			const [width, height] = module.bulkPaperSize
				.replace(/,/g, '.')
				.split('x')
				.map((value) => Number(value.trim()));

			const area = (width * height) / 10000;
			const paperWeight = module.grammage * area;

			setFields((prev) => {
				const updatedPrintTasks = [...prev.printTasks];
				updatedPrintTasks[index].costPerBulkPaper =
					paperCostByWeight(
						paperWeight,
						material.pricePerTon
					);
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
				updatedPrintTasks[index].paperCost =
					module.bulkPaperQuantity *
					module.costPerBulkPaper;
				return {
					...prev,
					printTasks: updatedPrintTasks,
				};
			});
		}

		if (module.sheetQuantity && module.postures) {
			console.log(
				(module.sheetQuantity + parseInt(module.excess)) *
					module.postures
			);
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
	}, [
		module.costPerBulkPaper,
		module.bulkPaperQuantity,
		material,
		module.material,
		module.grammage,
		module.sheetPerBulkPaper,
		module.sheetQuantity,
		module.excess,
		module.bulkPaperSize,
		module.sheetSize,
		module.sizeWithMargins,
		module.quantity,
		module.unitsPerSheet,
	]);
};

export default useCalculateFields;
