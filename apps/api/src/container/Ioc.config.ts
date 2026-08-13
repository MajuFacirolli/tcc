import "reflect-metadata"
import { decorate, inject, injectable } from "inversify"
// interfaces
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { IUsersRepository } from "@application/interfaces/IUsersRepository"
import type { IDonorsRepository } from "@application/interfaces/IDonorsRepository"
import type { IPasswordHasher } from "@application/interfaces/IPasswordHasher"
import type { IEmailService } from "@application/interfaces/IEmailService"
import type { IEmailTemplateRenderer } from "@application/interfaces/IEmailTemplateRenderer"
import type { IJobQueue } from "@application/interfaces/IJobQueue"

// repositories
import { DrizzleCampaignsRepository } from "@infrastructure/database/repositories/DrizzleCampaignsRepository"
import { DrizzleDonorsRepository } from "@infrastructure/database/repositories/DrizzleDonorsRepository"
import { DrizzleUsersRepository } from "@infrastructure/database/repositories/DrizzleUsersRepository"

// use cases
import { GetCampaignsUseCase } from "@application/use_cases/campaigns/GetCampaigns"
import { GetCampaignsSummaryUseCase } from "@application/use_cases/campaigns/GetCampaignsSummary"
import { GetCampaignUseCase } from "@application/use_cases/campaigns/GetCampaign"
import { CreateCampaignUseCase } from "@application/use_cases/campaigns/CreateCampaign"
import { SignInUseCase } from "@application/use_cases/auth/SignIn"
import { GetProfileUseCase } from "@application/use_cases/auth/GetProfile"

// controllers
import { GetCampaignsController } from "@/presentation/controllers/campaigns/GetCampaigns"
import { GetCampaignsSummaryController } from "@/presentation/controllers/campaigns/GetCampaignsSummary"
import { GetCampaignController } from "@/presentation/controllers/campaigns/GetCampaign"
import { CreateCampaignController } from "@/presentation/controllers/campaigns/CreateCampaign"
import { SignInController } from "@/presentation/controllers/auth/SignIn"
import { SignOutController } from "@/presentation/controllers/auth/SignOut"
import { GetProfileController } from "@/presentation/controllers/auth/GetProfile"

//services
import { Argon2PasswordHasher } from "@infrastructure/identity/Argon2PasswordHasher"
import { NodemailerEmailService } from "@infrastructure/services/NodemailerEmailService"
import { ReactEmailTemplateRenderer } from "@infrastructure/services/ReactEmailTemplateRenderer"
import { BullMqJobQueue } from "@infrastructure/queue/BullMqJobQueue"

import { IoCContainer } from "./IoCContainer"
import { TYPES } from "./types"

// injectable
// repositories
decorate(injectable(), DrizzleCampaignsRepository)
decorate(injectable(), DrizzleUsersRepository)
decorate(injectable(), DrizzleDonorsRepository)

// use cases
decorate(injectable(), GetCampaignsUseCase)
decorate(injectable(), GetCampaignsSummaryUseCase)
decorate(injectable(), GetCampaignUseCase)
decorate(injectable(), CreateCampaignUseCase)
decorate(injectable(), SignInUseCase)
decorate(injectable(), GetProfileUseCase)

// controllers
decorate(injectable(), GetCampaignsController)
decorate(injectable(), GetCampaignsSummaryController)
decorate(injectable(), GetCampaignController)
decorate(injectable(), CreateCampaignController)
decorate(injectable(), SignInController)
decorate(injectable(), SignOutController)
decorate(injectable(), GetProfileController)

//services
decorate(injectable(), Argon2PasswordHasher)
decorate(injectable(), NodemailerEmailService)
decorate(injectable(), ReactEmailTemplateRenderer)
decorate(injectable(), BullMqJobQueue)

// inject
// repositories
decorate(inject(TYPES.ICampaignsRepository), GetCampaignsUseCase, 0)
decorate(inject(TYPES.ICampaignsRepository), GetCampaignsSummaryUseCase, 0)
decorate(inject(TYPES.ICampaignsRepository), GetCampaignUseCase, 0)
decorate(inject(TYPES.ICampaignsRepository), CreateCampaignUseCase, 0)
decorate(inject(TYPES.IDonorsRepository), CreateCampaignUseCase, 1)
decorate(inject(TYPES.IJobQueue), CreateCampaignUseCase, 2)
decorate(inject(TYPES.IUsersRepository), SignInUseCase, 0)
decorate(inject(TYPES.IUsersRepository), GetProfileUseCase, 0)

// use cases
decorate(inject(TYPES.GetCampaignsUseCase), GetCampaignsController, 0)
decorate(
	inject(TYPES.GetCampaignsSummaryUseCase),
	GetCampaignsSummaryController,
	0,
)
decorate(inject(TYPES.GetCampaignUseCase), GetCampaignController, 0)
decorate(inject(TYPES.CreateCampaignUseCase), CreateCampaignController, 0)
decorate(inject(TYPES.SignInUseCase), SignInController, 0)
decorate(inject(TYPES.GetProfileUseCase), GetProfileController, 0)

//services
decorate(inject(TYPES.IPasswordHasher), SignInUseCase, 1)

const container = new IoCContainer()

// repositories
container.bindRepository<ICampaignsRepository>(
	TYPES.ICampaignsRepository,
	DrizzleCampaignsRepository,
)
container.bindRepository<IUsersRepository>(
	TYPES.IUsersRepository,
	DrizzleUsersRepository,
)
container.bindRepository<IDonorsRepository>(
	TYPES.IDonorsRepository,
	DrizzleDonorsRepository,
)

// use cases
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
container.bindUseCase<SignInUseCase>(TYPES.SignInUseCase, SignInUseCase)
container.bindUseCase<GetProfileUseCase>(
	TYPES.GetProfileUseCase,
	GetProfileUseCase,
)

// controllers
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
container.bindController<SignInController>(
	TYPES.SignInController,
	SignInController,
)
container.bindController<SignOutController>(
	TYPES.SignOutController,
	SignOutController,
)
container.bindController<GetProfileController>(
	TYPES.GetProfileController,
	GetProfileController,
)

//services
container.bindService<IPasswordHasher>(
	TYPES.IPasswordHasher,
	Argon2PasswordHasher,
)
container.bindService<IEmailService>(
	TYPES.IEmailService,
	NodemailerEmailService,
)
container.bindService<IEmailTemplateRenderer>(
	TYPES.IEmailTemplateRenderer,
	ReactEmailTemplateRenderer,
)
container.bindService<IJobQueue>(TYPES.IJobQueue, BullMqJobQueue)

export { container }
