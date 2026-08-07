export const TYPES = {
	ICampaignsRepository: Symbol.for("ICampaignsRepository"),

	GetCampaignsUseCase: Symbol.for("GetCampaignsUseCase"),
	GetCampaignsSummaryUseCase: Symbol.for("GetCampaignsSummaryUseCase"),
	GetCampaignUseCase: Symbol.for("GetCampaignUseCase"),
	CreateCampaignUseCase: Symbol.for("CreateCampaignUseCase"),

	GetCampaignsController: Symbol.for("GetCampaignsController"),
	GetCampaignsSummaryController: Symbol.for("GetCampaignsSummaryController"),
	GetCampaignController: Symbol.for("GetCampaignController"),
	CreateCampaignController: Symbol.for("CreateCampaignController"),

	IPasswordHasher: Symbol.for("IPasswordHasher"),
}
