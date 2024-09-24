import { useState, useEffect } from "react";
import Script from "next/script";
import { createClient } from "@supabase/supabase-js";
import { OnboardingFlow } from "../components/onboarding/flow.js";
import { LoggedInView } from "../components/logged-in-view.js";
import { send } from "../lib/send.js";
import bluebird from "bluebird";

export default function Grist() {
  const [mappings, setMappings] = useState();
  const [supabase, setSupabase] = useState();
  const [user, setUser] = useState();
  const [records, setRecords] = useState();
  const [sending, setSending] = useState();
  const [sentCount, setSentCount] = useState();

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

    window.grist.ready({
      requiredAccess: "full",
      columns: [
        { name: "Numéro", type: "Text" },
        { name: "Contenu", type: "Text" },
        { name: "Validation", type: "DateTime" },
      ],
    });
    window.grist.onRecords((records, mappings) => {
      if (!records) {
        return;
      }
      setMappings(mappings);
      setRecords(records);
    });
  }, []);

  async function sendSMSs() {
    setSending(true);
    setSentCount(0);
    var table = window.grist.getTable();
    await bluebird.map(
      records,
      async (record) => {
        const res = await send(
          supabase,
          record[mappings.Contenu],
          record[mappings.Numéro],
        );
        await table.update({
          id: record.id,
          fields: {
            [mappings.Validation]: new Date(),
          },
        });
        await new Promise((resolve) => {
          setTimeout(resolve, 500 + 1000 * Math.random());
        });
        return setSentCount((s) => s + 1);
      },
      { concurrency: 3 },
    );
    setSending(false);
  }

  function onOnboardingFinished(user) {
    setUser(user);
  }

  function onLogout() {
    setUser();
  }

  return (
    <>
      <Script
        src="https://docs.getgrist.com/grist-plugin-api.js"
        strategy="beforeInteractive"
        async=""
      />
      {user ? (
        <>
          {user.user_metadata.onboardingFinished ? (
            <LoggedInView supabase={supabase} onLogout={onLogout}>
              <section className="section">
                <div className="container">
                  <div className="field is-grouped">
                    <div className="control">
                      <button
                        disabled={sending}
                        className="button"
                        onClick={() => sendSMSs()}
                      >
                        Envoyer {records?.length} SMS
                      </button>
                    </div>
                  </div>

                  <progress
                    className="field progress"
                    value={sentCount}
                    max={records?.length}
                  >
                    {sentCount}/{records?.length}
                  </progress>
                  {records?.length ? (
                    <div className="card">
                      <header className="card-header">
                        <p className="card-header-title">
                          SMS au {records[0][mappings.Numéro]} (1/
                          {records.length})
                        </p>
                      </header>
                      <div className="card-content">
                        <pre className="content">
                          {records[0][mappings.Contenu]}
                        </pre>
                      </div>
                      <footer className="card-footer">
                        <p className="card-footer-item"></p>
                        <p className="card-footer-item"></p>
                      </footer>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </section>
            </LoggedInView>
          ) : (
            <OnboardingFlow
              supabase={supabase}
              onOnboardingFinished={onOnboardingFinished}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
}
