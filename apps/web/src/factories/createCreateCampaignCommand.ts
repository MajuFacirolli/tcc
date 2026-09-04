import type { TFactory } from "@/core/Factory"
import { CreateCampaignCommand } from "@/data/commands/CreateCampaignCommand"
import type { ICreateCampaignCommand } from "@/domain/commands/ICreateCampaignCommand"

export const createCreateCampaignCommand: TFactory<
	ICreateCampaignCommand
> = () => {
	return new CreateCampaignCommand()
}
