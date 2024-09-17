import { corsHeaders } from "../_shared/cors.ts";
import { getUser } from "../_shared/get-user.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  const user = await (authHeader ? getUser(authHeader) : null);

  return new Response(JSON.stringify({ now: new Date(), user }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
