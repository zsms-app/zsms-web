import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import { Header } from "@/components/header.js";
import { Debug } from "@/components/debug.js";
import { LoggedInView } from "@/components/logged-in-view.js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function Home() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState();
  const router = useRouter();

  async function login() {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000/retour",
      },
    });
    console.log({ data, error });
    if (error == null) {
      setToken("");
    }
  }

  async function verifyOtp() {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (data?.user) {
      router.push("/espace-personnel");
    }
    console.log({ data, error });
  }

  return (
    <>
      <Header />
      <section className="section">
        <div className="container">
          <h2 className="is-size-2">Connexion</h2>
          <form>
            <div className="field">
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="control">
                <input
                  id="email"
                  className="input"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            {token == null ? (
              <div className="field is-grouped">
                <div className="control">
                  <button
                    className="button is-primary"
                    onClick={(e) => {
                      login();
                      e.preventDefault();
                    }}
                  >
                    Se connecter
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="field">
                  <label htmlFor="code" className="label">
                    Code
                  </label>
                  <div className="control">
                    <input
                      id="code"
                      className="input"
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field is-grouped">
                  <div className="control">
                    <button
                      className="button is-primary"
                      onClick={(e) => {
                        verifyOtp();
                        e.preventDefault();
                      }}
                    >
                      Valider le code
                    </button>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      </section>
      <Debug></Debug>
    </>
  );
}
