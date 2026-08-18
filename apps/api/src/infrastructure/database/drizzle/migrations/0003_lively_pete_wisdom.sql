CREATE UNIQUE INDEX "confirmations_campaign_id_donor_id_unique" ON "confirmations" USING btree ("campaign_id","donor_id");--> statement-breakpoint
ALTER TABLE "confirmations" DROP COLUMN "confirmed";