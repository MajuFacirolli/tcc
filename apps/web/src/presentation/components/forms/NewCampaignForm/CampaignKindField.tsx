import { Radio, Users, UsersRound } from "lucide-react"
import { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"
import {
	CAMPAIGN_KIND_DESCRIPTIONS,
	CAMPAIGN_KIND_LABELS,
} from "@/presentation/data/campaignKindLabels"
import { twMerge } from "tailwind-merge"

const OPTIONS = [
	{ kind: CampaignKindEnum.SEGMENTED, Icon: UsersRound },
	{ kind: CampaignKindEnum.GENERIC, Icon: Radio },
] as const

interface ICampaignKindFieldProps {
	value: CampaignKindEnum
	onChange: (kind: CampaignKindEnum) => void
}

export const CampaignKindField = ({
	value,
	onChange,
}: ICampaignKindFieldProps) => (
	<fieldset className="flex flex-col gap-1.5">
		<legend className="typography-label mb-1.5">Tipo de envio</legend>

		<div className="grid gap-3 sm:grid-cols-2">
			{OPTIONS.map(({ kind, Icon }) => {
				const isSelected = value === kind

				return (
					<label
						key={kind}
						className={twMerge(
							"flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors duration-150",
							isSelected
								? "border-red-800 bg-red-50"
								: "border-zinc-200 bg-white hover:border-zinc-300",
						)}
					>
						<input
							type="radio"
							name="kind"
							value={kind}
							checked={isSelected}
							onChange={() => onChange(kind)}
							className="sr-only"
						/>
						<span
							className={twMerge(
								"flex size-9 shrink-0 items-center justify-center rounded-lg",
								isSelected
									? "bg-red-800/10 text-red-800"
									: "bg-zinc-100 text-zinc-500",
							)}
						>
							<Icon className="size-5" />
						</span>
						<span className="flex flex-col gap-0.5">
							<span
								className={twMerge(
									"text-sm font-semibold leading-tight",
									isSelected ? "text-red-900" : "text-zinc-900",
								)}
							>
								{CAMPAIGN_KIND_LABELS[kind]}
							</span>
							<span className="text-xs text-zinc-500">
								{CAMPAIGN_KIND_DESCRIPTIONS[kind]}
							</span>
						</span>
					</label>
				)
			})}
		</div>

		<p className="flex items-center gap-1.5 text-xs text-zinc-500">
			<Users className="size-3.5 shrink-0" />
			As campanhas genéricas existem para servir de comparação nas métricas.
		</p>
	</fieldset>
)
