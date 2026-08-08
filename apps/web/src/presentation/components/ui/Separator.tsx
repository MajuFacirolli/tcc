import { Separator as SeparatorPrimitive } from "radix-ui"
import { twMerge } from "tailwind-merge"

export const Separator = ({
	className,
	orientation = "horizontal",
	decorative = true,
	...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) => (
	<SeparatorPrimitive.Root
		data-slot="separator"
		decorative={decorative}
		orientation={orientation}
		className={twMerge(
			"shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
			className,
		)}
		{...props}
	/>
)
