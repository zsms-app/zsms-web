import Link from "next/link";

export default function Mobile() {
  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">
            <Link href="/">zSMS</Link>{" "}
          </h1>
          <p className="subtitle">
            Envoyez des SMS simplement depuis votre ordinateur !
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="title">À propos</h2>
          <p>
            zSMS est né d'un besoin personnel d'envoyer des SMS depuis un
            ordinateur plutôt que depuis un téléphone portable. Principalement
            utilisateur de Signal, quelques ami.es restent sur des applications
            de GAFA et pour échanger avec eux je passe pas des SMS.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="title">Mentions légales</h2>
          <p className="content">
            <ul>
              <li>
                Responsable de la publication et delégué à la protection des
                données : Thomas Guillet
              </li>
              <li>Contact : contact@zsms.fr</li>
              <li>
                Hébergement : Supabase chez AWS -{" "}
                <i>East US (North Virginia)</i>
              </li>
            </ul>
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="title">Politique de confidentialité</h2>
          <div className="content">
            <p>
              https://zsms-app.github.io/zsms-artefacts/app-release-0.0.4.apk
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
