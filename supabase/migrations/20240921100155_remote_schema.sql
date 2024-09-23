create policy "delete"
on "public"."pairing_secrets"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = phone_user_id));



