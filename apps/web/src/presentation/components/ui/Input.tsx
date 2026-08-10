import { twMerge } from "tailwind-merge"

export const Input = ({
	className,
	type,
	...props
}: React.ComponentProps<"input">) => (
	<input
		type={type}
		data-slot="input"
		className={twMerge(
			"h-9 w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors duration-150 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-red-800 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400 aria-invalid:focus-visible:ring-red-400",
			className,
		)}
		{...props}
	/>
)
