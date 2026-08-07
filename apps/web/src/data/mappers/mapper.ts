import "reflect-metadata"

import { classes } from "@automapper/classes"
import { createMap, createMapper } from "@automapper/core"
import { MapperError } from "@/core/errors/MapperError"

export const mapper = createMapper({
	strategyInitializer: classes(),
	errorHandler: {
		handle(error: Error) {
			throw new MapperError(error.message)
		},
	},
})
