import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import { OnboardingFlow } from "../components/onboarding/flow.js";
import { Notification } from "../components/onboarding/notification.js";
import { MockPhone } from "../components/onboarding/mock-phone.js";
import { SMSForm } from "../components/sms-form.js";
import { Debug } from "../components/debug.js";

function SignedInView({ supabase, onLogout, children }) {
  const [showLogoutDetails, setShowLogoutDetails] = useState(false);

  async function logoutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
    if (onLogout) {
      onLogout();
    }

    setShowLogoutDetails(false);
  }

  return (
    <>
      {children}
      <section className="section">
        <div className="container">
          <div className="content">
            <div className="field is-grouped">
              <div className="control">
                <button
                  className="button is-warning"
                  onClick={() => setShowLogoutDetails(!showLogoutDetails)}
                >
                  Se déconnecter
                </button>
              </div>
            </div>
            {showLogoutDetails && (
              <>
                <div class="notification">
                  En vous déconnectant,{" "}
                  <b>toutes les informations seront supprimées</b> de votre
                  navigateur. Il faudra <b>configurer à nouveau</b> un téléphone
                  pour envoyer des SMS.
                </div>

                <div className="field is-grouped">
                  <div className="control">
                    <button className="button" onClick={() => logoutUser()}>
                      Confirmer la déconnexion
                    </button>
                  </div>
                  <div className="control">
                    <button
                      className="button is-danger"
                      onClick={() => setShowLogoutDetails(!showLogoutDetails)}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

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

  async function onOnboardingFinished(user) {
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
        <SignedInView supabase={supabase} onLogout={onLogout}>
          {user?.user_metadata.onboardingFinished ? (
            <section className="section">
              <div className="container">
                <div className="content">
                  <h2>Envoyer un SMS</h2>
                  <SMSForm supabase={supabase} />
                </div>
              </div>
            </section>
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
        </SignedInView>
      )}
      <Debug>{user ? <pre>{JSON.stringify(user, null, 2)}</pre> : ""}</Debug>
    </>
  );
}
