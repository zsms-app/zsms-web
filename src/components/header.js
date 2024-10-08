import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export function Header() {
  const [showLink, setShowLink] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setShowLink(router.route !== "/a-propos");
  }, [router]);

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">
          <Link href="/">zSMS</Link>{" "}
        </h1>
        <p className="subtitle">
          Envoyez des SMS depuis votre ordinateur
          <br />
          avec <b>votre propre numéro</b> de téléphone !
        </p>
        {showLink ? (
          <p>
            <Link className="is-underlined" href="/a-propos">
              En savoir plus
            </Link>
          </p>
        ) : (
          <></>
        )}
      </div>
    </section>
  );
}
