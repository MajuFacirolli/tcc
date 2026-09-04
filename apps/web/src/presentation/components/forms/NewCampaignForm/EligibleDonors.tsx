import { twMerge } from "tailwind-merge"

interface IEligibleDonorsProps {
	count?: number
	isLoading: boolean
}

export const EligibleDonors = ({ count, isLoading }: IEligibleDonorsProps) => {
	const isPending = isLoading || count === undefined
	const isEmpty = count === 0

	return (
		<p
			aria-live="polite"
			className={twMerge(
				"text-sm tabular-nums",
				isEmpty && !isPending ? "text-yellow-700" : "text-zinc-500",
			)}
		>
			{isPending && (
				<span
					aria-hidden="true"
					className="block h-4 w-24 animate-pulse rounded bg-zinc-200"
				/>
			)}

			{!isPending && isEmpty && "Nenhum elegível — não será enviada"}

			{!isPending && !isEmpty && (
				<>
					<span className="font-semibold text-zinc-900">
						{count.toLocaleString("pt-BR")}
					</span>{" "}
					{count === 1 ? "doador elegível" : "doadores elegíveis"}
				</>
			)}
		</p>
	)
}
