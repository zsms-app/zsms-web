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

  const tokenResult = await supabaseClient
    .from("fcm_tokens")
    .select("*")
    .eq("phone_user_id", user.id);

  const token = tokenResult.data[0].token;
  const data = await req.json();
  const pingResult = await supabaseClient
    .from("pings")
    .insert({
      user_id: user.id,
      sent_at: data.sentAt,
    })
    .select("*");

  const result = await messaging.send({
    data: {
      id: pingResult.data[0].id.toString(),
      name: "ping",
      type: "event",
    },
    token,
    android: {
      priority: "high",
    },
  });

  return new Response(JSON.stringify({ result }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
