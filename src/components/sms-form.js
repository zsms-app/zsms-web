import { useState } from "react";

export function SMSForm({ supabase, onSent }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function sendMessage() {
    setSending(true);
    const { data, error } = await supabase.auth.getSession();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${data.session.access_token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          message,
          phoneNumber: phoneNumber.replace(/[^(0-9)]/g, ""),
        }),
      },
    );
    setSending(false);
    if (onSent) {
      onSent(response);
    }
  }

  return (
    <form>
      <div className="field">
        <label htmlFor="phone" className="label">
          Destinataire
        </label>
        <div className="control">
          <input
            id="phone"
            className="input"
            type="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="message" className="label">
          Message
        </label>
        <div className="control">
          <input
            id="message"
            className="input"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>
      <div className="field is-grouped">
        <div className="control">
          <button
            className="button is-link"
            disabled={sending}
            onClick={(e) => {
              sendMessage();
              e.preventDefault();
            }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </form>
  );
}
