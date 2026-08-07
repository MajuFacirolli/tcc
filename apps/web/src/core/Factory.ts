import type { IQuery } from "@/core/Query"
import type { ICommand } from "@/core/Command"

export type TFactory<T extends ICommand<any, any> | IQuery<any, any, any>> =
	() => T
