import type { FieldValues, Path, UseFormSetError } from "react-hook-form"
import type { TApplicationError } from "@/core/errors/ApplicationError"
import { ValidationError } from "@/core/errors/ValidationError"

const FALLBACK_MESSAGE = "Ocorreu um erro inesperado"

interface IUseErrorsParams<TFieldValues extends FieldValues> {
	setError: UseFormSetError<TFieldValues>
	fields?: readonly Path<TFieldValues>[]
	fallbackMessage?: string
}

export const useErrors = <TFieldValues extends FieldValues>({
	setError,
	fields,
}: IUseErrorsParams<TFieldValues>) => {
	function resolveTarget(parameter: string): Path<TFieldValues> | "root" {
		const isField = fields?.some((field) => field === parameter)

		return isField ? (parameter as Path<TFieldValues>) : "root"
	}

	function handleError(error: TApplicationError) {
		if (error instanceof ValidationError && error.errors.length > 0) {
			for (const { parameter, error: message } of error.errors) {
				setError(resolveTarget(parameter), { message })
			}

			return
		}

		setError("root", { message: error.message ?? FALLBACK_MESSAGE })
	}

	return { handleError }
}
