import { cleanPhoneNumber } from "@/lib/clean-phone-number.js";

export async function sendCampaign(supabase, body) {
  const { data, error } = await supabase.auth.getSession();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-campaign`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${data.session.access_token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  return response;
}
