import type { LucideProps } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { tv } from "tailwind-variants"
import type { TTitleLevel } from "@/presentation/@types/TTitleLevel"

interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardRoot = ({ className, children, ...props }: ICardProps) => (
	<div
		className={twMerge(
			"w-full bg-white rounded-lg shadow-sm px-6 py-4 flex flex-col gap-4",
			className,
		)}
		{...props}
	>
		{children}
	</div>
)

const cardIconVariants = tv({
	slots: {
		container:
			"bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0",
		icon: "text-zinc-900",
	},
	variants: {
		size: {
			sm: { container: "rounded-md size-7", icon: "size-4" },
			lg: { container: "rounded-lg	 size-11", icon: "size-6" },
		},
		color: {
			default: {},
			accent: {
				container: "bg-red-50 border-none",
				icon: "text-red-800",
			},
		},
	},
	defaultVariants: {
		size: "sm",
		color: "default",
	},
})

interface ICardIconProps extends React.HTMLAttributes<HTMLSpanElement> {
	Icon: React.ForwardRefExoticComponent<LucideProps>
	size?: "sm" | "lg"
	color?: "default" | "accent"
}

const CardIcon = ({
	Icon,
	size = "sm",
	color = "default",
	className,
	...props
}: ICardIconProps) => {
	const { container, icon } = cardIconVariants({ size, color })
	return (
		<span className={twMerge(container(), className)} {...props}>
			<Icon className={icon()} />
		</span>
	)
}

interface ICardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	level?: TTitleLevel
}

const CardTitle = ({
	level: Tag = "h3",
	className,
	children,
	...props
}: ICardTitleProps) => (
	<Tag
		className={twMerge(
			"text-base font-semibold flex items-center gap-2",
			className,
		)}
		{...props}
	>
		{children}
	</Tag>
)

interface ICardDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = ({
	className,
	children,
	...props
}: ICardDescriptionProps) => (
	<p
		className={twMerge("text-sm text-zinc-500 leading-none", className)}
		{...props}
	>
		{children}
	</p>
)

export const Card = Object.assign(CardRoot, {
	Title: CardTitle,
	Description: CardDescription,
	Icon: CardIcon,
})
