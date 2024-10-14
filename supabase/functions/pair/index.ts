import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { getUser } from "../_shared/get-user.ts";
import { messaging } from "../_shared/messaging.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { words } from "../_shared/words.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  const user = await (authHeader ? getUser(authHeader) : null);
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } },
  );

  const serviceSupabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { secret } = await req.json();
  const secretResult = await serviceSupabaseClient
    .from("pairing_secrets")
    .select()
    .eq("secret", secret);

  if (!secretResult.data.length) {
    return new Response(JSON.stringify({ user, secretResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const pairingResult = await supabaseClient
    .from("pairings")
    .insert({
      web_user_id: user.id,
      fcm_token_id: secretResult.data[0].fcm_token_id,
    })
    .select();

  const tokenResult = await serviceSupabaseClient
    .from("fcm_tokens")
    .select("*")
    .eq("id", pairingResult.data[0].fcm_token_id);
  const token = tokenResult.data[0].token;
  const result = await messaging.send({
    data: {
      type: "event",
      name: "paired",
    },
    token,
    android: {
      priority: "high",
    },
  });

  return new Response(JSON.stringify({ user, pairingResult, secretResult }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
