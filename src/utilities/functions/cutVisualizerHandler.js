export const cutVisualizerHandler = (
	bigSize,
	smallSize
) => {
	if (
		typeof bigSize === 'string' &&
		typeof smallSize === 'string' &&
		/[xX]/.test(bigSize) &&
		/[xX]/.test(smallSize)
	) {
		const [bigWidth, bigHeight] = bigSize
			.replace(/,/g, '.')
			.split(/[xX]/)
			.map((value) => Number(value.trim()));
		const [cutWidth, cutHeight] = smallSize
			.replace(/,/g, '.')
			.split(/[xX]/)
			.map((value) => Number(value.trim()));
		return {
			bulkWidth: bigWidth,
			bulkHeight: bigHeight,
			cutWidth: cutWidth,
			cutHeight: cutHeight,
		};
	} else {
		return {
			bulkWidth: '0',
			bulkHeight: '0',
			cutWidth: '0',
			cutHeight: '0',
		};
	}
};
