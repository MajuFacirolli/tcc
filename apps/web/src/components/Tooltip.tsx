import { twMerge } from "tailwind-merge"

interface ITooltipProps {
	label: string
}

export const Tooltip = ({ label }: ITooltipProps) => {
	return (
		<span
			className={twMerge(
				"pointer-events-none absolute left-full ml-2 p-1.5 rounded-lg text-xs font-semibold text-red-800 bg-white",
				"shadow-sm whitespace-nowrap opacity-0 invisible -translate-x-2",
				"group-hover:opacity-100 group-hover:translate-x-0 group-hover:visible transition-all duration-200 ease-out",
			)}
		>
			{label}
		</span>
	)
}
