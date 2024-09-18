import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  return new Response("OK", {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/plain",
      location: "https://zsms.fr/m",
    },
    status: 302,
  });
});
