import Link from "next/link";
import { Header } from "@/components/header.js";

export default function Presentation() {
  return (
    <>
      <Header />
      <section className="section">
        <div className="container">
          <h2 className="is-size-4" id="campagne">
            Campagnes de SMS
          </h2>
          <p>
            Envoyer le même SMS à plusieurs personnes en quelques clics.
            Indiquez la liste des numéros de téléphone, le texte du SMS et hop !
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="is-size-4" id="personnalisation">
            Personnalisation de SMS
          </h2>
          <p>
            Dans le cadre des premiers développements de la version beta, il est
            possible d'intégrer zSMS à{" "}
            <a target="_blank" href="https://www.getgrist.com?utm_source=zsms">
              Grist
            </a>{" "}
            et d'ajouter des champs de personnalisation. Par exemple, pour
            commencer les SMS par « Bonjour <i>Prénom</i> ».
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="is-size-4" id="suivi">
            Votre numéro de téléphone
          </h2>
          <p>
            L'objectif initial de zSMS est d'utiliser votre propre numéro de
            téléphone pour l'envoi de SMS. Cela permet de limiter le coût de
            l'envoi de ces SMS mais aussi de permettre la poursuite d'une
            conversation.
          </p>
        </div>
      </section>
    </>
  );
}
