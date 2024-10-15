create policy "Enable insert for users based on user_id"
on "public"."messages"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = web_user_id));



