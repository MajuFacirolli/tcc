export function toCamelCase(value: string): string {
	return value
		.replace(/[-_\s]+(.)?/g, (_, char: string | undefined) =>
			char ? char.toUpperCase() : "",
		)
		.replace(/^(.)/, (char) => char.toLowerCase())
}
