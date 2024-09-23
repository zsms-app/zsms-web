import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

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

  const { secret_id } = await req.json();
  const secretResult = await supabaseClient
    .from("pairing_secrets")
    .delete()
    .eq("id", secret_id);

  return new Response(JSON.stringify({ secretResult }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
