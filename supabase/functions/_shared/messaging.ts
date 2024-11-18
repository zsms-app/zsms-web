import { initializeApp, cert } from "npm:firebase-admin/app";
import { getMessaging, AndroidConfig } from "npm:firebase-admin/messaging";

const credential = cert({
  projectId: Deno.env.get("GOOGLE_APPLICATION_PROJECT_ID"),
  clientEmail: Deno.env.get("GOOGLE_APPLICATION_CLIENT_EMAIL"),
  privateKey: Deno.env.get("GOOGLE_APPLICATION_PRIVATE_KEY"),
});
console.log(credential);
const app = initializeApp({
  credential,
  databaseURL: `https://${Deno.env.get("GOOGLE_APPLICATION_DATABASE")}.firebaseio.com`,
});

export const messaging = getMessaging();
