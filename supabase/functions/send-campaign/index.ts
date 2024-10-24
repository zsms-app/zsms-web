import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { SegmentedMessage } from "npm:sms-segments-calculator";
import { corsHeaders } from "../_shared/cors.ts";
import { getUser } from "../_shared/get-user.ts";
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
  const pairingResult = await supabaseClient.from("pairings").select("*");
  if (pairingResult.error) {
    return new Response(JSON.stringify({ error: pairingResult.error }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const serviceSupabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
  const tokenResult = await serviceSupabaseClient
    .from("fcm_tokens")
    .select("*")
    .eq("id", pairingResult.data[0].fcm_token_id);

  const campaignResult = await supabaseClient
    .from("campaigns")
    .insert({
      web_user_id: user.id,
      phone_user_id: tokenResult.data[0].phone_user_id,
      name: data.campaignName,
      size: data.phoneNumbers.length,
    })
    .select();

  const token = tokenResult.data[0].token;
  const result = await messaging.send({
    data: {
      ...data,
      phoneNumbers: data.phoneNumbers.join("\n"),
      campaignId: campaignResult.data[0].id,
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
    phone_user_id: tokenResult.data[0].phone_user_id,
    firebase_id: `campaign@${result}`,
    encoding_name: msg.encodingName,
    segment_count: msg.segments.length,
    campaign_id: campaignResult.data[O].id,
  });

  return new Response(JSON.stringify({ result }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
