import { Slot } from "radix-ui"
import { twMerge } from "tailwind-merge"
import { tv, type VariantProps } from "tailwind-variants"

const badgeVariants = tv({
	base: "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
	variants: {
		variant: {
			default:
				"bg-white text-red-800 [a]:hover:bg-red-800 [a]:hover:text-white",
			primary: "bg-red-800 text-white [a]:hover:bg-red-900",
			secondary: "bg-zinc-900 text-white",
			success: "bg-green-500/10 border border-green-500/20 text-green-900",
			warning: "bg-yellow-400/10 border border-yellow-600/20 text-yellow-600",
			destructive: "bg-red-500/10 border border-red-500/20 text-red-700",
		},
	},
	defaultVariants: {
		variant: "default",
	},
})

function Badge({
	className,
	variant = "default",
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot.Root : "span"

	return (
		<Comp
			data-slot="badge"
			data-variant={variant}
			className={twMerge(badgeVariants({ variant }), className)}
			{...props}
		/>
	)
}

export { Badge, badgeVariants }
