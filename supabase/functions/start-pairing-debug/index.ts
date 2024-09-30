import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { getUser } from "../_shared/get-user.ts";
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

  console.log("pre serviceSupabaseClient");
  const serviceSupabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  console.log("post serviceSupabaseClient");
  const word1 = words[Math.floor(words.length * Math.random())];
  const word2 = words[Math.floor(words.length * Math.random())];
  const number = Math.floor(Math.random() * 1000);
  const secret = `${word1}-${word2}-${number}`;

  console.log("pre fcm_tokens fetch");
  const fcmTokenResult = await supabaseClient.from("fcm_tokens").select();
  console.log("post fcm_tokens fetch / pre pairing_secrets insert");
  const secretResult = await serviceSupabaseClient
    .from("pairing_secrets")
    .insert({
      fcm_token_id: fcmTokenResult.data[0].id,
      secret,
      phone_user_id: user.id,
    })
    .select();
  console.log("post pairing_secrets insert");

  const secretRecord = secretResult.data[0];
  return new Response(
    JSON.stringify({ id: secretRecord.id, secret: secretRecord.secret }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
