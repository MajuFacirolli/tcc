import type { FastifyInstance } from "fastify"
import { ForbiddenError } from "@/core/errors/ForbiddenError"
import { LockedError } from "@/core/errors/LockedError"
import { NotAcceptableError } from "@/core/errors/NotAcceptable"
import { NotFoundError } from "@/core/errors/NotFoundError"
import { UnauthorizedError } from "@/core/errors/UnauthorizedError"
import { ValidationError } from "@/core/errors/ValidationError"
import HttpStatusCode from "@/core/StatusCodesEnum"
import { ManyRequestsError } from "@/core/errors/ManyRequestsError"

export function errorHandler(app: FastifyInstance) {
	app.setErrorHandler(async (error: Error, _request, reply) => {
		const fastifyError = error as Error & { validation?: unknown[] }

		if (fastifyError.validation) {
			return reply.status(HttpStatusCode.BAD_REQUEST).send({
				data: null,
				status: HttpStatusCode.BAD_REQUEST,
				message: error.message,
			})
		}

		if (error instanceof NotFoundError) {
			return reply.status(HttpStatusCode.NOT_FOUND).send({
				data: null,
				status: HttpStatusCode.NOT_FOUND,
				message: error.message,
			})
		}

		if (error instanceof UnauthorizedError) {
			return reply.status(HttpStatusCode.UNAUTHORIZED).send({
				data: null,
				status: HttpStatusCode.UNAUTHORIZED,
				message: error.message,
			})
		}

		if (error instanceof ForbiddenError) {
			return reply.status(HttpStatusCode.FORBIDDEN).send({
				data: null,
				status: HttpStatusCode.FORBIDDEN,
				message: error.message,
			})
		}

		if (error instanceof ValidationError) {
			return reply.status(HttpStatusCode.UNPROCESSABLE_ENTITY).send({
				data: null,
				status: HttpStatusCode.UNPROCESSABLE_ENTITY,
				message: error.message,
			})
		}

		if (error instanceof LockedError) {
			return reply.status(HttpStatusCode.LOCKED).send({
				data: null,
				status: HttpStatusCode.LOCKED,
				message: error.message,
			})
		}

		if (error instanceof NotAcceptableError) {
			return reply.status(HttpStatusCode.NOT_ACCEPTABLE).send({
				data: null,
				status: HttpStatusCode.NOT_ACCEPTABLE,
				message: error.message,
			})
		}

		if (error instanceof ManyRequestsError) {
			return reply.status(HttpStatusCode.TOO_MANY_REQUESTS).send({
				data: null,
				status: HttpStatusCode.TOO_MANY_REQUESTS,
				message: error.message,
			})
		}

		app.log.error(error)
		return reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
			data: null,
			status: HttpStatusCode.INTERNAL_SERVER_ERROR,
			message: "Internal Server Error",
		})
	})
}
