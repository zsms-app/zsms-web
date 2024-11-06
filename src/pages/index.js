import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import { Header } from "@/components/header.js";
import { OnboardingFlow } from "@/components/onboarding/flow.js";
import { MockPhone } from "@/components/onboarding/mock-phone.js";
import { SMSForm } from "@/components/sms-form.js";
import { Debug } from "@/components/debug.js";
import { LoggedInView } from "@/components/logged-in-view.js";

export default function Home() {
  const [supabase, setSupabase] = useState();
  const [user, setUser] = useState();
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

  return (
    <>
      <Header />
      <section className="section">
        <div className="container">
          <p></p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {user ? (
            <Link className="button is-primary" href="/espace-personnel">
              Accéder à l'espace connecté
            </Link>
          ) : (
            <Link className="button is-primary" href="/connexion">
              Tester zSMS ! 🎉
            </Link>
          )}
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="card">
            <div className="card-content">
              <div className="content">
                <h2>Campagnes de SMS</h2>
                <p></p>
                <p>
                  <Link className="is-underlined" href="/presentation#campagne">
                    En savoir plus
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="card">
            <div className="card-content">
              <div className="content">
                <h2>Personnalisation de SMS</h2>
                <p></p>
                <p>
                  <Link
                    className="is-underlined"
                    href="/presentation#personnalisation"
                  >
                    En savoir plus
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="card">
            <div className="card-content">
              <div className="content">
                <h2>Pas de changement pour vous !</h2>
                <p></p>
                <p>
                  <Link className="is-underlined" href="/presentation#suivi">
                    En savoir plus
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Debug>
        <a href="/app-release.apk">APK</a>
      </Debug>
    </>
  );
}
