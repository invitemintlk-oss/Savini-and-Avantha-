"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import { coupleNames } from "@/lib/wedding";

type Wish = { name: string; message: string; time?: string };

const MAX = 500;

function when(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function Wishes({ defaultName = "" }: { defaultName?: string }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(defaultName);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/wishes", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (alive && Array.isArray(d.wishes)) setWishes(d.wishes); })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

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
      setWishes((w) => [{ name: who, message, time: new Date().toISOString() }, ...w]);
      setText("");
      setStatus("Thank you for your lovely wishes!");
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
        <p className="lead">Share your blessings and kind words for {coupleNames} as they begin their journey together.</p>
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

      <div className="wish-list" aria-live="polite">
        {loading && <p className="wish-empty">Loading wishes...</p>}
        {!loading && wishes.length === 0 && <p className="wish-empty">Be the first to leave a wish for the couple.</p>}
        {wishes.map((w, i) => (
          <figure className="wish-card" key={`${w.time}-${i}`}>
            <span className="wish-quote" aria-hidden="true">&ldquo;</span>
            <blockquote>{w.message}</blockquote>
            <figcaption>
              <span className="wish-name">{w.name}</span>
              {when(w.time) && <span className="wish-date">{when(w.time)}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
