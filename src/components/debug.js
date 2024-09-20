import { useRouter } from "next/router";
import { useState, useEffect } from "react";
export function Debug(props) {
  const router = useRouter();
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    console.log(JSON.stringify(process.env.NODE_ENV));
    console.log(router);
    setDebug(
      router.query.debug !== undefined ||
        process.env.NODE_ENV === "development",
    );
  }, [router]);

  return <>{debug ? props.children : <></>}</>;
}
