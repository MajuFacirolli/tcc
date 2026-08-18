import { twMerge } from "tailwind-merge"
import { tv, type VariantProps } from "tailwind-variants"

const tooltipVariants = tv({
	base: "pointer-events-none absolute p-1.5 rounded-lg text-xs font-semibold text-red-800 bg-white shadow-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out",
	variants: {
		direction: {
			right: "left-full ml-2 -translate-x-2 group-hover:translate-x-0",
			left: "right-full mr-2 translate-x-2 group-hover:translate-x-0",
			top: "bottom-full mb-2 translate-y-2 group-hover:translate-y-0",
			bottom: "top-full mt-2 -translate-y-2 group-hover:translate-y-0",
		},
	},
	defaultVariants: {
		direction: "right",
	},
})

interface ITooltipProps extends VariantProps<typeof tooltipVariants> {
	label: string
	className?: string
}

export const Tooltip = ({
	label,
	direction = "right",
	className,
}: ITooltipProps) => {
	return (
		<span className={twMerge(tooltipVariants({ direction }), className)}>
			{label}
		</span>
	)
}
