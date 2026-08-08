import type { GenericError } from "./GenericError"
import type { ForbiddenError } from "./ForbiddenError"
import type { LockedError } from "./LockedError"
import type { NotAcceptableError } from "./NotAcceptable"
import type { NotFoundError } from "./NotFoundError"
import type { ServerError } from "./ServerError"
import type { UnauthorizedError } from "./UnauthorizedError"
import type { ValidationError } from "./ValidationError"

export type TApplicationError =
	| Error
	| ServerError
	| ForbiddenError
	| LockedError
	| NotAcceptableError
	| NotFoundError
	| UnauthorizedError
	| ValidationError
	| GenericError
