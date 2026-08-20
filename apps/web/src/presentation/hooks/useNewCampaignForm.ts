import { createFormControl, useForm } from "react-hook-form"
import {
	newCampaignSchema,
	type NewCampaignSchema,
} from "../schemas/newCampaignSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCreateCampaignCommand } from "@/factories/createCreateCampaignCommand"
import { useErrors } from "./useErrors"
import toast from "react-hot-toast"
import { useNavigate } from "@tanstack/react-router"
import { PagesEnum } from "../enums/PagesEnum"
import type { BloodTypeEnum } from "@/domain/enums/BloodTypeEnum"

const createCampaignCommand = createCreateCampaignCommand()

export const newCampaignFormControl = createFormControl({
	resolver: zodResolver(newCampaignSchema),
	defaultValues: {
		title: "",
		message: "",
		bloodType: undefined,
	},
})

interface IUseNewCampaignFormProps {
	bloodType?: BloodTypeEnum
}

export const useNewCampaignForm = ({ bloodType }: IUseNewCampaignFormProps) => {
	const {
		register,
		control,
		handleSubmit,
		formState: { isSubmitting, errors },
		setError,
		reset,
	} = useForm<NewCampaignSchema>({
		formControl: newCampaignFormControl,
		defaultValues: {
			bloodType,
		},
	})

	const { handleError } = useErrors({
		setError,
		fields: ["title", "message", "bloodType"],
	})

	const navigate = useNavigate()

	async function handleCreateNewCampaign(data: NewCampaignSchema) {
		const response = await createCampaignCommand.execute({
			title: data.title,
			message: data.message,
			bloodType: data.bloodType,
		})

		if (response.isLeft()) {
			handleError(response.value)
			return
		}

		reset()
		toast.success("Campanha criada com sucesso")
		navigate({ to: PagesEnum.CAMPAIGNS })
	}

	return {
		handleSubmit: handleSubmit(handleCreateNewCampaign),
		register,
		control,
		isSubmitting,
		errors,
	}
}
