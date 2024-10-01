create table "public"."campaigns" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "web_user_id" uuid not null,
    "phone_user_id" uuid not null,
    "size" bigint not null,
    "name" character varying not null
);


alter table "public"."campaigns" enable row level security;

CREATE UNIQUE INDEX campaigns_pkey ON public.campaigns USING btree (id);

alter table "public"."campaigns" add constraint "campaigns_pkey" PRIMARY KEY using index "campaigns_pkey";

alter table "public"."campaigns" add constraint "campaigns_phone_user_id_fkey" FOREIGN KEY (phone_user_id) REFERENCES auth.users(id) not valid;

alter table "public"."campaigns" validate constraint "campaigns_phone_user_id_fkey";

alter table "public"."campaigns" add constraint "campaigns_web_user_id_fkey" FOREIGN KEY (web_user_id) REFERENCES auth.users(id) not valid;

alter table "public"."campaigns" validate constraint "campaigns_web_user_id_fkey";

grant delete on table "public"."campaigns" to "anon";

grant insert on table "public"."campaigns" to "anon";

grant references on table "public"."campaigns" to "anon";

grant select on table "public"."campaigns" to "anon";

grant trigger on table "public"."campaigns" to "anon";

grant truncate on table "public"."campaigns" to "anon";

grant update on table "public"."campaigns" to "anon";

grant delete on table "public"."campaigns" to "authenticated";

grant insert on table "public"."campaigns" to "authenticated";

grant references on table "public"."campaigns" to "authenticated";

grant select on table "public"."campaigns" to "authenticated";

grant trigger on table "public"."campaigns" to "authenticated";

grant truncate on table "public"."campaigns" to "authenticated";

grant update on table "public"."campaigns" to "authenticated";

grant delete on table "public"."campaigns" to "service_role";

grant insert on table "public"."campaigns" to "service_role";

grant references on table "public"."campaigns" to "service_role";

grant select on table "public"."campaigns" to "service_role";

grant trigger on table "public"."campaigns" to "service_role";

grant truncate on table "public"."campaigns" to "service_role";

grant update on table "public"."campaigns" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."campaigns"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for users based on user_id"
on "public"."campaigns"
as permissive
for select
to public
using (((( SELECT auth.uid() AS uid) = phone_user_id) OR (( SELECT auth.uid() AS uid) = web_user_id)));



