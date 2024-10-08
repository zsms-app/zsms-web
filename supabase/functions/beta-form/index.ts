import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  return new Response("OK", {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/plain",
      location:
        "https://2a5fd5cb.sibforms.com/serve/MUIFAENh-AOnyqmgHDwofVe_vgHrzUG3rtAgHvRyePOV_PUG_B0GKtfjGMw1VgK6XgpXCeOTQDOVw1a0bQhVVcl6ThIFrQq-JsD2Yt1ehbDpifXyCbI626xz1nTEqqo0RpcIq-J44HhfDDtf1yLtkMQ10X6-Hs3SuKoTVLkuGuRAd1piDGXLt6hIpgvbPbK-7LFtY5fqcbP2mmQ9",
    },
    status: 302,
  });
});
