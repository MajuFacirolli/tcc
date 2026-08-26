import "reflect-metadata"
import { decorate, inject, injectable } from "inversify"
// interfaces
import type { ICampaignsRepository } from "@application/interfaces/ICampaignsRepository"
import type { IUsersRepository } from "@application/interfaces/IUsersRepository"
import type { IDonorsRepository } from "@application/interfaces/IDonorsRepository"
import type { IConfirmationsRepository } from "@application/interfaces/IConfirmationsRepository"
import type { IMetricsRepository } from "@application/interfaces/IMetricsRepository"
import type { IBloodBankRepository } from "@/application/interfaces/IBloodBankRepository"
import type { IPasswordHasher } from "@application/interfaces/IPasswordHasher"
import type { IEmailService } from "@application/interfaces/IEmailService"
import type { IEmailTemplateRenderer } from "@application/interfaces/IEmailTemplateRenderer"
import type { IJobQueue } from "@application/interfaces/IJobQueue"

// repositories
import { DrizzleCampaignsRepository } from "@infrastructure/database/repositories/DrizzleCampaignsRepository"
import { DrizzleDonorsRepository } from "@infrastructure/database/repositories/DrizzleDonorsRepository"
import { DrizzleUsersRepository } from "@infrastructure/database/repositories/DrizzleUsersRepository"
import { DrizzleConfirmationsRepository } from "@/infrastructure/database/repositories/DrizzleConfirmationsRepository"
import { DrizzleMetricsRepository } from "@infrastructure/database/repositories/DrizzleMetricsRepository"
import { DrizzleBloodBankRepository } from "@infrastructure/database/repositories/DrizzleBloodBankRepository"

// use cases
import { GetCampaignsUseCase } from "@application/use_cases/campaigns/GetCampaigns"
import { GetCampaignsSummaryUseCase } from "@application/use_cases/campaigns/GetCampaignsSummary"
import { GetCampaignUseCase } from "@application/use_cases/campaigns/GetCampaign"
import { CreateCampaignUseCase } from "@application/use_cases/campaigns/CreateCampaign"
import { SendCampaignEmailUseCase } from "@application/use_cases/campaigns/SendCampaignEmail"
import { CloseCampaignUseCase } from "@application/use_cases/campaigns/CloseCampaign"
import { SignInUseCase } from "@application/use_cases/auth/SignIn"
import { GetProfileUseCase } from "@application/use_cases/auth/GetProfile"
import { ConfirmDonationIntentionUseCase } from "@application/use_cases/confirmations/ConfirmDonationIntention"
import { GetMetricsUseCase } from "@application/use_cases/metrics/GetMetrics"
import { GetDailyMetricsUseCase } from "@application/use_cases/metrics/GetDailyMetrics"
import { GetBloodBankSummaryUseCase } from "@/application/use_cases/bloodBank/GetBloodBankSummary"
import { GetDonorsUseCase } from "@application/use_cases/donors/GetDonors"

// controllers
import { GetCampaignsController } from "@/presentation/controllers/campaigns/GetCampaigns"
import { GetCampaignsSummaryController } from "@/presentation/controllers/campaigns/GetCampaignsSummary"
import { GetCampaignController } from "@/presentation/controllers/campaigns/GetCampaign"
import { CreateCampaignController } from "@/presentation/controllers/campaigns/CreateCampaign"
import { SignInController } from "@/presentation/controllers/auth/SignIn"
import { SignOutController } from "@/presentation/controllers/auth/SignOut"
import { GetProfileController } from "@/presentation/controllers/auth/GetProfile"
import { ConfirmDonationIntentionController } from "@/presentation/controllers/confirmations/ConfirmDonationIntention"
import { GetMetricsController } from "@/presentation/controllers/metrics/GetMetrics"
import { GetDailyMetricsController } from "@/presentation/controllers/metrics/GetDailyMetrics"
import { GetBloodBankSummaryController } from "@/presentation/controllers/bloodBank/GetBloodBankSummary"
import { GetDonorsController } from "@/presentation/controllers/donors/GetDonors"

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
decorate(injectable(), DrizzleConfirmationsRepository)
decorate(injectable(), DrizzleMetricsRepository)
decorate(injectable(), DrizzleBloodBankRepository)

// use cases
decorate(injectable(), GetCampaignsUseCase)
decorate(injectable(), GetCampaignsSummaryUseCase)
decorate(injectable(), GetCampaignUseCase)
decorate(injectable(), CreateCampaignUseCase)
decorate(injectable(), SendCampaignEmailUseCase)
decorate(injectable(), CloseCampaignUseCase)
decorate(injectable(), SignInUseCase)
decorate(injectable(), GetProfileUseCase)
decorate(injectable(), ConfirmDonationIntentionUseCase)
decorate(injectable(), GetMetricsUseCase)
decorate(injectable(), GetDailyMetricsUseCase)
decorate(injectable(), GetBloodBankSummaryUseCase)
decorate(injectable(), GetDonorsUseCase)

// controllers
decorate(injectable(), GetCampaignsController)
decorate(injectable(), GetCampaignsSummaryController)
decorate(injectable(), GetCampaignController)
decorate(injectable(), CreateCampaignController)
decorate(injectable(), SignInController)
decorate(injectable(), SignOutController)
decorate(injectable(), GetProfileController)
decorate(injectable(), ConfirmDonationIntentionController)
decorate(injectable(), GetMetricsController)
decorate(injectable(), GetDailyMetricsController)
decorate(injectable(), GetBloodBankSummaryController)
decorate(injectable(), GetDonorsController)

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
decorate(
	inject(TYPES.IConfirmationsRepository),
	ConfirmDonationIntentionUseCase,
	0,
)
decorate(inject(TYPES.IMetricsRepository), GetMetricsUseCase, 0)
decorate(inject(TYPES.IMetricsRepository), GetDailyMetricsUseCase, 0)
decorate(inject(TYPES.IBloodBankRepository), GetBloodBankSummaryUseCase, 0)
decorate(inject(TYPES.IDonorsRepository), GetDonorsUseCase, 0)

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
decorate(
	inject(TYPES.ConfirmDonationIntentionUseCase),
	ConfirmDonationIntentionController,
	0,
)
decorate(inject(TYPES.GetMetricsUseCase), GetMetricsController, 0)
decorate(inject(TYPES.GetDailyMetricsUseCase), GetDailyMetricsController, 0)
decorate(
	inject(TYPES.GetBloodBankSummaryUseCase),
	GetBloodBankSummaryController,
	0,
)
decorate(inject(TYPES.GetDonorsUseCase), GetDonorsController, 0)

//services
decorate(inject(TYPES.IPasswordHasher), SignInUseCase, 1)
decorate(inject(TYPES.IEmailService), SendCampaignEmailUseCase, 0)
decorate(inject(TYPES.ICampaignsRepository), SendCampaignEmailUseCase, 1)
decorate(inject(TYPES.IEmailTemplateRenderer), SendCampaignEmailUseCase, 2)
decorate(inject(TYPES.IConfirmationsRepository), SendCampaignEmailUseCase, 3)
decorate(inject(TYPES.ICampaignsRepository), CloseCampaignUseCase, 0)

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
container.bindRepository<IConfirmationsRepository>(
	TYPES.IConfirmationsRepository,
	DrizzleConfirmationsRepository,
)
container.bindRepository<IMetricsRepository>(
	TYPES.IMetricsRepository,
	DrizzleMetricsRepository,
)
container.bindRepository<IBloodBankRepository>(
	TYPES.IBloodBankRepository,
	DrizzleBloodBankRepository,
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
container.bindUseCase<SendCampaignEmailUseCase>(
	TYPES.SendCampaignEmailUseCase,
	SendCampaignEmailUseCase,
)
container.bindUseCase<CloseCampaignUseCase>(
	TYPES.CloseCampaignUseCase,
	CloseCampaignUseCase,
)
container.bindUseCase<SignInUseCase>(TYPES.SignInUseCase, SignInUseCase)
container.bindUseCase<GetProfileUseCase>(
	TYPES.GetProfileUseCase,
	GetProfileUseCase,
)
container.bindUseCase<ConfirmDonationIntentionUseCase>(
	TYPES.ConfirmDonationIntentionUseCase,
	ConfirmDonationIntentionUseCase,
)
container.bindUseCase<GetMetricsUseCase>(
	TYPES.GetMetricsUseCase,
	GetMetricsUseCase,
)
container.bindUseCase<GetDailyMetricsUseCase>(
	TYPES.GetDailyMetricsUseCase,
	GetDailyMetricsUseCase,
)
container.bindUseCase<GetBloodBankSummaryUseCase>(
	TYPES.GetBloodBankSummaryUseCase,
	GetBloodBankSummaryUseCase,
)
container.bindUseCase<GetDonorsUseCase>(
	TYPES.GetDonorsUseCase,
	GetDonorsUseCase,
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
container.bindController<ConfirmDonationIntentionController>(
	TYPES.ConfirmDonationIntentionController,
	ConfirmDonationIntentionController,
)
container.bindController<GetMetricsController>(
	TYPES.GetMetricsController,
	GetMetricsController,
)
container.bindController<GetDailyMetricsController>(
	TYPES.GetDailyMetricsController,
	GetDailyMetricsController,
)
container.bindController<GetBloodBankSummaryController>(
	TYPES.GetBloodBankSummaryController,
	GetBloodBankSummaryController,
)
container.bindController<GetDonorsController>(
	TYPES.GetDonorsController,
	GetDonorsController,
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
