import type { LucideProps } from "lucide-react"
import { twMerge } from "tailwind-merge"
import type { TTitleLevel } from "@/@types/TTitleLevel"

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

interface ICardIconProps extends React.HTMLAttributes<HTMLSpanElement> {
	Icon: React.ForwardRefExoticComponent<LucideProps>
}

const CardIcon = ({ Icon, children, ...props }: ICardIconProps) => (
	<span
		className="size-7 rounded-md bg-zinc-100 border border-zinc-200 flex items-center justify-center"
		{...props}
	>
		<Icon className="size-4 text-zinc-900" />
	</span>
)

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
	<p className={twMerge("text-sm text-zinc-500", className)} {...props}>
		{children}
	</p>
)

export const Card = Object.assign(CardRoot, {
	Title: CardTitle,
	Description: CardDescription,
	Icon: CardIcon,
})
