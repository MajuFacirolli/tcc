import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { twMerge } from "tailwind-merge"

export const Accordion = ({
	className,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) => (
	<AccordionPrimitive.Root
		className={twMerge("flex w-full flex-col", className)}
		{...props}
	/>
)

export const AccordionItem = ({
	className,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) => (
	<AccordionPrimitive.Item
		className={twMerge("not-last:border-b border-zinc-200", className)}
		{...props}
	/>
)

export const AccordionTrigger = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) => (
	<AccordionPrimitive.Header className="flex">
		<AccordionPrimitive.Trigger
			className={twMerge(
				"group/trigger relative flex flex-1 items-start justify-between rounded-md border border-transparent py-4 text-left text-sm font-medium transition-all outline-none hover:cursor-pointer focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			{...props}
		>
			{children}
			<ChevronDownIcon className="ml-auto size-4 shrink-0 text-muted-foreground pointer-events-none group-aria-expanded/trigger:hidden" />
			<ChevronUpIcon className="ml-auto size-4 shrink-0 text-muted-foreground pointer-events-none hidden group-aria-expanded/trigger:inline" />
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
)

export const AccordionContent = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) => (
	<AccordionPrimitive.Content
		className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
		{...props}
	>
		<div className={twMerge("pt-0 pb-4", className)}>{children}</div>
	</AccordionPrimitive.Content>
)
