import { twMerge } from "tailwind-merge"

export const Textarea = ({
	className,
	...props
}: React.ComponentProps<"textarea">) => (
	<textarea
		data-slot="textarea"
		className={twMerge(
			"flex field-sizing-content min-h-16 w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 transition-colors duration-150 outline-none placeholder:text-zinc-400 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-red-800 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400 aria-invalid:focus-visible:ring-red-400",
			className,
		)}
		{...props}
	/>
)
