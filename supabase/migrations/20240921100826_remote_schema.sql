create policy "select"
on "public"."pairing_secrets"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = phone_user_id));



