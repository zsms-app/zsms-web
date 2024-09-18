import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export default function Home() {
  const [supabase, setSupabase] = useState();

  const [user, setUser] = useState();
  const [devices, setDevices] = useState([]);

  const [token, setToken] = useState("");

  const [selectedDevice, setSelectedDevice] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [showLogoutDetails, setShowLogoutDetails] = useState(false);

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

  async function createUser() {
    const { data, error } = await supabase.auth.signInAnonymously({
      options: { data: { source: "web" } },
    });
    setUser(data?.session?.user);
  }

  async function logoutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }

    setUser();
    setDevices([]);

    setToken("");

    setSelectedDevice("");
    setPhoneNumber("");
    setMessage("");

    setShowLogoutDetails(false);
  }

  async function fetchDevices(supabase, setDevices) {
    const { data, error } = await supabase.from("devices").select();
    if (error) {
      console.error(error);
      return;
    }
    setDevices(data);
  }

  useEffect(() => {
    if (supabase && user) {
      fetchDevices(supabase, setDevices);
    }
  }, [supabase, user]);

  useEffect(() => {
    if (devices.length && !selectedDevice) {
      setSelectedDevice(devices[0].id);
    }
  }, [devices, selectedDevice]);

  async function addDevice() {
    await supabase.from("devices").insert({ token, user_id: user.id });
    fetchDevices(supabase, setDevices);
    setToken("");
  }

  async function sendMessage() {
    setSending(true);
    const { data, error } = await supabase.auth.getSession();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${data.session.access_token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          deviceId: selectedDevice,
          message,
          phoneNumber: phoneNumber.replace(/[^(0-9)]/g, ""),
        }),
      },
    );
    setSending(false);
  }

  const basicStartButton = () => (
    <section className="section">
      <div className="container">
        <div className="field is-grouped">
          <div className="control">
            <button className="button is-primary" onClick={() => createUser()}>
              Commencer
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const tokenList = () => (
    <section className="section">
      <div className="container">
        <div className="content">
          <h2>Ajouter des téléphones pour envoyer des SMS</h2>
          <h3>Liste des téléphones ajoutés</h3>
          <ul>
            {devices.map((d) => (
              <li key={d.id}>{d.token}</li>
            ))}
          </ul>
        </div>
        <form>
          <div className="field">
            <label className="label">Identifiant</label>
            <div className="control">
              <input
                className="input"
                type="phone"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button
                className="button is-link"
                onClick={(e) => {
                  addDevice();
                  e.preventDefault();
                }}
              >
                Ajouter
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );

  const signedInView = () => (
    <>
      {tokenList()}
      <section className="section">
        <div className="container">
          <div className="content">
            <h2>Envoyer un SMS</h2>
            <form>
              <div className="field">
                <label htmlFor="device" className="label">
                  Téléphone
                </label>
                <div className="control">
                  <div className="select">
                    <select
                      id="device"
                      onChange={(e) => setSelectedDevice(e.target.value)}
                    >
                      {devices.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.token}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label htmlFor="phone" className="label">
                  Destinataire
                </label>
                <div className="control">
                  <input
                    id="phone"
                    className="input"
                    type="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="message" className="label">
                  Message
                </label>
                <div className="control">
                  <input
                    id="message"
                    className="input"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>
              <div className="field is-grouped">
                <div className="control">
                  <button
                    className="button is-link"
                    disabled={sending}
                    onClick={(e) => {
                      sendMessage();
                      e.preventDefault();
                    }}
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
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

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">zSMS</h1>
          <p className="subtitle">
            Envoyez des SMS simplement depuis votre ordinateur !
          </p>
        </div>
      </section>
      {user ? signedInView() : basicStartButton()}
      {user ? <pre>{JSON.stringify(user, null, 2)}</pre> : ""}
    </>
  );
}
