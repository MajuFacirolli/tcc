// Collapses nested objects into dot-separated paths, so that
// { address: { city: "required" } } becomes { "address.city": "required" }.
// Arrays are left untouched — callers pick the first entry themselves.
export function flattenObject(
	source: Record<string, unknown>,
	prefix = "",
): Record<string, unknown> {
	return Object.entries(source).reduce<Record<string, unknown>>(
		(accumulator, [key, value]) => {
			const path = prefix ? `${prefix}.${key}` : key

			if (
				value !== null &&
				typeof value === "object" &&
				!Array.isArray(value)
			) {
				Object.assign(
					accumulator,
					flattenObject(value as Record<string, unknown>, path),
				)

				return accumulator
			}

			accumulator[path] = value

			return accumulator
		},
		{},
	)
}
