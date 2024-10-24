create table "public"."pings" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "sent_at" timestamp with time zone not null,
    "user_id" uuid not null
);


alter table "public"."pings" enable row level security;

create table "public"."pongs" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "ping_id" bigint not null,
    "received_at" timestamp with time zone not null
);


alter table "public"."pongs" enable row level security;

CREATE UNIQUE INDEX pings_pkey ON public.pings USING btree (id);

CREATE UNIQUE INDEX pongs_pkey ON public.pongs USING btree (id);

alter table "public"."pings" add constraint "pings_pkey" PRIMARY KEY using index "pings_pkey";

alter table "public"."pongs" add constraint "pongs_pkey" PRIMARY KEY using index "pongs_pkey";

alter table "public"."pings" add constraint "pings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."pings" validate constraint "pings_user_id_fkey";

alter table "public"."pongs" add constraint "pongs_ping_id_fkey" FOREIGN KEY (ping_id) REFERENCES pings(id) not valid;

alter table "public"."pongs" validate constraint "pongs_ping_id_fkey";

grant delete on table "public"."pings" to "anon";

grant insert on table "public"."pings" to "anon";

grant references on table "public"."pings" to "anon";

grant select on table "public"."pings" to "anon";

grant trigger on table "public"."pings" to "anon";

grant truncate on table "public"."pings" to "anon";

grant update on table "public"."pings" to "anon";

grant delete on table "public"."pings" to "authenticated";

grant insert on table "public"."pings" to "authenticated";

grant references on table "public"."pings" to "authenticated";

grant select on table "public"."pings" to "authenticated";

grant trigger on table "public"."pings" to "authenticated";

grant truncate on table "public"."pings" to "authenticated";

grant update on table "public"."pings" to "authenticated";

grant delete on table "public"."pings" to "service_role";

grant insert on table "public"."pings" to "service_role";

grant references on table "public"."pings" to "service_role";

grant select on table "public"."pings" to "service_role";

grant trigger on table "public"."pings" to "service_role";

grant truncate on table "public"."pings" to "service_role";

grant update on table "public"."pings" to "service_role";

grant delete on table "public"."pongs" to "anon";

grant insert on table "public"."pongs" to "anon";

grant references on table "public"."pongs" to "anon";

grant select on table "public"."pongs" to "anon";

grant trigger on table "public"."pongs" to "anon";

grant truncate on table "public"."pongs" to "anon";

grant update on table "public"."pongs" to "anon";

grant delete on table "public"."pongs" to "authenticated";

grant insert on table "public"."pongs" to "authenticated";

grant references on table "public"."pongs" to "authenticated";

grant select on table "public"."pongs" to "authenticated";

grant trigger on table "public"."pongs" to "authenticated";

grant truncate on table "public"."pongs" to "authenticated";

grant update on table "public"."pongs" to "authenticated";

grant delete on table "public"."pongs" to "service_role";

grant insert on table "public"."pongs" to "service_role";

grant references on table "public"."pongs" to "service_role";

grant select on table "public"."pongs" to "service_role";

grant trigger on table "public"."pongs" to "service_role";

grant truncate on table "public"."pongs" to "service_role";

grant update on table "public"."pongs" to "service_role";

create policy "Enable insert for users based on user_id"
on "public"."pings"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."pings"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."pongs"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = ( SELECT p.user_id
   FROM pings p
  WHERE (p.id = pongs.ping_id))));


