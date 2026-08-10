import { useState } from "react"
import { twMerge } from "tailwind-merge"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/Dialog"
import { Plus } from "lucide-react"
import { NewCampaignForm } from "./form"

export const NewCampaign = () => {
	const [open, setOpen] = useState(false)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button
					type="button"
					className={twMerge(
						"group flex items-center justify-center gap-3 p-2.5 rounded-lg text-sm font-medium bg-red-800 text-white",
						"hover:bg-red-900 cursor-pointer",
					)}
				>
					<Plus className="size-4.5" />
				</button>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-lg"
				onInteractOutside={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>Nova campanha</DialogTitle>
					<DialogDescription>
						Defina o título e público alvo da campanha, componha o texto que
						será enviado e dispare a comunicação
					</DialogDescription>
				</DialogHeader>

				<NewCampaignForm onSuccess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	)
}
