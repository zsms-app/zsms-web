import { useState } from "react";

export function LoggedInView({ supabase, onLogout, children }) {
  async function logoutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
    if (onLogout) {
      onLogout();
    }
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
                  onClick={() => logoutUser()}
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
