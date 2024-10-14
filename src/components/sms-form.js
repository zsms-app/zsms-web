import { useState } from "react";
import { createCampaign } from "@/lib/create-campaign.js";
import { cleanPhoneNumber } from "@/lib/clean-phone-number.js";
import { send } from "@/lib/send.js";

export function SMSForm({ supabase, onSent, showSimpleOnly }) {
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState();

  const [showCampaignMode, setShowCampaignMode] = useState(false);
  const [campaignName, setCampaignName] = useState("Cool campagne");
  const [campaign, setCampaign] = useState();

  const [sending, setSending] = useState(false);

  async function sendMessage() {
    const phoneNumber = cleanPhoneNumber(phoneNumberInput);
    if (!message) {
      setError("Le message à envoyer ne doit pas être vide.");
      return;
    }
    if (!phoneNumber) {
      setError(
        "Le numéro de téléphone ne semble pas valide, seuls les nombres et le symbole + sont acceptés.",
      );
      return;
    }
    setError();
    setSending(true);
    let response;
    if (showCampaignMode && campaignName) {
      if (campaign) {
        response = await send(supabase, {
          message,
          phoneNumber,
          campaignId: campaign.id,
        });
      } else {
        var c = await createCampaign(supabase, { name: campaignName, size: 1 });
        setCampaign(c);
        response = await send(supabase, {
          message,
          phoneNumber,
          campaignId: c.id,
        });
      }
    } else {
      response = await send(supabase, { message, phoneNumber });
    }
    setSending(false);
    setMessage("");
    setPhoneNumberInput("");
    if (onSent) {
      onSent(await response.json());
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
            value={phoneNumberInput}
            onChange={(e) => setPhoneNumberInput(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="message" className="label">
          Message
        </label>
        <div className="control">
          <textarea
            className="textarea"
            id="message"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => {
              if (e.ctrlKey && e.keyCode == 13) {
                sendMessage();
              }
            }}
          />
        </div>
      </div>
      {showSimpleOnly ? (
        <></>
      ) : (
        <>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  value={showCampaignMode}
                  onChange={() => setShowCampaignMode(!showCampaignMode)}
                />{" "}
                Afficher le mode <i>campagne d'envoi</i> pour regrouper les
                messages sur le téléphone.
              </label>
            </div>
          </div>
          {showCampaignMode ? (
            <div className="field">
              <label htmlFor="campaign" className="label">
                Nom de la campagne d'envoi
              </label>
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input
                    id="campaign"
                    className="input"
                    type="text"
                    value={campaignName}
                    disabled={campaign ? true : false}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>
                {campaign ? (
                  <div className="control">
                    <button
                      type="button"
                      className="button is-warning"
                      onClick={() => setCampaign()}
                    >
                      Supprimer
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
      <div className="field">
        {error ? <p className="help is-danger">{error}</p> : <></>}
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
