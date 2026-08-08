import type { TEither } from "@/core/Either"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import type { IQuery } from "@/core/Query"
import type { ProfileResponse } from "@/data/models/responses/ProfileResponse"

export interface IGetProfileQuery
	extends IQuery<void, TEither<TApplicationError, ProfileResponse>, void> {}
