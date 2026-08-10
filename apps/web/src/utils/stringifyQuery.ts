import qs from "qs"

type StringifyFilter = (prefix: string, value: unknown) => unknown

interface IStringifyOptions {
	// Property delimiter
	delimiter?: string | undefined

	// Skip null values
	skipNulls?: boolean | undefined

	// Exclude properties from object
	filter?: Array<string | number> | StringifyFilter | undefined

	// Format of array delimiter
	arrayFormat?: "indices" | "brackets" | "repeat" | "comma" | undefined

	// Include array indices
	indices?: boolean | undefined

	// Sort properties
	sort?: ((a: string, b: string) => number) | undefined

	// Serialize Date objects
	serializeDate?: ((d: Date) => string) | undefined

	// Allow empty objects as values
	allowEmptyArrays?: boolean | undefined
}

export function stringifyQuery(
	obj: unknown,
	options?: IStringifyOptions,
): string {
	return qs.stringify(obj, options)
}
