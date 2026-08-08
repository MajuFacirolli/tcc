import { Label as LabelPrimitive } from "radix-ui"
import { twMerge } from "tailwind-merge"

export const Label = ({
	className,
	...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) => (
	<LabelPrimitive.Root
		data-slot="label"
		className={twMerge(
			"flex items-center gap-2 text-sm leading-none font-medium text-zinc-700 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
			className,
		)}
		{...props}
	/>
)
