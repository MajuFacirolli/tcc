export interface IPagedList<T> {
	items: T[]
	page: number
	pageSize: number
	lastPage: number
	total: number
	pageCount: number
}
