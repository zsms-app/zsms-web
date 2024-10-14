import { useState } from "react";

export function MockPhone(props) {
  const [token, setToken] = useState("");
  const [pairingSecret, setPairingSecret] = useState();
  const [secretId, setSecretId] = useState();

  async function saveToken() {
    const { data, error } = await props.supabase.auth.getSession();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/save-fcm-token`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${data.session.access_token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      },
    );
  }

  async function startPairing() {
    const { data, error } = await props.supabase.auth.getSession();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/start-pairing`,
      {
        headers: {
          authorization: `Bearer ${data.session.access_token}`,
        },
      },
    );
    const content = await response.json();
    setPairingSecret(content.secret);
    setSecretId(content.id);
  }

  async function stopPairing() {
    const { data, error } = await props.supabase.auth.getSession();
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/stop-pairing`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${data.session.access_token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          secret_id: secretId,
        }),
      },
    );
    setPairingSecret();
    setSecretId();
  }

  return (
    <section className="section">
      <div className="container">
        <div className="content">
          <div className="field">
            <div className="control">
              <input
                className="input"
                onChange={(e) => setToken(e.target.value)}
                value={token}
                placeholder="token"
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-primary" onClick={() => saveToken()}>
                Save token
              </button>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-primary"
                onClick={() => startPairing()}
              >
                Start pairing (generate a secret)
              </button>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-primary"
                onClick={() => stopPairing()}
              >
                Stop pairing (delete secret)
              </button>
            </div>
          </div>
        </div>
        <pre>{JSON.stringify({ token, pairingSecret }, null, 2)}</pre>
      </div>
    </section>
  );
}
