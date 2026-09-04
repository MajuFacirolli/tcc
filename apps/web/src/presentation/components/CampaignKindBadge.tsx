import { Radio, UsersRound } from "lucide-react"
import { twMerge } from "tailwind-merge"
import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"
import { CAMPAIGN_KIND_LABELS } from "../data/campaignKindLabels"

const KIND_ICONS = {
	[CampaignKindEnum.GENERIC]: Radio,
	[CampaignKindEnum.SEGMENTED]: UsersRound,
} as const

const KIND_STYLES = {
	[CampaignKindEnum.GENERIC]: "border-zinc-300 bg-zinc-100 text-zinc-600",
	[CampaignKindEnum.SEGMENTED]: "border-red-200 bg-red-50 text-red-800",
} as const

interface ICampaignKindBadgeProps {
	kind: CampaignKindEnum
	bloodType: BloodTypeEnum | null
	/** Hides the icon where the row is already dense. */
	showIcon?: boolean
	className?: string
}

/**
 * The arm a campaign belongs to. A segmented campaign carries the blood type it
 * targeted, because the pair is what identifies the audience; a generic one has no
 * blood type by construction, so none is shown.
 */
export const CampaignKindBadge = ({
	kind,
	bloodType,
	showIcon = true,
	className,
}: ICampaignKindBadgeProps) => {
	const Icon = KIND_ICONS[kind]
	const isSegmented = kind === CampaignKindEnum.SEGMENTED

	return (
		<span
			className={twMerge(
				"inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
				KIND_STYLES[kind],
				className,
			)}
		>
			{showIcon && <Icon className="size-3 shrink-0" aria-hidden="true" />}
			{CAMPAIGN_KIND_LABELS[kind]}
			{isSegmented && bloodType && (
				<>
					<span aria-hidden="true" className="opacity-40">
						·
					</span>
					<span className="tabular-nums">{bloodType}</span>
				</>
			)}
		</span>
	)
}
