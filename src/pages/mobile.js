import Link from "next/link";
import { Header } from "@/components/header.js";

export default function Mobile() {
  return (
    <>
      <Header />
      <section className="section logos">
        <div className="container">
          <p>
            Vous pouvez télécharger l'application sur{" "}
            <strong>Google Play</strong> :
            <br />
            <a href="https://play.google.com/apps/internaltest/4700943393145190183">
              <img src="/google-play.png" alt="Logo de Google Play" />
            </a>
            <br />
            Si vous préférez éviter Google Play, vous pouvez installer
            l'application directement <strong>à partir du fichier APK</strong> :
            <br />
            <a href="https://zsms-app.github.io/zsms-artefacts/app-release.apk">
              <img src="/apk.png" alt="Logo des fichiers/paquets APK" />
            </a>
          </p>
          <p>
            En cas de difficulté ou de question, n'hésitez pas à nous contacter
            à l'adresse électronique suivante : contact@zsms.fr
          </p>
        </div>
      </section>
    </>
  );
}
