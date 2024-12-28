export function deepEqual(obj1, obj2) {
	// Si son estrictamente iguales (tipos y valores)
	if (obj1 === obj2) return true;

	// Si uno de los dos no es un objeto o es nulo, no son iguales
	if (
		typeof obj1 !== 'object' ||
		typeof obj2 !== 'object' ||
		obj1 === null ||
		obj2 === null
	) {
		return false;
	}

	// Obtener las claves de ambos objetos
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	// Si no tienen el mismo número de claves, no son iguales
	if (keys1.length !== keys2.length) {
		return false;
	}

	// Comparar cada clave y valor recursivamente
	for (let key of keys1) {
		if (!keys2.includes(key)) return false; // Si la clave no existe en el segundo objeto, no son iguales

		// Comprobar si los valores son iguales (pueden ser objetos o primitivos)
		if (!deepEqual(obj1[key], obj2[key])) {
			return false;
		}
	}

	// Si todo es igual, los objetos son iguales
	return true;
}
