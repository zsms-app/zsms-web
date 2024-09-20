export function Notification() {
  return (
    <div className="notification is-info">
      <div className="content">
        <p>
          Pour le moment, <strong>zSMS est en test</strong>. Pour y accéder vous
          devez{" "}
          <a href="mailto:contact@zsms.fr?subject=Test%20zSMS%20-%20Compte%20Google%20Play">
            nous indiquer à contact@zsms.fr
          </a>{" "}
          l'adresse email que vous utilisez sur Google Play. Si vous avez un
          téléphone Android mais que vous ne passez pas par Google Play, vous
          pouvez{" "}
          <a href="mailto:contact@zsms.fr?subject=Test%20zSMS">nous écrire</a>,
          nous vous mettrons l'application à disposition.
        </p>
        <ol type="1">
          <li>
            Installer l'application sur le téléphone à partir duquel vous voulez
            que les SMS soient envoyés.
          </li>
          <li>Associer votre téléphone à ce site internet.</li>
          <li>Envoyer votre premier SMS depuis votre ordinateur !</li>
        </ol>
      </div>
    </div>
  );
}
