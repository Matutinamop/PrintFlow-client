import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchStationById } from '../../../redux/workStations/workStationSlice';
import { editOperation } from '../../functions/resources/editOperation';
import { createNewOperation } from '../../functions/resources/createNewOperation';

export const useOperationsForm = (
	fields,
	setFields,
	isEdit,
	setOpenOperationModal
) => {
	const dispatch = useDispatch();

	const [stationsOptions, setStationsOptions] = useState(
		[]
	);
	const [progressiveCheck, setProgressiveCheck] =
		useState(false);

	const { stations, station } = useSelector(
		(state) => state.workStations
	);

	const unitTypeOptions = [
		{ key: 1, label: 'Horas', value: 'Horas' },
		{ key: 2, label: 'Clicks', value: 'Clicks' },
		{
			key: 3,
			label: 'Metro cuadrado',
			value: 'Metro cuadrado',
		},
		{ key: 4, label: 'Tiraje', value: 'Tiraje' },
		{ key: 5, label: 'Unitario', value: 'Unitario' },
	];

	useEffect(() => {
		if (fields.pricingRules.length > 0) {
			setFields((prev) => ({
				...prev,
				progressivePrice: true,
			}));
			setProgressiveCheck(true);
		}
	}, []);

	useEffect(() => {
		if (fields.workStation) {
			dispatch(
				fetchStationById(
					fields?.workStation?._id ?? fields?.workStation
				)
			);
		}
	}, [fields.workStation]);

	useEffect(() => {
		if (station._id === fields.workStation) {
			setFields((prev) => ({
				...prev,
				isPrintable: station.isPrintable ?? false,
			}));
		}
	}, [station]);

	useEffect(() => {
		const newOptions = stations.map((station) => ({
			key: station._id,
			label: station.name,
			value: station._id,
		}));
		setStationsOptions(newOptions);
	}, [stations]);

	const handleCheckBox = (e) => {
		const { name, checked } = e.target;
		setFields((prev) => {
			return {
				...prev,
				[name]: checked,
			};
		});
		if (name === 'progressivePrice') {
			setProgressiveCheck(checked);
		}
	};

	const handleRangeChange = (e, index) => {
		const updatedRanges = [...fields.pricingRules];
		updatedRanges[index] = {
			...updatedRanges[index],
			[e.target.name]: e.target.value,
		};

		setFields((prev) => ({
			...prev,
			pricingRules: updatedRanges,
		}));
	};

	const handleNewRange = () => {
		const newRanges = [...fields.pricingRules, {}];

		setFields((prev) => ({
			...prev,
			pricingRules: newRanges,
		}));
	};

	const deleteRangeRow = (i) => {
		const newRanges = fields.pricingRules.filter(
			(range, index) => i !== index
		);
		setFields((prev) => ({
			...prev,
			pricingRules: newRanges,
		}));
	};

	const setSelect = (option, e) => {
		const { name } = e;
		setFields((prev) => ({
			...prev,
			[name]: option.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (isEdit && fields._id) {
			try {
				await editOperation(fields);
			} catch (error) {
				console.error(error);
			}
		} else {
			try {
				await createNewOperation(fields);
			} catch (error) {
				console.error(error);
			}
		}
		setOpenOperationModal(false);
	};

	return {
		stationsOptions,
		progressiveCheck,
		unitTypeOptions,
		handleCheckBox,
		handleRangeChange,
		handleNewRange,
		deleteRangeRow,
		setSelect,
		handleSubmit,
	};
};
