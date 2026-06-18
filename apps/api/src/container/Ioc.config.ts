import "reflect-metadata"
import { decorate, inject, injectable } from "inversify"
import { GetCampaignsController } from "@presentation/controllers/GetCampaignsController"
import { GetCampaignsSummaryController } from "@presentation/controllers/GetCampaignsSummaryController"
import { GetCampaignController } from "@presentation/controllers/GetCampaignController"
import { CreateCampaignController } from "@presentation/controllers/CreateCampaignController"
import { DrizzleCampaignsRepository } from "@infrastructure/database/repositories/DrizzleCampaignsRepository"
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import { GetCampaignsUseCase } from "@application/use_cases/campaigns/GetCampaigns"
import { GetCampaignsSummaryUseCase } from "@application/use_cases/campaigns/GetCampaignsSummary"
import { GetCampaignUseCase } from "@application/use_cases/campaigns/GetCampaign"
import { CreateCampaignUseCase } from "@application/use_cases/campaigns/CreateCampaign"
import { IoCContainer } from "./IoCContainer"
import { TYPES } from "./types"

decorate(injectable(), DrizzleCampaignsRepository)

decorate(injectable(), GetCampaignsUseCase)
decorate(inject(TYPES.ICampaignsRepository), GetCampaignsUseCase, 0)

decorate(injectable(), GetCampaignsSummaryUseCase)
decorate(inject(TYPES.ICampaignsRepository), GetCampaignsSummaryUseCase, 0)

decorate(injectable(), GetCampaignUseCase)
decorate(inject(TYPES.ICampaignsRepository), GetCampaignUseCase, 0)

decorate(injectable(), CreateCampaignUseCase)
decorate(inject(TYPES.ICampaignsRepository), CreateCampaignUseCase, 0)

decorate(injectable(), GetCampaignsController)
decorate(inject(TYPES.GetCampaignsUseCase), GetCampaignsController, 0)

decorate(injectable(), GetCampaignsSummaryController)
decorate(inject(TYPES.GetCampaignsSummaryUseCase), GetCampaignsSummaryController, 0)

decorate(injectable(), GetCampaignController)
decorate(inject(TYPES.GetCampaignUseCase), GetCampaignController, 0)

decorate(injectable(), CreateCampaignController)
decorate(inject(TYPES.CreateCampaignUseCase), CreateCampaignController, 0)

const container = new IoCContainer()

container.bindRepository<ICampaignsRepository>(
	TYPES.ICampaignsRepository,
	DrizzleCampaignsRepository,
)
container.bindUseCase<GetCampaignsUseCase>(
	TYPES.GetCampaignsUseCase,
	GetCampaignsUseCase,
)
container.bindUseCase<GetCampaignsSummaryUseCase>(
	TYPES.GetCampaignsSummaryUseCase,
	GetCampaignsSummaryUseCase,
)
container.bindUseCase<GetCampaignUseCase>(
	TYPES.GetCampaignUseCase,
	GetCampaignUseCase,
)
container.bindUseCase<CreateCampaignUseCase>(
	TYPES.CreateCampaignUseCase,
	CreateCampaignUseCase,
)
container.bindController<GetCampaignsController>(
	TYPES.GetCampaignsController,
	GetCampaignsController,
)
container.bindController<GetCampaignsSummaryController>(
	TYPES.GetCampaignsSummaryController,
	GetCampaignsSummaryController,
)
container.bindController<GetCampaignController>(
	TYPES.GetCampaignController,
	GetCampaignController,
)
container.bindController<CreateCampaignController>(
	TYPES.CreateCampaignController,
	CreateCampaignController,
)

export { container }
