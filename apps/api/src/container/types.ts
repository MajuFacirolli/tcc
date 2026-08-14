export const TYPES = {
	ICampaignsRepository: Symbol.for("ICampaignsRepository"),
	IUsersRepository: Symbol.for("IUsersRepository"),
	IDonorsRepository: Symbol.for("IDonorsRepository"),

	GetCampaignsUseCase: Symbol.for("GetCampaignsUseCase"),
	GetCampaignsSummaryUseCase: Symbol.for("GetCampaignsSummaryUseCase"),
	GetCampaignUseCase: Symbol.for("GetCampaignUseCase"),
	CreateCampaignUseCase: Symbol.for("CreateCampaignUseCase"),
	SendCampaignEmailUseCase: Symbol.for("SendCampaignEmailUseCase"),
	SignInUseCase: Symbol.for("SignInUseCase"),
	GetProfileUseCase: Symbol.for("GetProfileUseCase"),

	GetCampaignsController: Symbol.for("GetCampaignsController"),
	GetCampaignsSummaryController: Symbol.for("GetCampaignsSummaryController"),
	GetCampaignController: Symbol.for("GetCampaignController"),
	CreateCampaignController: Symbol.for("CreateCampaignController"),
	SignInController: Symbol.for("SignInController"),
	SignOutController: Symbol.for("SignOutController"),
	GetProfileController: Symbol.for("GetProfileController"),

	IPasswordHasher: Symbol.for("IPasswordHasher"),
	IEmailService: Symbol.for("IEmailService"),
	IEmailTemplateRenderer: Symbol.for("IEmailTemplateRenderer"),
	IJobQueue: Symbol.for("IJobQueue"),
}
