import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import { UserRoundX, UsersRound } from "lucide-react"
import { twMerge } from "tailwind-merge"

interface IEligibleDonorsProps {
	bloodType: BloodTypeEnum
	count?: number
	isLoading: boolean
}

/**
 * The audience the campaign would reach. It sits right under the blood type
 * because that choice is what determines it — and because a count of zero means
 * the campaign is created already closed, with no e-mail sent.
 */
export const EligibleDonors = ({
	bloodType,
	count,
	isLoading,
}: IEligibleDonorsProps) => {
	const isEmpty = count === 0

	return (
		<div
			aria-live="polite"
			className={twMerge(
				"flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors duration-150",
				isLoading && "border-zinc-200 bg-zinc-50",
				!isLoading && isEmpty && "border-yellow-600/20 bg-yellow-400/10",
				!isLoading && !isEmpty && "border-green-500/20 bg-green-500/10",
			)}
		>
			<span
				className={twMerge(
					"flex size-9 shrink-0 items-center justify-center rounded-full",
					isLoading && "bg-zinc-200/60 text-zinc-400",
					!isLoading && isEmpty && "bg-yellow-400/20 text-yellow-700",
					!isLoading && !isEmpty && "bg-green-500/15 text-green-800",
				)}
			>
				{isEmpty && !isLoading ? (
					<UserRoundX className="size-5" />
				) : (
					<UsersRound className="size-5" />
				)}
			</span>

			{isLoading || count === undefined ? (
				<div className="flex flex-col gap-1.5">
					<div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
					<div className="h-3 w-44 animate-pulse rounded bg-zinc-200" />
				</div>
			) : (
				<div className="flex flex-col">
					<p
						className={twMerge(
							"text-base font-semibold leading-tight tabular-nums",
							isEmpty ? "text-yellow-700" : "text-green-800",
						)}
					>
						{isEmpty
							? "Nenhum doador está elegível"
							: `${count.toLocaleString("pt-BR")} ${
									count === 1
										? "doador está elegível"
										: "doadores estão elegíveis"
								}`}
					</p>
					<p
						className={twMerge(
							"text-xs",
							isEmpty ? "text-yellow-700/80" : "text-green-800/70",
						)}
					>
						{isEmpty
							? `Nenhum e-mail será disparado para o tipo ${bloodType}`
							: `Receberão esta campanha para o tipo ${bloodType}`}
					</p>
				</div>
			)}
		</div>
	)
}
