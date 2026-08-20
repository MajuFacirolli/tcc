export const TYPES = {
	ICampaignsRepository: Symbol.for("ICampaignsRepository"),
	IUsersRepository: Symbol.for("IUsersRepository"),
	IDonorsRepository: Symbol.for("IDonorsRepository"),
	IConfirmationsRepository: Symbol.for("IConfirmationsRepository"),
	IMetricsRepository: Symbol.for("IMetricsRepository"),

	GetCampaignsUseCase: Symbol.for("GetCampaignsUseCase"),
	GetCampaignsSummaryUseCase: Symbol.for("GetCampaignsSummaryUseCase"),
	GetCampaignUseCase: Symbol.for("GetCampaignUseCase"),
	CreateCampaignUseCase: Symbol.for("CreateCampaignUseCase"),
	SendCampaignEmailUseCase: Symbol.for("SendCampaignEmailUseCase"),
	CloseCampaignUseCase: Symbol.for("CloseCampaignUseCase"),
	SignInUseCase: Symbol.for("SignInUseCase"),
	GetProfileUseCase: Symbol.for("GetProfileUseCase"),
	ConfirmDonationIntentionUseCase: Symbol.for(
		"ConfirmDonationIntentionUseCase",
	),
	GetMetricsUseCase: Symbol.for("GetMetricsUseCase"),

	GetCampaignsController: Symbol.for("GetCampaignsController"),
	GetCampaignsSummaryController: Symbol.for("GetCampaignsSummaryController"),
	GetCampaignController: Symbol.for("GetCampaignController"),
	CreateCampaignController: Symbol.for("CreateCampaignController"),
	SignInController: Symbol.for("SignInController"),
	SignOutController: Symbol.for("SignOutController"),
	GetProfileController: Symbol.for("GetProfileController"),
	ConfirmDonationIntentionController: Symbol.for(
		"ConfirmDonationIntentionController",
	),
	GetMetricsController: Symbol.for("GetMetricsController"),

	IPasswordHasher: Symbol.for("IPasswordHasher"),
	IEmailService: Symbol.for("IEmailService"),
	IEmailTemplateRenderer: Symbol.for("IEmailTemplateRenderer"),
	IJobQueue: Symbol.for("IJobQueue"),
}
