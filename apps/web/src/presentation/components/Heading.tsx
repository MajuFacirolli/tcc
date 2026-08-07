import { twMerge } from "tailwind-merge"
import type { TTitleLevel } from "@/presentation/@types/TTitleLevel"

interface IHeadingProps extends React.HTMLAttributes<HTMLDivElement> {}

const HeadingRoot = ({ className, children, ...props }: IHeadingProps) => (
	<div className={twMerge("w-full flex flex-col gap-1", className)} {...props}>
		{children}
	</div>
)

interface IHeadingOverlineProps extends React.HTMLAttributes<HTMLSpanElement> {}

const HeadingOverline = ({
	children,
	className,
	...props
}: IHeadingOverlineProps) => (
	<span className={twMerge("typography-overline", className)} {...props}>
		{children}
	</span>
)

interface IHeadingTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	level?: TTitleLevel
}

const HeadingTitle = ({
	level: Tag = "h2",
	children,
	className,
	...props
}: IHeadingTitleProps) => (
	<Tag className={twMerge("text-2xl font-bold", className)} {...props}>
		{children}
	</Tag>
)

interface IHeadingDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {}

const HeadingDescription = ({
	children,
	className,
	...props
}: IHeadingDescriptionProps) => (
	<p className={twMerge("text-sm", className)} {...props}>
		{children}
	</p>
)

export const Heading = Object.assign(HeadingRoot, {
	Overline: HeadingOverline,
	Title: HeadingTitle,
	Description: HeadingDescription,
})
