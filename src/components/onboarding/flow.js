import { useState, useEffect } from "react";
import { SMSForm } from "../sms-form.js";

export function OnboardingFlow({ supabase, onOnboardingFinished }) {
  const [installed, setInstalled] = useState(false);
  const [paired, setPaired] = useState(false);
  const [pairingAttempt, setPairingAttempt] = useState();
  const [firstSMSSent, setFirstSMSSent] = useState(false);
  const [onboardingFinished, setOnboardingFinished] = useState(false);
  const [pairingSecret, setPairingSecret] = useState("");

  useEffect(() => {
    if (!supabase) {
      return;
    }

    async function setData() {
      const userResult = await supabase.auth.getUser();
      const metadata = userResult.data.user.user_metadata;
      setInstalled(metadata.installed);
      setPaired(metadata.paired);
      setFirstSMSSent(metadata.firstSMSSent);
      setOnboardingFinished(metadata.onboardingFinished);
    }

    setData();
  }, [supabase]);

  async function updateUser(prop) {
    const userResult = await supabase.auth.getUser();
    const metadata = userResult.data.user.user_metadata;
    return supabase.auth.updateUser({
      data: { ...metadata, ...prop },
    });
  }

  function checkInstalled() {
    setInstalled(true);
    return updateUser({ installed: true });
  }

  async function pair() {
    const { data, error } = await supabase.auth.getSession();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/pair`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${data.session.access_token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          secret: pairingSecret,
        }),
      },
    );
    const content = await response.json();
    if (!content.pairingResult) {
      setPairingAttempt(pairingSecret);
      return;
    }
    if (!content.pairingResult.error) {
      setPairingSecret("");
      setPaired(true);
      updateUser({ paired: true });
      setPairingAttempt();
    } else {
      console.log(content);
    }
  }

  function checkFirstSMSSent() {
    setFirstSMSSent(true);
    updateUser({ firstSMSSent: true });
  }

  async function checkOnboardingFinished() {
    const result = await updateUser({ onboardingFinished: true });
    if (onOnboardingFinished) {
      onOnboardingFinished(result.data.user);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="content">
          <h2>Installez zSMS sur votre téléphone !{installed ? " ✅" : ""}</h2>
          {!installed ? (
            <>
              <p>
                Scannez ce QR code pour installer zSMS :
                <br />
                <img
                  src="qrcode-http-m-zsms.fr.gif"
                  alt="QR code vers m.zsms.fr"
                />
                <br />
                Vous pouvez aussi accéder aux instructions d'installation en
                allant sur <strong>m.zsms.fr</strong> depuis votre téléphone.
              </p>
              <div className="field is-grouped">
                <div className="control">
                  <button
                    className="button is-primary"
                    onClick={() => checkInstalled()}
                  >
                    C'est installé !
                  </button>
                </div>
                <div className="control">
                  <button className="button">J'ai des difficultés</button>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
          <h2>
            Associez ce site internet à votre téléphone !{paired ? " ✅" : ""}
          </h2>
          {!paired ? (
            <form>
              <div className="field">
                <label htmlFor="identifiant" className="label">
                  Identifiant
                </label>
                <div className="control">
                  <input
                    id="identifiant"
                    className={`input ${pairingAttempt ? "is-danger" : ""}`}
                    type="text"
                    value={pairingSecret}
                    placeholder="fruit-fruit-nombre"
                    onChange={(e) => setPairingSecret(e.target.value)}
                  />
                </div>
                {pairingAttempt ? (
                  <p className="help is-danger">
                    Aucun identifiant n'a été trouvé pour "{pairingAttempt}".
                  </p>
                ) : (
                  <></>
                )}
              </div>
              <div className="field is-grouped">
                <div className="control">
                  <button
                    className="button is-primary"
                    onClick={(e) => {
                      pair();
                      e.preventDefault();
                    }}
                  >
                    Associer
                  </button>
                </div>
                <div className="control">
                  <button className="button">J'ai des difficultés</button>
                </div>
              </div>
            </form>
          ) : (
            <></>
          )}
          <h2>Envoyez un premier SMS !{firstSMSSent ? " ✅" : ""}</h2>
          {!firstSMSSent ? (
            <>
              <p>Plutôt à vous-même pour commencer !</p>
              <SMSForm
                supabase={supabase}
                onSent={() => checkFirstSMSSent()}
                showSimpleOnly
              />
            </>
          ) : (
            <></>
          )}
          {firstSMSSent ? (
            <div className="field is-grouped">
              <div className="control">
                <button
                  className="button is-primary"
                  onClick={() => checkOnboardingFinished()}
                >
                  Terminer la configuration !
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </section>
  );
}
