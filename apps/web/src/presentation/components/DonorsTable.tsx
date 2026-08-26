import { Badge } from "./ui/Badge"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/Table"
import { Button } from "./ui/Button"
import Pagination from "./ui/Pagination"
import { DonorsFilters } from "./DonorsFilters"
import { DonorsTableSkeleton } from "./skeletons/DonorsTableSkeleton"
import { useDonors } from "../hooks/useDonors"
import { useDonorsFilters } from "../hooks/useDonorsFilters"
import { SEX_LABELS } from "../data/sexLabels"
import { formatShortDate } from "@/utils/formatDate"

const COLUMNS_COUNT = 6

export const DonorsTable = () => {
	const { filters, setFilters, clearFilters, hasFilters } = useDonorsFilters()

	const { donors, total, page, lastPage, isLoading, isFetching, error } =
		useDonors(filters)

	const hasData = !!donors?.length

	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center justify-between gap-2">
				<DonorsFilters
					filters={filters}
					setFilters={setFilters}
					clearFilters={clearFilters}
					hasFilters={hasFilters}
				/>

				{!isLoading && !error && (
					<p className="text-sm text-zinc-500 shrink-0">
						{total === 1 ? "1 doador" : `${total} doadores`}
					</p>
				)}
			</div>

			<Table>
				<TableHeader>
					<TableRow className="bg-zinc-100">
						<TableHead>Nome</TableHead>
						<TableHead>E-mail</TableHead>
						<TableHead className="w-20">Tipo</TableHead>
						<TableHead className="w-28">Sexo</TableHead>
						<TableHead className="w-36">Última doação</TableHead>
						<TableHead className="w-32">Situação</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody
					data-fetching={isFetching}
					aria-busy={isFetching}
					className="bg-white"
				>
					{isLoading && <DonorsTableSkeleton />}

					{!isLoading && error && (
						<TableRow>
							<TableCell colSpan={COLUMNS_COUNT} className="py-16 text-center">
								<p className="text-sm text-zinc-500">
									Não foi possível carregar os doadores.
								</p>
							</TableCell>
						</TableRow>
					)}

					{!isLoading && !error && !hasData && (
						<TableRow>
							<TableCell colSpan={COLUMNS_COUNT} className="py-16 text-center">
								<div className="flex flex-col items-center gap-3">
									<p className="text-sm text-zinc-500">
										{hasFilters
											? "Nenhum doador corresponde aos filtros selecionados."
											: "Ainda não há doadores cadastrados"}
									</p>
									{hasFilters && (
										<Button variant="outline" size="sm" onClick={clearFilters}>
											Limpar filtros
										</Button>
									)}
								</div>
							</TableCell>
						</TableRow>
					)}

					{!isLoading &&
						!error &&
						hasData &&
						donors.map((donor) => (
							<TableRow
								key={donor.id}
								className="transition-opacity duration-150 in-data-[fetching=true]:opacity-60"
							>
								<TableCell className="font-medium">{donor.name}</TableCell>
								<TableCell className="text-zinc-600">{donor.email}</TableCell>
								<TableCell className="font-bold text-base">
									{donor.bloodType}
								</TableCell>
								<TableCell>{SEX_LABELS[donor.sex]}</TableCell>
								<TableCell>
									{donor.lastDonationDate ? (
										<time dateTime={donor.lastDonationDate.toISOString()}>
											{formatShortDate(donor.lastDonationDate)}
										</time>
									) : (
										<span className="text-zinc-500">Nunca doou</span>
									)}
								</TableCell>
								<TableCell>
									<Badge variant={donor.isEligible ? "success" : "ghost"}>
										{donor.isEligible ? "Elegível" : "Em intervalo"}
									</Badge>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>

			{!isLoading && !error && lastPage > 1 && (
				<Pagination value={page} lastPage={lastPage} setParam={setFilters} />
			)}
		</section>
	)
}
