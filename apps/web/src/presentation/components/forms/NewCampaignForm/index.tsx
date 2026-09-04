import { BLOOD_TYPES } from "@/domain/enums/BloodTypeEnum"
import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"
import { Field, FieldDescription, FieldError, FieldLabel } from "../../ui/Field"
import { Input } from "../../ui/Input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/Select"
import { Textarea } from "../../ui/Textarea"
import { Button } from "../../ui/Button"
import { Loader, Send } from "lucide-react"
import { useNewCampaignForm } from "@/presentation/hooks/useNewCampaignForm"
import { CampaignKindField } from "./CampaignKindField"
import { EligibleDonors } from "./EligibleDonors"
import { Controller } from "react-hook-form"

interface INewCampaignFormProps {
	bloodType?: BloodTypeEnum
}

export const NewCampaignForm = ({ bloodType }: INewCampaignFormProps) => {
	const {
		register,
		control,
		handleSubmit,
		errors,
		isSubmitting,
		handleBloodTypeChange,
		handleKindChange,
		isSegmented,
		eligibleDonorsCount,
		isLoadingEligibleDonorsCount,
	} = useNewCampaignForm({ bloodType })

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
					placeholder="Título da campanha"
					aria-invalid={!!errors.title}
				/>
				<FieldError errors={[errors.title]} />
			</Field>

			<Controller
				control={control}
				name="kind"
				render={({ field, fieldState }) => (
					<Field className="gap-1.5">
						<CampaignKindField
							value={field.value}
							onChange={handleKindChange}
						/>
						<FieldError errors={[fieldState.error]} />
					</Field>
				)}
			/>

			{isSegmented && (
				<Controller
					control={control}
					name="bloodType"
					render={({ field, fieldState }) => (
						<Field className="gap-1.5">
							<div className="flex items-center justify-between gap-3">
								<FieldLabel htmlFor="bloodType">Tipo sanguíneo</FieldLabel>
								{field.value && (
									<EligibleDonors
										count={eligibleDonorsCount}
										isLoading={isLoadingEligibleDonorsCount}
									/>
								)}
							</div>
							<Select
								value={field.value ?? undefined}
								onValueChange={handleBloodTypeChange}
							>
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
			)}

			<Field className="gap-1.5">
				<FieldLabel htmlFor="message">Conteúdo da mensagem</FieldLabel>
				<FieldDescription>
					Dica: Use [Nome] para personalizar a mensagem com o nome do doador
				</FieldDescription>
				<Textarea
					{...register("message")}
					id="message"
					placeholder="Mensagem"
					aria-invalid={!!errors.message}
					className="min-h-40"
				/>
				<FieldError errors={[errors.message]} />
			</Field>

			<div className="w-full flex items-center justify-end">
				<Button type="submit">
					Disparar agora
					{isSubmitting ? <Loader className="animate-spin" /> : <Send />}
				</Button>
			</div>
		</form>
	)
}
