import { initializeApp, cert } from "npm:firebase-admin@13/app";
import { getMessaging, AndroidConfig } from "npm:firebase-admin@13/messaging";

const credential = cert({
  project_id: Deno.env.get("GOOGLE_APPLICATION_PROJECT_ID"),
  client_email: Deno.env.get("GOOGLE_APPLICATION_CLIENT_EMAIL"),
  private_key: Deno.env.get("GOOGLE_APPLICATION_PRIVATE_KEY"),
});
const app = initializeApp({
  credential,
  databaseURL: `https://${Deno.env.get("GOOGLE_APPLICATION_DATABASE")}.firebaseio.com`,
});

export const messaging = getMessaging();
