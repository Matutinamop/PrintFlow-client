import { useEffect, useState } from 'react';
import calculateItemInArea from '../functions/printTask/calculateItemInArea';
import {
	bulkPaperQuantity,
	paperCostByWeight,
} from '../functions/printTask/bulkPaper';
import { useSelector } from 'react-redux';

const useCalculateFields = (fields, setFields) => {
	const [material, setMaterial] = useState({});

	const { materials } = useSelector(
		(state) => state.materials
	);

	const { stations } = useSelector(
		(state) => state.workStations
	);

	useEffect(() => {
		if (fields.material) {
			const newMaterial = materials?.find(
				(material) => fields.material === material._id
			);
			setMaterial(newMaterial);
		}
	}, [fields.material]);

	useEffect(() => {
		if (material) {
			const newOptions = material?.grammage?.map(
				(grammage, index) => ({
					key: index,
					value: grammage,
					label: grammage,
				})
			);
			setFields((prev) => ({
				...prev,
				grammageOptions: newOptions,
			}));
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
			setFields((prev) => ({
				...prev,
				sizeMaterialOptions: newOptions,
			}));
		}
	}, [material]);

	useEffect(() => {
		const newOptions = materials?.map((material) => ({
			key: material._id,
			value: material._id,
			label: material.name,
		}));
		setFields((prev) => ({
			...prev,
			materialOptions: newOptions,
		}));
	}, [materials]);

	useEffect(() => {
		const newOptions = stations
			?.filter((station) => station.type === 'Impresión')
			.map((station, index) => ({
				key: index,
				value: station._id,
				label: station.name,
			}));
		setFields((prev) => ({
			...prev,
			stationOptions: newOptions,
		}));
	}, [stations]);

	useEffect(() => {
		if (fields.bulkPaperSize && fields.sheetSize) {
			setFields((prev) => ({
				...prev,
				sheetPerBulkPaper: calculateItemInArea(
					fields.bulkPaperSize,
					fields.sheetSize
				),
			}));
		}
		if (fields.sheetSize && fields.sizeWithMargins) {
			setFields((prev) => ({
				...prev,
				unitsPerSheet: calculateItemInArea(
					fields.sheetSize,
					fields.sizeWithMargins
				),
			}));
		}
		if (fields.quantity && fields.unitsPerSheet) {
			setFields((prev) => ({
				...prev,
				sheetQuantity: Math.ceil(
					fields.quantity / fields.unitsPerSheet
				),
			}));
		}

		if (
			fields.excess &&
			fields.sheetQuantity &&
			fields.sheetPerBulkPaper
		) {
			setFields((prev) => ({
				...prev,
				bulkPaperQuantity: bulkPaperQuantity(
					fields.sheetPerBulkPaper,
					fields.sheetQuantity,
					fields.excess
				),
			}));
		}

		if (
			fields.grammage &&
			fields.material &&
			material?.pricePerTon
		) {
			setFields((prev) => ({
				...prev,
				costPerBulkPaper: paperCostByWeight(
					fields.grammage,
					material.pricePerTon
				),
			}));
		}

		if (
			fields.bulkPaperQuantity &&
			fields.costPerBulkPaper
		) {
			setFields((prev) => ({
				...prev,
				paperCost:
					fields.bulkPaperQuantity *
					fields.costPerBulkPaper,
			}));
		}
	}, [
		fields.costPerBulkPaper,
		fields.bulkPaperQuantity,
		material,
		fields.material,
		fields.grammage,
		fields.sheetPerBulkPaper,
		fields.sheetQuantity,
		fields.excess,
		fields.bulkPaperSize,
		fields.sheetSize,
		fields.sizeWithMargins,
		fields.quantity,
		fields.unitsPerSheet,
	]);
};

export default useCalculateFields;
