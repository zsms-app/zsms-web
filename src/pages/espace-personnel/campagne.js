import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { OnboardingFlow } from "@/components/onboarding/flow.js";
import { LoggedInView } from "@/components/logged-in-view.js";
import { MessageInputControl } from "@/components/message-input-control.js";
import { cleanPhoneNumber } from "@/lib/clean-phone-number.js";
import { createCampaign } from "@/lib/create-campaign.js";

import { sendCampaign } from "@/lib/send-campaign.js";
import bluebird from "bluebird";
import mustache from "mustache";

export default function Campagne() {
  const [supabase, setSupabase] = useState();
  const [starting, setStarting] = useState(true);
  const [user, setUser] = useState();
  const [records, setRecords] = useState();
  const [sending, setSending] = useState();
  const [phoneListText, setPhoneListText] = useState(""); //Array(15).fill("").join("\n"))
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

  useEffect(() => {
    setRecords(
      phoneListText
        .split("\n")
        .map((value) => value.trim())
        .filter((value) => !value.startsWith("#"))
        .map((value) => cleanPhoneNumber(value))
        .filter((line) => line.length),
    );
  }, [phoneListText]);

  useEffect(() => {
    if (user) {
      setStarting(false);
    }
  }, [user]);

  async function sendSMSs() {
    setSending(true);
    const response = await sendCampaign(supabase, {
      message: messageTemplate,
      phoneNumbers: records,
      campaignName,
    });
    const { result } = await response.json();
    setSending(false);
  }

  function onOnboardingFinished(user) {
    setUser(user);
  }

  function onLogout() {
    setUser();
    router.push("/");
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
  }

  const [campaignName, setCampaignName] = useState("");

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">
            <Link href="/espace-personnel">zSMS</Link>{" "}
          </h1>
          <h2 className="subtitle">
            Envoi du même SMS à plusieurs numéros de téléphone
          </h2>
        </div>
      </section>
      {user ? (
        <LoggedInView supabase={supabase} onLogout={onLogout}>
          {user.user_metadata.onboardingFinished ? (
            <section className="section">
              <div className="container">
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label htmlFor="phoneList" className="label">
                        Liste des numéros de téléphone
                      </label>
                      <div className="control">
                        <textarea
                          className="textarea"
                          id="phoneList"
                          rows="5"
                          value={phoneListText}
                          onChange={(e) => setPhoneListText(e.target.value)}
                        />
                      </div>
                      <p className="help">Un numéro de téléphone par ligne</p>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label htmlFor="template" className="label">
                        Message
                      </label>
                      <MessageInputControl
                        value={messageTemplate}
                        onChange={(e) => updateTemplate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
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
                    Ce nom vous permettra d'accéder aux informations relatives à
                    cet envoi sur votre téléphone portable.
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
