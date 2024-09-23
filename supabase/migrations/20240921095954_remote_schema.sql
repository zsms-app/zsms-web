alter table "public"."pairings" drop constraint "pairings_pkey";

drop index if exists "public"."pairings_pkey";

alter table "public"."pairing_secrets" add column "phone_user_id" uuid not null;

CREATE UNIQUE INDEX pairings_pkey ON public.pairings USING btree (id, web_user_id, fcm_token_id);

alter table "public"."pairings" add constraint "pairings_pkey" PRIMARY KEY using index "pairings_pkey";

alter table "public"."pairing_secrets" add constraint "pairing_secrets_phone_user_id_fkey" FOREIGN KEY (phone_user_id) REFERENCES auth.users(id) not valid;

alter table "public"."pairing_secrets" validate constraint "pairing_secrets_phone_user_id_fkey";

create policy "select"
on "public"."pairings"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = web_user_id));



