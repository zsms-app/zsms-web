export async function send(supabase, message, phoneNumber) {
  const { data, error } = await supabase.auth.getSession();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${data.session.access_token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        message,
        phoneNumber: phoneNumber.replace(/[^(0-9)]/g, ""),
      }),
    },
  );
  return response;
}
