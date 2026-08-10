import {
	BasePagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "./BasePagination"

type TablePaginationProps = {
	lastPage: number
	value: number | null
	setParam: (params: { page: number }) => void
}

function getPaginationItems(current: number, lastPage: number) {
	if (lastPage <= 5) {
		return Array.from({ length: lastPage }, (_, i) => i + 1)
	}

	let start = Math.max(2, current - 1)
	let end = Math.min(lastPage - 1, current + 1)

	if (start === 2) {
		end = Math.min(lastPage - 1, Math.max(end, 4))
	}

	if (end === lastPage - 1) {
		start = Math.max(2, Math.min(start, lastPage - 3))
	}

	const items: (number | "ellipsis-start" | "ellipsis-end")[] = [1]

	if (start > 2) {
		items.push("ellipsis-start")
	}

	for (let p = start; p <= end; p++) {
		items.push(p)
	}

	if (end < lastPage - 1) {
		items.push("ellipsis-end")
	}
	items.push(lastPage)
	return items
}

export default function Pagination({
	lastPage,
	value,
	setParam,
}: TablePaginationProps) {
	const currentPage = value ? Math.min(Math.max(value, 1), lastPage) : 1
	const paginationItems = getPaginationItems(currentPage, lastPage)

	function goToPage(page: number) {
		setParam({ page: page })
	}

	function nextPage() {
		if (lastPage < 1 || currentPage >= lastPage) {
			return
		}
		goToPage(currentPage + 1)
	}

	function prevPage() {
		if (lastPage < 1 || currentPage <= 1) {
			return
		}
		goToPage(currentPage - 1)
	}

	return (
		<BasePagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious onClick={prevPage} />
				</PaginationItem>
				{paginationItems.map((item) =>
					item === "ellipsis-start" || item === "ellipsis-end" ? (
						<PaginationItem key={item}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						<PaginationItem key={item}>
							<PaginationLink
								onClick={() => goToPage(item)}
								isActive={item === currentPage}
							>
								{item}
							</PaginationLink>
						</PaginationItem>
					),
				)}
				<PaginationItem>
					<PaginationNext onClick={nextPage} />
				</PaginationItem>
			</PaginationContent>
		</BasePagination>
	)
}
