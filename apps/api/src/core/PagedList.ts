export const DEFAULT_PAGE_SIZE = 9

export type PagedList<T> = {
	items: T[]
	page: number
	pageSize: number
	total: number
	lastPage: number
}

export function toPagedList<T>(
	items: T[],
	total: number,
	page: number,
	pageSize: number,
): PagedList<T> {
	return {
		items,
		page,
		pageSize,
		total,
		lastPage: Math.max(1, Math.ceil(total / pageSize)),
	}
}
