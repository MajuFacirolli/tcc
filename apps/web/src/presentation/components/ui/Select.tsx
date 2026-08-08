import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"
import { twMerge } from "tailwind-merge"

export const Select = (
	props: React.ComponentProps<typeof SelectPrimitive.Root>,
) => <SelectPrimitive.Root data-slot="select" {...props} />

export const SelectGroup = ({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) => (
	<SelectPrimitive.Group
		data-slot="select-group"
		className={twMerge("scroll-my-1 p-1", className)}
		{...props}
	/>
)

export const SelectValue = (
	props: React.ComponentProps<typeof SelectPrimitive.Value>,
) => <SelectPrimitive.Value data-slot="select-value" {...props} />

export const SelectTrigger = ({
	className,
	size = "default",
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
	size?: "sm" | "default"
}) => (
	<SelectPrimitive.Trigger
		data-slot="select-trigger"
		data-size={size}
		className={twMerge(
			"flex w-fit items-center justify-between gap-1.5 rounded-lg border border-zinc-200 bg-transparent py-2 pr-2 pl-3 text-sm text-zinc-900 whitespace-nowrap transition-colors duration-150 outline-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-red-800 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400 aria-invalid:focus-visible:ring-red-400 data-placeholder:text-zinc-400 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
			className,
		)}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon asChild>
			<ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
)

export const SelectScrollUpButton = ({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) => (
	<SelectPrimitive.ScrollUpButton
		data-slot="select-scroll-up-button"
		className={twMerge(
			"z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
			className,
		)}
		{...props}
	>
		<ChevronUpIcon />
	</SelectPrimitive.ScrollUpButton>
)

export const SelectScrollDownButton = ({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) => (
	<SelectPrimitive.ScrollDownButton
		data-slot="select-scroll-down-button"
		className={twMerge(
			"z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
			className,
		)}
		{...props}
	>
		<ChevronDownIcon />
	</SelectPrimitive.ScrollDownButton>
)

export const SelectContent = ({
	className,
	children,
	position = "item-aligned",
	align = "center",
	...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			data-slot="select-content"
			data-align-trigger={position === "item-aligned"}
			className={twMerge(
				"relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
				position === "popper" &&
					"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
				className,
			)}
			position={position}
			align={align}
			{...props}
		>
			<SelectScrollUpButton />
			<SelectPrimitive.Viewport
				data-position={position}
				className="data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)"
			>
				{children}
			</SelectPrimitive.Viewport>
			<SelectScrollDownButton />
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
)

export const SelectLabel = ({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) => (
	<SelectPrimitive.Label
		data-slot="select-label"
		className={twMerge("px-2 py-1.5 text-xs text-muted-foreground", className)}
		{...props}
	/>
)

export const SelectItem = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) => (
	<SelectPrimitive.Item
		data-slot="select-item"
		className={twMerge(
			"relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
			className,
		)}
		{...props}
	>
		<span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<CheckIcon className="pointer-events-none" />
			</SelectPrimitive.ItemIndicator>
		</span>
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
)

export const SelectSeparator = ({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) => (
	<SelectPrimitive.Separator
		data-slot="select-separator"
		className={twMerge(
			"pointer-events-none -mx-1 my-1 h-px bg-border",
			className,
		)}
		{...props}
	/>
)
