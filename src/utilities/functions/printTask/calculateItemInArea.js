export default function calculateItemInArea(
	bigInput,
	smallInput
) {
	if (bigInput && smallInput) {
		const [bigWidth, bigHeight] = bigInput
			.replace(/,/g, '.')
			.split(/[xX]/)
			.map((value) => Number(value.trim()));
		const [smallWidth, smallHeight] = smallInput
			.replace(/,/g, '.')
			.split(/[xX]/)
			.map((value) => Number(value.trim()));

		const horizontalItems1 = Math.floor(
			bigWidth / smallWidth
		);
		const verticalItems1 = Math.floor(
			bigHeight / smallHeight
		);
		const totalItems1 = horizontalItems1 * verticalItems1;

		const horizontalItems2 = Math.floor(
			bigWidth / smallHeight
		);
		const verticalItems2 = Math.floor(
			bigHeight / smallWidth
		);
		const totalItems2 = horizontalItems2 * verticalItems2;

		if (totalItems1 || totalItems2) {
			return Math.max(totalItems1, totalItems2);
		}
	}

	return 0;
}
