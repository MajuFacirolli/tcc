CREATE TYPE "public"."campaign_kind" AS ENUM('generic', 'segmented');--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "kind" "campaign_kind" DEFAULT 'segmented' NOT NULL;