import Link from "next/link";
import { Header } from "@/components/header.js";

export default function APropos() {
  return (
    <>
      <Header />
      <section className="section">
        <div className="container">
          <h2 className="title">À propos</h2>
          <p>
            zSMS est né d'un besoin personnel d'envoyer des SMS depuis un
            ordinateur plutôt que depuis un téléphone portable. Principalement
            utilisateur de Signal, quelques ami.es restent sur des applications
            de GAFA et pour échanger avec eux je passe par des SMS.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="title">Mentions légales</h2>
          <ul className="content">
            <li>Responsable de la publication : Thomas Guillet</li>
            <li>Contact : contact@zsms.fr</li>
            <li>
              Hébergement : Supabase chez AWS - <i>East US (North Virginia)</i>
            </li>
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="title">Politique de confidentialité</h2>
          <div className="content">
            <h3>
              Responsable du traitement et delégué à la protection des données
            </h3>
            <p>Thomas Guillet</p>
            <h3>Finalité du traitement</h3>
            <p>
              Le traitement des données personnelles est nécessaire à l'envoi
              des SMS depuis le navigateur internet.
            </p>
            <h3>Exercice des droits relatifs aux données personnelles</h3>
            <p>
              Les droits relatifs à la protection des données personnelles
              (notamment l'accès, la rectification et la suppression) s'exercent
              en écrivant à contact@zsms.fr.
            </p>
            <h3>Données collectées</h3>
            <p>
              Les données collectées dans le cadre de l'utilisation de zSMS sont
              les suivantes :
            </p>
            <ul>
              <li>
                Adresse email associée à votre compte Google Play ; pour vous
                permettre d'intégrer le groupe de personnes ayant accès à la
                version de test de l'application.
              </li>
              <li>
                Identifiants techniques de connexion ; pour vous permettre
                d'accéder aux données que vous envoyez et de les sécuriser.
              </li>
              <li>
                Identifiant technique de notification ; pour permettre l'envoi
                de SMS sans aucune manipulation de votre part.
              </li>
            </ul>
            <p>
              Les données suivantes sont transmises et stockées sur téléphone
              dans le cadre de l'utilisation de zSMS :
            </p>
            <ul>
              <li>
                Numéros de téléphone des personnes destinataires de vos
                messages ;
              </li>
              <li>Contenu des messages SMS à envoyer et</li>
              <li>Noms des campagnes d'envoi.</li>
            </ul>
            <h3>Durées de conservation</h3>
            <p>
              Les données sont conservées un an afin de permettre une expérience
              utilisateurice simplifiées. Les données enregistrées dans
              l'application mobile peuvent être supprimées par les personnes
              directement dans l'application. Elles sont supprimées au moment de
              la désinstallation de l'application.
            </p>
            <h3>Recours auprès de la CNIL</h3>
            <p>
              Si vous estimez, après nous avoir contactés, que vos droits ne
              sont pas respectés ou que le traitement n’est pas conforme à la
              réglementation sur la protection des données à caractère
              personnel, vous pouvez adresser une réclamation à la CNIL.
            </p>
            <h3>Transfert en dehors de l'Union européenne</h3>
            <p>
              Pour le bon fonctionnement de l'application, les données passent
              par l'infrastructure de Supabase hébergée chez AWS (Amazon) aux
              États-Unis, en particulier <i>East US (North Virginia)</i>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
