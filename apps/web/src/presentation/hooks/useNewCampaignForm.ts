import { useEffect } from "react"
import { createFormControl, useForm, useWatch } from "react-hook-form"
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
import { CampaignKindEnum } from "@/domain/enums/CampaignKindEnum"
import { useEligibleDonorsCount } from "./useEligibleDonorsCount"

const createCampaignCommand = createCreateCampaignCommand()

export const newCampaignFormControl = createFormControl({
	resolver: zodResolver(newCampaignSchema),
	defaultValues: {
		title: "",
		message: "",
		bloodType: undefined,
		kind: CampaignKindEnum.SEGMENTED,
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
		setValue,
		reset,
	} = useForm<NewCampaignSchema>({
		formControl: newCampaignFormControl,
		defaultValues: {
			bloodType,
		},
	})

	const { handleError } = useErrors({
		setError,
		fields: ["title", "message", "bloodType", "kind"],
	})

	const navigate = useNavigate()

	useEffect(() => {
		if (!bloodType) return

		setValue("bloodType", bloodType)
		setValue("kind", CampaignKindEnum.SEGMENTED)
	}, [bloodType, setValue])

	const selectedBloodType = useWatch({ control, name: "bloodType" })
	const kind = useWatch({ control, name: "kind" })
	const isSegmented = kind === CampaignKindEnum.SEGMENTED

	const { eligibleDonorsCount, isLoading: isLoadingEligibleDonorsCount } =
		useEligibleDonorsCount({
			bloodType: selectedBloodType ?? undefined,
			enabled: isSegmented,
		})

	function handleKindChange(value: CampaignKindEnum) {
		setValue("kind", value, { shouldValidate: true })
	}

	function handleBloodTypeChange(value: BloodTypeEnum) {
		setValue("bloodType", value, { shouldValidate: true })
		navigate({
			to: PagesEnum.NEW_CAMPAIGN,
			search: { bloodType: value },
			replace: true,
		})
	}

	async function handleCreateNewCampaign(data: NewCampaignSchema) {
		const response = await createCampaignCommand.execute({
			title: data.title,
			message: data.message,
			kind: data.kind,
			bloodType: isSegmented ? (data.bloodType as BloodTypeEnum) : null,
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
		handleBloodTypeChange,
		handleKindChange,
		isSegmented,
		eligibleDonorsCount,
		isLoadingEligibleDonorsCount,
	}
}
