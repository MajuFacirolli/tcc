/**
 * Payload of a scheduled simulated response.
 *
 * Only the token travels: the decision to respond was already taken when the
 * notification went out, and the confirmation token is all the existing confirmation
 * path needs. Keeping donor data out of the payload also keeps it off the Bull Board
 * queue UI.
 */
export type SimulateDonationIntentionInput = {
	token: string
}
