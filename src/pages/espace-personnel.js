import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import { Header } from "@/components/header.js";
import { OnboardingFlow } from "@/components/onboarding/flow.js";
import { MockPhone } from "@/components/onboarding/mock-phone.js";
import { SMSForm } from "@/components/sms-form.js";
import { Debug } from "@/components/debug.js";
import { LoggedInView } from "@/components/logged-in-view.js";

export default function EspacePersonnel() {
  const router = useRouter();
  const [supabase, setSupabase] = useState();

  const [user, setUser] = useState();

  async function createUser(supabase) {
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

      if (!data?.session?.user) {
        createUser(supabaseClient);
      }
    }
    getUser();
  }, []);

  function onOnboardingFinished(user) {
    setUser(user);
  }

  function onLogout() {
    setUser();

    router.push("/");
  }

  return (
    <>
      <Header />
      {!user ? (
        <>Chargement en cours…</>
      ) : (
        <LoggedInView supabase={supabase} onLogout={onLogout}>
          {user?.user_metadata.onboardingFinished ? (
            <>
              <section className="section">
                <div className="container">
                  <div className="content">
                    <h2>Envoyer un SMS</h2>
                    <Link className="button" href="espace-personnel/message">
                      C'est par ici
                    </Link>
                  </div>
                </div>
              </section>
              <section className="section">
                <div className="container">
                  <div className="content">
                    <h2>Envoyer le même SMS à plusieurs personnes</h2>
                    <p>
                      C'est vraiment facile à faire à partir de la liste des
                      numéros.
                    </p>
                    <Link className="button" href="espace-personnel/campagne">
                      C'est par ici
                    </Link>
                  </div>
                </div>
              </section>
              <section className="section">
                <div className="container">
                  <div className="content">
                    <h2>Envoyer un SMS personnalisé à plusieurs personnes</h2>
                    <p>
                      C'est vraiment facile aussi et il y a une démonstration
                      disponible avec Grist.
                    </p>

                    <Link
                      className="button"
                      target="_blank"
                      href="https://zsms.getgrist.com/qxDA8phQ34xj/Demonstration/p/1"
                    >
                      C'est par ici
                    </Link>
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
