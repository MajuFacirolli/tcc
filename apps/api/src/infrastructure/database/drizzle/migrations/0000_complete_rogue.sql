CREATE TYPE "public"."blood_type" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('active', 'closed');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TABLE "blood_bank" (
	"id" "blood_type" PRIMARY KEY NOT NULL,
	"bags_count" integer DEFAULT 0 NOT NULL,
	"min_threshold" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"blood_type" "blood_type" NOT NULL,
	"status" "campaign_status" DEFAULT 'active' NOT NULL,
	"total_eligible_donors" integer DEFAULT 0 NOT NULL,
	"notified_count" integer DEFAULT 0 NOT NULL,
	"intention_confirmations_count" integer DEFAULT 0 NOT NULL,
	"average_response_time" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "confirmations" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"campaign_id" text NOT NULL,
	"donor_id" text NOT NULL,
	"confirmed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "confirmations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "donors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sex" "sex" NOT NULL,
	"blood_type" "blood_type" NOT NULL,
	"last_donation_date" timestamp,
	"email" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "confirmations" ADD CONSTRAINT "confirmations_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "confirmations" ADD CONSTRAINT "confirmations_donor_id_donors_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."donors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "confirmations_campaign_id_donor_id_unique" ON "confirmations" USING btree ("campaign_id","donor_id");