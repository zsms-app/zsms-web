import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

import { Header } from "@/components/header.js";
import { LoggedInView } from "@/components/logged-in-view.js";
import { SMSForm } from "@/components/sms-form.js";
import { cleanPhoneNumber } from "@/lib/clean-phone-number.js";
import { createCampaign } from "@/lib/create-campaign.js";

import { sendCampaign } from "@/lib/send-campaign.js";
import bluebird from "bluebird";
import mustache from "mustache";

export default function Campagne() {
  const [supabase, setSupabase] = useState();
  const [user, setUser] = useState();
  const router = useRouter();

  useEffect(() => {
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
    setSupabase(supabaseClient);

    async function getOrCreateUser() {
      const sessionResult = await supabaseClient.auth.getSession();
      if (sessionResult.error) {
        console.log(sessionResult.error);
      }
      if (sessionResult.data.session) {
        setUser(sessionResult.data?.session?.user);
        return;
      }
      const signInResult = await supabaseClient.auth.signInAnonymously({
        options: { data: { source: "web" } },
      });
      setUser(signInResult.data?.session?.user);
    }
    getOrCreateUser();
  }, []);

  function onLogout() {
    setUser();
    router.push("/");
  }

  return (
    <>
      <Header />
      {user ? (
        <LoggedInView supabase={supabase} onLogout={onLogout}>
          <section className="section">
            <div className="container">
              <SMSForm supabase={supabase} />
            </div>
          </section>
        </LoggedInView>
      ) : (
        <></>
      )}
    </>
  );
}
