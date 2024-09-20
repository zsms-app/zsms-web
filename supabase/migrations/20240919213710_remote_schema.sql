create policy "select"
on "public"."fcm_tokens"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = phone_user_id));


create policy "update"
on "public"."fcm_tokens"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = phone_user_id));



