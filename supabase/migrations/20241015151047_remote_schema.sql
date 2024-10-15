alter table "public"."messages" add column "campaign_id" uuid;

alter table "public"."messages" add constraint "messages_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns(id) not valid;

alter table "public"."messages" validate constraint "messages_campaign_id_fkey";


