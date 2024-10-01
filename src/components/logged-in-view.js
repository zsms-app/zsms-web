import { useState } from "react";

export function LoggedInView({ supabase, onLogout, children }) {
  const [showLogoutDetails, setShowLogoutDetails] = useState(false);

  async function logoutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
    if (onLogout) {
      onLogout();
    }

    setShowLogoutDetails(false);
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
                  onClick={() => setShowLogoutDetails(!showLogoutDetails)}
                >
                  Se déconnecter
                </button>
              </div>
            </div>
            {showLogoutDetails && (
              <>
                <div className="notification">
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
}
