"use client";

import { useState } from "react";
import Icon from "./Icon";
import { coupleNames } from "@/lib/wedding";

const MAX = 500;

export default function Wishes({ defaultName = "" }: { defaultName?: string }) {
  const [name, setName] = useState(defaultName);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const who = name.trim();
    const message = text.trim();
    if (!who || !message) {
      setStatus("Please add your name and a few words.");
      return;
    }
    setSending(true);
    setStatus("");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: who, message, invitedAs: defaultName }),
      });
      const result = await res.json().catch(() => ({ ok: false }));
      if (!result.ok) throw new Error();
      setText("");
      setStatus("Thank you! Your wishes have been sent to the couple.");
    } catch {
      setStatus("Sorry, we couldn't send your wish. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="wishes" className="wrap section wishes">
      <div className="sec-head reveal">
        <span className="kicker">Leave us a note</span>
        <h2>Your <span className="script">Wishes</span></h2>
        <p className="lead">Share your blessings and kind words for {coupleNames} as they begin their journey together. Your message goes privately to the couple.</p>
      </div>

      <form className="wish-form reveal" onSubmit={submit}>
        <div className="field">
          <label htmlFor="wish-name">Your name</label>
          <input id="wish-name" type="text" maxLength={80} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="wish-text">Your wish</label>
          <textarea id="wish-text" rows={4} maxLength={MAX} placeholder="Write your wishes for the couple..."
            value={text} onChange={(e) => setText(e.target.value)} />
          <span className="wish-count">{text.length} / {MAX}</span>
        </div>
        <button type="submit" className="btn btn-block" disabled={sending}>
          <Icon name="heart" size={16} stroke={1.6} />{sending ? "Sending..." : "Send your wishes"}
        </button>
        <p className="form-msg" role="status" aria-live="polite">{status}</p>
      </form>
    </section>
  );
}
