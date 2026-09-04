import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import { twMerge } from "tailwind-merge"

export const ToggleGroup = ({
	className,
	...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) => (
	<ToggleGroupPrimitive.Root
		className={twMerge(
			"inline-flex items-center gap-1 rounded-lg bg-zinc-100 p-1",
			className,
		)}
		{...props}
	/>
)

export const ToggleGroupItem = ({
	className,
	...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) => (
	<ToggleGroupPrimitive.Item
		className={twMerge(
			"rounded-md px-3 py-1.5 text-sm font-medium text-zinc-500 whitespace-nowrap",
			"transition-all duration-150 hover:text-zinc-900 hover:cursor-pointer",
			"outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
			"data-[state=on]:bg-white data-[state=on]:text-zinc-900 data-[state=on]:shadow-sm",
			className,
		)}
		{...props}
	/>
)
