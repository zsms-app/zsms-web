import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { SegmentedMessage } from "npm:sms-segments-calculator";
import { corsHeaders } from "../_shared/cors.ts";
import { getUser } from "../_shared/get-user.ts";
import { getToken } from "../_shared/get-token.ts";
import { messaging } from "../_shared/messaging.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } },
  );
  const user = await (authHeader ? getUser(authHeader) : null);

  const data = await req.json();

  const serviceSupabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { error, token, phone_user_id } = await getToken(
    supabaseClient,
    serviceSupabase,
  );
  if (error) {
    new Response(JSON.stringify({ error }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const campaignResult = await supabaseClient
    .from("campaigns")
    .insert({
      web_user_id: user.id,
      phone_user_id,
      name: data.campaignName,
      size: data.phoneNumbers.length,
    })
    .select();
  const campaign = campaignResult.data[0].id;

  const result = await messaging.send({
    data: {
      ...data,
      phoneNumbers: data.phoneNumbers.join("\n"),
      campaignId: campaign,
      type: "campaign",
    },
    token,
    android: {
      priority: "high",
    },
  });

  var msg = new SegmentedMessage(data.message);
  await supabaseClient.from("messages").insert({
    web_user_id: user.id,
    phone_user_id,
    firebase_id: `campaign@${result}`,
    encoding_name: msg.encodingName,
    segment_count: msg.segments.length,
    campaign_id: campaign,
  });

  return new Response(JSON.stringify({ result }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
