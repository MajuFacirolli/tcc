import { useMemo } from "react"
import { twMerge } from "tailwind-merge"
import { tv, type VariantProps } from "tailwind-variants"
import { Label } from "@/presentation/components/ui/Label"
import { Separator } from "@/presentation/components/ui/Separator"

export const FieldSet = ({
	className,
	...props
}: React.ComponentProps<"fieldset">) => (
	<fieldset
		data-slot="field-set"
		className={twMerge(
			"flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
			className,
		)}
		{...props}
	/>
)

export const FieldLegend = ({
	className,
	variant = "legend",
	...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) => (
	<legend
		data-slot="field-legend"
		data-variant={variant}
		className={twMerge(
			"mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
			className,
		)}
		{...props}
	/>
)

export const FieldGroup = ({
	className,
	...props
}: React.ComponentProps<"div">) => (
	<div
		data-slot="field-group"
		className={twMerge(
			"group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
			className,
		)}
		{...props}
	/>
)

const fieldVariants = tv({
	base: "group/field flex w-full gap-3 data-[invalid=true]:text-red-700",
	variants: {
		orientation: {
			vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
			horizontal:
				"flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
			responsive:
				"flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
		},
	},
	defaultVariants: {
		orientation: "vertical",
	},
})

export const Field = ({
	className,
	orientation = "vertical",
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) => (
	<div
		role="group"
		data-slot="field"
		data-orientation={orientation}
		className={twMerge(fieldVariants({ orientation }), className)}
		{...props}
	/>
)

export const FieldContent = ({
	className,
	...props
}: React.ComponentProps<"div">) => (
	<div
		data-slot="field-content"
		className={twMerge(
			"group/field-content flex flex-1 flex-col gap-1 leading-snug",
			className,
		)}
		{...props}
	/>
)

export const FieldLabel = ({
	className,
	...props
}: React.ComponentProps<typeof Label>) => (
	<Label
		data-slot="field-label"
		className={twMerge(
			"group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border *:data-[slot=field]:p-3 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10",
			"has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
			className,
		)}
		{...props}
	/>
)

export const FieldTitle = ({
	className,
	...props
}: React.ComponentProps<"div">) => (
	<div
		data-slot="field-label"
		className={twMerge(
			"flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50",
			className,
		)}
		{...props}
	/>
)

export const FieldDescription = ({
	className,
	...props
}: React.ComponentProps<"p">) => (
	<p
		data-slot="field-description"
		className={twMerge(
			"text-left text-sm leading-normal font-normal text-zinc-500 group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
			"last:mt-0 nth-last-2:-mt-1",
			"[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
			className,
		)}
		{...props}
	/>
)

export const FieldSeparator = ({
	children,
	className,
	...props
}: React.ComponentProps<"div">) => (
	<div
		data-slot="field-separator"
		data-content={!!children}
		className={twMerge(
			"relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
			className,
		)}
		{...props}
	>
		<Separator className="absolute inset-0 top-1/2" />
		{children && (
			<span
				className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
				data-slot="field-separator-content"
			>
				{children}
			</span>
		)}
	</div>
)

interface IFieldErrorProps extends React.ComponentProps<"div"> {
	errors?: Array<{ message?: string } | undefined>
}

export const FieldError = ({
	className,
	children,
	errors,
	...props
}: IFieldErrorProps) => {
	const content = useMemo(() => {
		if (children) {
			return children
		}

		if (!errors?.length) {
			return null
		}

		const uniqueErrors = [
			...new Map(errors.map((error) => [error?.message, error])).values(),
		]

		if (uniqueErrors.length === 1) {
			return uniqueErrors[0]?.message
		}

		return (
			<ul className="ml-4 flex list-disc flex-col gap-1">
				{uniqueErrors.map(
					(error) =>
						error?.message && <li key={error.message}>{error.message}</li>,
				)}
			</ul>
		)
	}, [children, errors])

	if (!content) {
		return null
	}

	return (
		<div
			role="alert"
			data-slot="field-error"
			className={twMerge("text-sm font-normal text-red-700", className)}
			{...props}
		>
			{content}
		</div>
	)
}
