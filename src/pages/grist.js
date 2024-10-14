import { useState, useEffect } from "react";
import Script from "next/script";
import { createClient } from "@supabase/supabase-js";
import { OnboardingFlow } from "../components/onboarding/flow.js";
import { LoggedInView } from "../components/logged-in-view.js";
import { MessageInputControl } from "../components/message-input-control.js";
import { createCampaign } from "@/lib/create-campaign.js";
import { send } from "../lib/send.js";
import bluebird from "bluebird";
import mustache from "mustache";

export default function Grist() {
  const [supabase, setSupabase] = useState();
  const [starting, setStarting] = useState(true);
  const [user, setUser] = useState();
  const [records, setRecords] = useState();
  const [sending, setSending] = useState();
  const [sentCount, setSentCount] = useState(0);

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
    });

    async function getSavedTemplate() {
      updateTemplate((await grist.getOption("messageTemplate")) || "");
    }
    getSavedTemplate();

    window.grist.onRecords((records) => {
      if (!records) {
        return;
      }
      setRecords(records);
    });
  }, []);

  useEffect(() => {
    if (user) {
      setStarting(false);
    }
  }, [user]);

  async function sendSMSs() {
    setSentCount(0);
    setSending(true);

    let campaignId;
    if (campaignName) {
      var c = await createCampaign(supabase, {
        name: campaignName,
        size: records?.length,
      });
      campaignId = c.id;
    }

    var table = window.grist.getTable();
    await bluebird.map(
      records,
      async (record) => {
        const message = mustache.render(messageTemplate, record);
        const response = await send(supabase, {
          message,
          phoneNumber: record.Telephone,
          campaignId,
        });
        const { result } = await response.json();
        await table.update({
          id: record.id,
          fields: {
            SMSId: result,
            SMSDate: new Date(),
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

  const [showDetails, setShowDetails] = useState(false);

  const [messageTemplate, setMessageTemplate] = useState("");
  const [messageDemo, setMessageDemo] = useState("");

  useEffect(() => {
    try {
      setMessageDemo(mustache.render(messageTemplate, records[0]));
    } catch (e) {
      setMessageDemo(messageTemplate);
    }
  }, [messageTemplate, records]);

  function updateTemplate(value) {
    setMessageTemplate(value);
    grist.setOption("messageTemplate", value);
  }

  const [campaignName, setCampaignName] = useState("");

  return (
    <>
      <Script
        src="https://docs.getgrist.com/grist-plugin-api.js"
        strategy="beforeInteractive"
        async=""
      />
      {user ? (
        <LoggedInView supabase={supabase} onLogout={onLogout}>
          {user.user_metadata.onboardingFinished ? (
            <section className="section">
              <div className="container">
                <div className="field">
                  <label htmlFor="template" className="label">
                    Template du message
                  </label>
                  <MessageInputControl
                    value={messageTemplate}
                    onChange={(e) => updateTemplate(e.target.value)}
                  />
                </div>
                {records?.length ? (
                  <div className="field">
                    <label className="label">Prévisualisation</label>
                    <div className="card">
                      <header className="card-header">
                        <p className="card-header-title">
                          SMS au {records[0].Telephone} (1/
                          {records.length})
                        </p>
                      </header>
                      <pre className="card-content">{messageDemo}</pre>
                      <footer className="card-footer">
                        <p className="card-footer-item"></p>
                        <p className="card-footer-item"></p>
                      </footer>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                <div className="field">
                  <label htmlFor="campaign" className="label">
                    Nom de la campagne d'envoi
                  </label>
                  <div className="control">
                    <input
                      id="campaign"
                      className="input"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                    />
                  </div>
                  <p className="help">
                    Une campagne permet de regrouper les messages.
                  </p>
                </div>

                <div className="field">
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

                <div className="field">
                  <div className="card">
                    <button
                      className="card-header"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      <div className="card-header-title">Données brutes</div>
                      <div className="card-header-icon">
                        <span className="icon">
                          <i aria-hidden="true">+/-</i>
                        </span>
                      </div>
                    </button>
                    {showDetails ? (
                      <>
                        <pre className="card-content">
                          {records?.length
                            ? JSON.stringify(records[0], null, 2)
                            : ""}
                        </pre>
                        <footer className="card-footer">
                          <p className="card-footer-item"></p>
                          <p className="card-footer-item"></p>
                        </footer>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <OnboardingFlow
              supabase={supabase}
              onOnboardingFinished={onOnboardingFinished}
            />
          )}
        </LoggedInView>
      ) : starting ? (
        <>Chargement en cours…</>
      ) : (
        <>Il faut rafraîchir la page.</>
      )}
    </>
  );
}
