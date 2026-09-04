import type * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { twMerge } from "tailwind-merge"
import { Button } from "@/presentation/components/ui/Button"
import { XIcon } from "lucide-react"

function Drawer({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot="drawer-overlay"
			className={twMerge(
				"fixed inset-0 isolate z-50 bg-black/50 duration-200 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
				className,
			)}
			{...props}
		/>
	)
}

function DrawerContent({
	className,
	children,
	showCloseButton = true,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	showCloseButton?: boolean
}) {
	return (
		<DialogPrimitive.Portal data-slot="drawer-portal">
			<DrawerOverlay />
			<DialogPrimitive.Content
				data-slot="drawer-content"
				className={twMerge(
					"fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col overflow-hidden border-l border-zinc-200 bg-white text-zinc-900 shadow-xl duration-200 outline-none sm:max-w-lg data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right",
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close data-slot="drawer-close" asChild>
						<Button
							variant="ghost"
							className="absolute top-4 right-4"
							size="icon-sm"
						>
							<XIcon />
							<span className="sr-only">Fechar</span>
						</Button>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	)
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="drawer-header"
			className={twMerge(
				"flex shrink-0 flex-col gap-3 border-b border-zinc-200 px-6 py-5 pr-14",
				className,
			)}
			{...props}
		/>
	)
}

function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="drawer-body"
			className={twMerge(
				"flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5",
				className,
			)}
			{...props}
		/>
	)
}

function DrawerTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot="drawer-title"
			className={twMerge("text-xl leading-tight font-semibold", className)}
			{...props}
		/>
	)
}

function DrawerDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="drawer-description"
			className={twMerge("text-sm text-zinc-500", className)}
			{...props}
		/>
	)
}

export {
	Drawer,
	DrawerBody,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerOverlay,
	DrawerTitle,
	DrawerTrigger,
}
