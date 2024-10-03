import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import { OnboardingFlow } from "../components/onboarding/flow.js";
import { Notification } from "../components/onboarding/notification.js";
import { MockPhone } from "../components/onboarding/mock-phone.js";
import { SMSForm } from "../components/sms-form.js";
import { Debug } from "../components/debug.js";
import { LoggedInView } from "../components/logged-in-view.js";

export default function Home() {
  const [supabase, setSupabase] = useState();

  const [user, setUser] = useState();
  const [token, setToken] = useState("");

  async function createUser() {
    const { data, error } = await supabase.auth.signInAnonymously({
      options: { data: { source: "web" } },
    });
    setUser(data?.session?.user);
  }

  useEffect(() => {
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
    setSupabase(supabaseClient);

    async function getUser() {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        console.log(error);
      }
      setUser(data?.session?.user);
    }
    getUser();
  }, []);

  function onOnboardingFinished(user) {
    setUser(user);
  }

  function onLogout() {
    setUser();
  }

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">
            <Link href="/">zSMS</Link>{" "}
          </h1>
          <p className="subtitle">
            Envoyez des SMS simplement depuis votre ordinateur !
          </p>
          <p>
            <Link className="is-underlined" href="/a-propos">
              En savoir plus
            </Link>
          </p>
        </div>
      </section>
      {!user ? (
        <section className="section">
          <Notification />

          <div className="container">
            <div className="content">
              <div className="field is-grouped">
                <div className="control">
                  <button
                    className="button is-primary"
                    onClick={() => createUser()}
                  >
                    Commencer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <LoggedInView supabase={supabase} onLogout={onLogout}>
          {user?.user_metadata.onboardingFinished ? (
            <>
              <section className="section">
                <div className="container">
                  <div className="content">
                    <h2>Envoyer un SMS</h2>
                    <SMSForm supabase={supabase} />
                  </div>
                </div>
              </section>
              <section className="section">
                <div className="container">
                  <div className="content">
                    <h2>Envoyer le même SMS à plusieurs personnes</h2>
                    <p>
                      C'est vraiment facile à faire à partir de la liste des
                      numéros et{" "}
                      <Link className="is-underlined" href="/campagne">
                        c'est par ici
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <>
              <OnboardingFlow
                supabase={supabase}
                onOnboardingFinished={onOnboardingFinished}
              />
              <Debug>
                <MockPhone supabase={supabase} />
              </Debug>
            </>
          )}
        </LoggedInView>
      )}
      <Debug>{user ? <pre>{JSON.stringify(user, null, 2)}</pre> : ""}</Debug>
    </>
  );
}
