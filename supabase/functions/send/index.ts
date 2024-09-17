import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { initializeApp, cert } from "npm:firebase-admin/app"
import { getMessaging, AndroidConfig } from "npm:firebase-admin/messaging"

import { createClient } from 'jsr:@supabase/supabase-js@2'

import { corsHeaders } from '../_shared/cors.ts'

const app = initializeApp({
 credential: cert({
    project_id: Deno.env.get("GOOGLE_APPLICATION_PROJECT_ID"),
    clientEmail: Deno.env.get("GOOGLE_APPLICATION_CLIENT_EMAIL"),
    privateKey: Deno.env.get("GOOGLE_APPLICATION_PRIVATE_KEY")
  }),
 databaseURL: `https://${Deno.env.get("GOOGLE_APPLICATION_DATABASE")}.firebaseio.com`
});
const messaging = getMessaging();

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  const { deviceId, phoneNumber, message } = await req.json()
  const { data, error } = await supabaseClient.from('devices').select('*').eq('id', deviceId)
  if (error) {
    return new Response(
      JSON.stringify({error}),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }

  const token =   data[0].token
  const result = await messaging.send({
    data: { dest: phoneNumber, message},
    token,
    android: {
      priority: "high"
    }
  })//*/

  return new Response(
    JSON.stringify({result}),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})
