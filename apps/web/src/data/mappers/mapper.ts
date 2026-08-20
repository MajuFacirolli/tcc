import "reflect-metadata"

import { classes } from "@automapper/classes"
import { createMap, createMapper, forMember, mapFrom } from "@automapper/core"
import { MapperError } from "@/core/errors/MapperError"

import { CampaignVM } from "@/domain/viewmodels/CampaignVM"
import { ConfirmationVM } from "@/domain/viewmodels/ConfirmationVM"
import { CampaignSummaryVM } from "@/domain/viewmodels/CampaignSummaryVM"

import { CampaignResponse } from "../models/responses/CampaignResponse"
import { ConfirmationResponse } from "../models/responses/ConfirmationResponse"
import { CampaignSummaryResponse } from "../models/responses/CampaignSummaryResponse"

export const mapper = createMapper({
	strategyInitializer: classes(),
	errorHandler: {
		handle(error: Error) {
			throw new MapperError(error.message)
		},
	},
})

createMap(
	mapper,
	CampaignResponse,
	CampaignVM,
	forMember(
		(dest) => dest.bloodType,
		mapFrom((src) => src.bloodType),
	),
	forMember(
		(dest) => dest.status,
		mapFrom((src) => src.status),
	),
	forMember(
		(dest) => dest.createdAt,
		mapFrom((src) => new Date(src.createdAt)),
	),
	forMember(
		(dest) => dest.conversionRate,
		mapFrom((src) => src.conversionRate * 100),
	),
)

createMap(
	mapper,
	ConfirmationResponse,
	ConfirmationVM,
	forMember(
		(dest) => dest.confirmedAt,
		mapFrom((src) => new Date(src.confirmedAt)),
	),
	forMember(
		(dest) => dest.alreadyConfirmed,
		mapFrom((src) => src.alreadyConfirmed),
	),
)

createMap(
	mapper,
	CampaignSummaryResponse,
	CampaignSummaryVM,
	forMember(
		(dest) => dest.bloodType,
		mapFrom((src) => src.bloodType),
	),
	forMember(
		(dest) => dest.conversionRate,
		mapFrom((src) => src.conversionRate * 100),
	),
)
