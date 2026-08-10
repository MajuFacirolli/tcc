import { useForm } from "react-hook-form"
import {
	newCampaignSchema,
	type NewCampaignSchema,
} from "../schemas/newCampaignSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCreateCampaignCommand } from "@/factories/createCreateCampaignCommand"
import { QUERY_KEYS } from "../data/queryKeys"
import { useErrors } from "./useErrors"
import { useRefetchQuery } from "./useRefetchQuery"
import toast from "react-hot-toast"

const createCampaignCommand = createCreateCampaignCommand()

interface IUseNewCampaignFormProps {
	onSuccess?: () => void
}

export const useNewCampaignForm = (props?: IUseNewCampaignFormProps) => {
	const {
		register,
		control,
		handleSubmit,
		formState: { isSubmitting, errors },
		setError,
		reset,
	} = useForm<NewCampaignSchema>({
		resolver: zodResolver(newCampaignSchema),
		defaultValues: {
			title: "",
			message: "",
		},
	})

	const { handleError } = useErrors({
		setError,
		fields: ["title", "message", "bloodType"],
	})

	const refetchQuery = useRefetchQuery()

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

		refetchQuery([QUERY_KEYS.CAMPAIGNS])
		reset()
		props?.onSuccess?.()
		toast.success("Campanha criada com sucesso")
	}

	return {
		handleSubmit: handleSubmit(handleCreateNewCampaign),
		register,
		control,
		isSubmitting,
		errors,
	}
}
