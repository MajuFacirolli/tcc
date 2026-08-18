import type { TFactory } from "@/core/Factory"
import { ConfirmDonationIntentionCommand } from "@/data/commands/ConfirmDonationIntentionCommand"
import type { IConfirmDonationIntentionCommand } from "@/domain/commands/IConfirmDonationIntentionCommand"

export const createConfirmDonationIntentionCommand: TFactory<
	IConfirmDonationIntentionCommand
> = () => {
	return new ConfirmDonationIntentionCommand()
}
