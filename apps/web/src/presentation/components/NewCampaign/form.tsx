import { BLOOD_TYPES } from "@/domain/enums/BloodTypeEnum"
import { Field, FieldError, FieldLabel } from "../ui/Field"
import { Input } from "../ui/Input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/Select"
import { Textarea } from "../ui/Textarea"
import { Button } from "../ui/Button"
import { Loader, Send } from "lucide-react"
import { DialogClose } from "../ui/Dialog"
import { useNewCampaignForm } from "@/presentation/hooks/useNewCampaignForm"
import { Controller } from "react-hook-form"

interface INewCampaignFormProps {
	onSuccess?: () => void
}

export const NewCampaignForm = ({ onSuccess }: INewCampaignFormProps) => {
	const { register, control, handleSubmit, errors, isSubmitting } =
		useNewCampaignForm({ onSuccess })

	return (
		<form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
			<FieldError
				errors={errors.root ? [errors.root] : []}
				className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-center"
			/>

			<Field className="gap-1.5">
				<FieldLabel htmlFor="title">Título da campanha</FieldLabel>
				<Input
					{...register("title")}
					id="title"
					placeholder="Ex: Urgência O-"
					aria-invalid={!!errors.title}
				/>
				<FieldError errors={[errors.title]} />
			</Field>

			<Controller
				control={control}
				name="bloodType"
				render={({ field, fieldState }) => (
					<Field className="gap-1.5">
						<FieldLabel htmlFor="bloodType">Tipo sanguíneo</FieldLabel>
						<Select value={field.value} onValueChange={field.onChange}>
							<SelectTrigger
								aria-label="Tipo sanguíneo"
								className="w-full"
								aria-invalid={!!fieldState.error}
							>
								<SelectValue placeholder="Tipo sanguíneo" />
							</SelectTrigger>
							<SelectContent>
								{BLOOD_TYPES.map((bloodType) => (
									<SelectItem key={bloodType} value={bloodType}>
										{bloodType}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError errors={[fieldState.error]} />
					</Field>
				)}
			/>

			<Field className="gap-1.5">
				<FieldLabel htmlFor="message">Conteúdo da mensagem</FieldLabel>
				<Textarea
					{...register("message")}
					id="message"
					placeholder="Dica: Use [Nome] para personalizar a mensagem com o nome do doador. O link de confirmação será adicionado automaticamente ao final."
					aria-invalid={!!errors.message}
					className="min-h-40"
				/>
				<FieldError errors={[errors.message]} />
			</Field>

			<div className="w-full flex items-center justify-end">
				<DialogClose asChild>
					<Button variant="ghost" type="button" disabled={isSubmitting}>
						Cancelar
					</Button>
				</DialogClose>
				<Button type="submit">
					Disparar agora
					{isSubmitting ? <Loader className="animate-spin" /> : <Send />}
				</Button>
			</div>
		</form>
	)
}
