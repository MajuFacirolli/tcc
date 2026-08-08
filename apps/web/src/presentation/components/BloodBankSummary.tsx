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

const mockBloodBankSummary = [
	{ type: "A+", status: BloodBankStatusEnum.STABLE },
	{ type: "A-", status: BloodBankStatusEnum.STABLE },
	{ type: "B+", status: BloodBankStatusEnum.ATTENTION },
	{ type: "B-", status: BloodBankStatusEnum.CRITICAL },
	{ type: "AB+", status: BloodBankStatusEnum.ATTENTION },
	{ type: "AB-", status: BloodBankStatusEnum.STABLE },
	{ type: "O+", status: BloodBankStatusEnum.CRITICAL },
	{ type: "O-", status: BloodBankStatusEnum.CRITICAL },
]

const badgeVariantByStatus: Record<
	BloodBankStatusEnum,
	ComponentProps<typeof Badge>["variant"]
> = {
	[BloodBankStatusEnum.STABLE]: "success",
	[BloodBankStatusEnum.ATTENTION]: "warning",
	[BloodBankStatusEnum.CRITICAL]: "destructive",
}

export const BloodBankSummary = () => {
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
				<TableBody>
					{mockBloodBankSummary.map((item) => (
						<TableRow key={item.type}>
							<TableCell className="font-bold text-base">{item.type}</TableCell>
							<TableCell>
								<Badge variant={badgeVariantByStatus[item.status]}>
									{BLOOD_BANK_STATUS_LABELS[item.status]}
								</Badge>
							</TableCell>
							<TableCell className="text-right flex justify-end">
								<button
									type="button"
									className={twMerge(
										"group flex items-center justify-center gap-3 p-2.5 rounded-lg text-sm font-medium text-red-800",
										"hover:bg-red-50 transition-colors duration-150 cursor-pointer",
										"[&.active]:bg-red-800 [&.active]:text-white",
									)}
								>
									<Megaphone className="size-4" />
								</button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</section>
	)
}
