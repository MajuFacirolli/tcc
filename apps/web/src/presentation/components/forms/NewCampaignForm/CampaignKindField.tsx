import { Radio, UsersRound } from "lucide-react"
import { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"
import { CAMPAIGN_KIND_LABELS } from "@/presentation/data/campaignKindLabels"
import { twMerge } from "tailwind-merge"
import { FieldLabel } from "../../ui/Field"

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
		<FieldLabel>Tipo de envio</FieldLabel>

		<div className="grid gap-2 sm:grid-cols-2">
			{OPTIONS.map(({ kind, Icon }) => {
				const isSelected = value === kind

				return (
					<label
						key={kind}
						className={twMerge(
							"flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors duration-150",
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
						<span
							className={twMerge(
								"text-sm font-semibold leading-tight",
								isSelected ? "text-red-900" : "text-zinc-900",
							)}
						>
							{CAMPAIGN_KIND_LABELS[kind]}
						</span>
					</label>
				)
			})}
		</div>
	</fieldset>
)
