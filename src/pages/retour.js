import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import { Header } from "@/components/header.js";

export default function Home() {
  const [supabase, setSupabase] = useState();
  const [savedError, setSavedError] = useState();
  const router = useRouter();

  useEffect(() => {
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
    setSupabase(supabaseClient);

    async function getUser() {
      const { data, error } = await supabaseClient.auth.getUser();
      if (error) {
        setSupabase(error);
      } else {
        router.push("/espace-personnel");
      }
    }
    getUser();
  }, []);

  return (
    <>
      <Header />
      <section className="section">
        <div className="container"></div>
      </section>
    </>
  );
}
