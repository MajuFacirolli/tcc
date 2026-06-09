import "reflect-metadata"
import { decorate, inject, injectable } from "inversify"
import { GetCampaignsController } from "@presentation/controllers/GetCampaignsController"
import { DrizzleCampaignsRepository } from "@infrastructure/database/repositories/DrizzleCampaignsRepository"
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import { GetCampaignsUseCase } from "@application/use_cases/campaigns/GetCampaigns"
import { IoCContainer } from "./IoCContainer"
import { TYPES } from "./types"

decorate(injectable(), DrizzleCampaignsRepository)

decorate(injectable(), GetCampaignsUseCase)
decorate(inject(TYPES.ICampaignsRepository), GetCampaignsUseCase, 0)

decorate(injectable(), GetCampaignsController)
decorate(inject(TYPES.GetCampaignsUseCase), GetCampaignsController, 0)

const container = new IoCContainer()

container.bindRepository<ICampaignsRepository>(
	TYPES.ICampaignsRepository,
	DrizzleCampaignsRepository,
)
container.bindUseCase<GetCampaignsUseCase>(
	TYPES.GetCampaignsUseCase,
	GetCampaignsUseCase,
)
container.bindController<GetCampaignsController>(
	TYPES.GetCampaignsController,
	GetCampaignsController,
)

export { container }
