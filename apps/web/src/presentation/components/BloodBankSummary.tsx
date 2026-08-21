import { Link } from "@tanstack/react-router"
import { ArrowRight, Megaphone } from "lucide-react"
import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import { Badge } from "@/presentation/components/ui/Badge"
import { BLOOD_BANK_STATUS_LABELS } from "@/presentation/data/bloodBankStatusLabels"
import { BloodBankStatusEnum } from "@/presentation/enums/BloodBankStatusEnum"
import { PagesEnum } from "@/presentation/enums/PagesEnum"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/Table"
import { useBloodBankSummary } from "../hooks/useBloodBankSummary"
import { BloodBankSummarySkeleton } from "./skeletons/BloodBankSummarySkeleton"

const badgeVariantByStatus: Record<
	BloodBankStatusEnum,
	ComponentProps<typeof Badge>["variant"]
> = {
	[BloodBankStatusEnum.STABLE]: "success",
	[BloodBankStatusEnum.WARNING]: "warning",
	[BloodBankStatusEnum.CRITICAL]: "destructive",
}

export const BloodBankSummary = () => {
	const { bloodBankSummary, error, isFetching, isLoading } =
		useBloodBankSummary()

	const hasData = !!bloodBankSummary?.length

	return (
		<section className="col-span-6 flex flex-col gap-6">
			<div className="w-full flex items-center justify-between">
				<h3 className="typography-overline">Banco de sangue</h3>
				<Link
					to={PagesEnum.BLOOD_BANK}
					className="uppercase text-xs flex items-center gap-1 text-red-800 hover:text-red-700 transition-all duration-150"
				>
					Gerenciar
					<ArrowRight className="size-4" />
				</Link>
			</div>

			<Table>
				<TableHeader>
					<TableRow className="bg-zinc-100">
						<TableHead className="w-20">Tipo</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Ação</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody
					data-fetching={isFetching}
					aria-busy={isFetching}
					className="bg-white"
				>
					{isLoading && <BloodBankSummarySkeleton />}

					{!isLoading && error && (
						<TableRow>
							<TableCell colSpan={3} className="py-16 text-center">
								<p className="text-sm text-zinc-500">
									Não foi possível carregar o banco de sangue.
								</p>
							</TableCell>
						</TableRow>
					)}

					{!isLoading && !error && !hasData && (
						<TableRow>
							<TableCell colSpan={3} className="py-16 text-center">
								<p className="text-sm text-zinc-500">
									Ainda não há tipos sanguíneos cadastrados
								</p>
							</TableCell>
						</TableRow>
					)}

					{!isLoading &&
						!error &&
						hasData &&
						bloodBankSummary.map((item) => (
							<TableRow
								key={item.type}
								className="transition-opacity duration-150 in-data-[fetching=true]:opacity-60"
							>
								<TableCell className="font-bold text-base">
									{item.type}
								</TableCell>
								<TableCell>
									<Badge variant={badgeVariantByStatus[item.status]}>
										{BLOOD_BANK_STATUS_LABELS[item.status]}
									</Badge>
								</TableCell>
								<TableCell className="text-right flex justify-end">
									<Link
										to={PagesEnum.NEW_CAMPAIGN}
										search={{ bloodType: item.type }}
										className={twMerge(
											"group flex items-center justify-center gap-3 p-2.5 rounded-lg text-sm font-medium text-red-800",
											"hover:bg-red-50 transition-colors duration-150 cursor-pointer",
											"[&.active]:bg-red-800 [&.active]:text-white",
										)}
									>
										<Megaphone className="size-4" />
									</Link>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</section>
	)
}
