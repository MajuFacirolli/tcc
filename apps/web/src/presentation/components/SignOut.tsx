import { Loader, LogOut } from "lucide-react"
import { Tooltip } from "./ui/Tooltip"
import { twMerge } from "tailwind-merge"
import { useRouter } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { PagesEnum } from "../enums/PagesEnum"
import { createSignOutCommand } from "@/factories/createSignOutCommand"
import { useTransition } from "react"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/Dialog"
import { Button } from "./ui/Button"

const signOutCommand = createSignOutCommand()

export const SignOut = () => {
	const [isLoading, startTransition] = useTransition()

	const router = useRouter()
	const queryClient = useQueryClient()

	function handleLogout() {
		startTransition(async () => {
			const response = await signOutCommand.execute()

			if (response.isLeft()) return

			queryClient.clear()
			router.navigate({ to: PagesEnum.LOGIN })
		})
	}

	return (
		<Dialog>
			<DialogTrigger
				aria-label="Sair"
				className={twMerge(
					"group flex items-center justify-center gap-3 p-2.5 rounded-lg text-sm font-medium text-zinc-500 cursor-pointer",
					"hover:text-red-800 hover:bg-red-50 transition-colors duration-150",
					"disabled:opacity-50 disabled:pointer-events-none",
				)}
			>
				<LogOut className="size-4.5" />
				<Tooltip label="Sair" />
			</DialogTrigger>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Sair</DialogTitle>
					<DialogDescription>Tem certeza que deseja sair?</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="ghost">Cancelar</Button>
					</DialogClose>
					<Button type="submit" onClick={handleLogout}>
						Sair
						{isLoading && <Loader className="animate-spin" />}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
