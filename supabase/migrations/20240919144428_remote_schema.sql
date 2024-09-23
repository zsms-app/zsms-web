create table "public"."fcm_tokens" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "phone_user_id" uuid not null,
    "token" character varying not null
);


alter table "public"."fcm_tokens" enable row level security;

create table "public"."pairings" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "web_user_id" uuid not null,
    "fcm_token_id" bigint not null
);


alter table "public"."pairings" enable row level security;

create table "public"."secrets" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "secret" character varying not null,
    "fcm_token_id" bigint not null
);


alter table "public"."secrets" enable row level security;

CREATE UNIQUE INDEX fcm_tokens_pkey ON public.fcm_tokens USING btree (id);

CREATE UNIQUE INDEX fcm_tokens_user_id_key ON public.fcm_tokens USING btree (phone_user_id);

CREATE UNIQUE INDEX pairings_pkey ON public.pairings USING btree (id);

CREATE UNIQUE INDEX secrets_pkey ON public.secrets USING btree (id);

alter table "public"."fcm_tokens" add constraint "fcm_tokens_pkey" PRIMARY KEY using index "fcm_tokens_pkey";

alter table "public"."pairings" add constraint "pairings_pkey" PRIMARY KEY using index "pairings_pkey";

alter table "public"."secrets" add constraint "secrets_pkey" PRIMARY KEY using index "secrets_pkey";

alter table "public"."fcm_tokens" add constraint "fcm_tokens_user_id_fkey" FOREIGN KEY (phone_user_id) REFERENCES auth.users(id) not valid;

alter table "public"."fcm_tokens" validate constraint "fcm_tokens_user_id_fkey";

alter table "public"."fcm_tokens" add constraint "fcm_tokens_user_id_key" UNIQUE using index "fcm_tokens_user_id_key";

alter table "public"."pairings" add constraint "pairings_fcm_token_id_fkey" FOREIGN KEY (fcm_token_id) REFERENCES fcm_tokens(id) not valid;

alter table "public"."pairings" validate constraint "pairings_fcm_token_id_fkey";

alter table "public"."pairings" add constraint "pairings_web_user_id_fkey" FOREIGN KEY (web_user_id) REFERENCES auth.users(id) not valid;

alter table "public"."pairings" validate constraint "pairings_web_user_id_fkey";

alter table "public"."secrets" add constraint "secrets_fcm_token_id_fkey" FOREIGN KEY (fcm_token_id) REFERENCES fcm_tokens(id) not valid;

alter table "public"."secrets" validate constraint "secrets_fcm_token_id_fkey";

grant delete on table "public"."fcm_tokens" to "anon";

grant insert on table "public"."fcm_tokens" to "anon";

grant references on table "public"."fcm_tokens" to "anon";

grant select on table "public"."fcm_tokens" to "anon";

grant trigger on table "public"."fcm_tokens" to "anon";

grant truncate on table "public"."fcm_tokens" to "anon";

grant update on table "public"."fcm_tokens" to "anon";

grant delete on table "public"."fcm_tokens" to "authenticated";

grant insert on table "public"."fcm_tokens" to "authenticated";

grant references on table "public"."fcm_tokens" to "authenticated";

grant select on table "public"."fcm_tokens" to "authenticated";

grant trigger on table "public"."fcm_tokens" to "authenticated";

grant truncate on table "public"."fcm_tokens" to "authenticated";

grant update on table "public"."fcm_tokens" to "authenticated";

grant delete on table "public"."fcm_tokens" to "service_role";

grant insert on table "public"."fcm_tokens" to "service_role";

grant references on table "public"."fcm_tokens" to "service_role";

grant select on table "public"."fcm_tokens" to "service_role";

grant trigger on table "public"."fcm_tokens" to "service_role";

grant truncate on table "public"."fcm_tokens" to "service_role";

grant update on table "public"."fcm_tokens" to "service_role";

grant delete on table "public"."pairings" to "anon";

grant insert on table "public"."pairings" to "anon";

grant references on table "public"."pairings" to "anon";

grant select on table "public"."pairings" to "anon";

grant trigger on table "public"."pairings" to "anon";

grant truncate on table "public"."pairings" to "anon";

grant update on table "public"."pairings" to "anon";

grant delete on table "public"."pairings" to "authenticated";

grant insert on table "public"."pairings" to "authenticated";

grant references on table "public"."pairings" to "authenticated";

grant select on table "public"."pairings" to "authenticated";

grant trigger on table "public"."pairings" to "authenticated";

grant truncate on table "public"."pairings" to "authenticated";

grant update on table "public"."pairings" to "authenticated";

grant delete on table "public"."pairings" to "service_role";

grant insert on table "public"."pairings" to "service_role";

grant references on table "public"."pairings" to "service_role";

grant select on table "public"."pairings" to "service_role";

grant trigger on table "public"."pairings" to "service_role";

grant truncate on table "public"."pairings" to "service_role";

grant update on table "public"."pairings" to "service_role";

grant delete on table "public"."secrets" to "anon";

grant insert on table "public"."secrets" to "anon";

grant references on table "public"."secrets" to "anon";

grant select on table "public"."secrets" to "anon";

grant trigger on table "public"."secrets" to "anon";

grant truncate on table "public"."secrets" to "anon";

grant update on table "public"."secrets" to "anon";

grant delete on table "public"."secrets" to "authenticated";

grant insert on table "public"."secrets" to "authenticated";

grant references on table "public"."secrets" to "authenticated";

grant select on table "public"."secrets" to "authenticated";

grant trigger on table "public"."secrets" to "authenticated";

grant truncate on table "public"."secrets" to "authenticated";

grant update on table "public"."secrets" to "authenticated";

grant delete on table "public"."secrets" to "service_role";

grant insert on table "public"."secrets" to "service_role";

grant references on table "public"."secrets" to "service_role";

grant select on table "public"."secrets" to "service_role";

grant trigger on table "public"."secrets" to "service_role";

grant truncate on table "public"."secrets" to "service_role";

grant update on table "public"."secrets" to "service_role";

create policy "Enable insert for users based on user_id"
on "public"."fcm_tokens"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = phone_user_id));


create policy "Enable insert for users based on user_id"
on "public"."pairings"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = web_user_id));


