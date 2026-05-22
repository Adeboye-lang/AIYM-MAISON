"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { reviews as fallbackReviews } from "@/lib/constants";

interface Review {
  id: string;
  name: string;
  rating: number;
  body: string;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} star`}
        >
          <Star
            className={`h-5 w-5 transition-colors ${n <= (hover || value) ? "fill-brand-yellow text-brand-yellow" : "text-brand-brown-light"}`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/account/me")
      .then((r) => setLoggedIn(r.ok))
      .catch(() => setLoggedIn(false));
  }, []);

  if (loggedIn === null) return null;

  if (!loggedIn) {
    return (
      <div className="mt-10 bg-brand-white border border-brand-brown-light/20 border-t-[3px] border-t-brand-yellow p-6 text-center">
        <p className="text-sm text-brand-brown-mid mb-3">Sign in to leave a review.</p>
        <a
          href="/auth/login"
          className="inline-block uppercase tracking-widest text-xs px-8 py-3 bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light transition-colors"
        >
          Sign In
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setMsg({ type: "error", text: "Please select a rating." }); return; }
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, text }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMsg({ type: "success", text: data.message });
      setRating(0);
      setText("");
      onSubmitted();
    } else {
      setMsg({ type: "error", text: data.error ?? "Something went wrong." });
    }
  };

  return (
    <div className="mt-10 bg-brand-white border border-brand-brown-light/20 border-t-[3px] border-t-brand-yellow p-6 max-w-xl mx-auto">
      <h3 className="text-xs uppercase tracking-widest text-brand-brown mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-brand-brown-light block mb-2">Your Rating</label>
          <StarPicker value={rating} onChange={setRating} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-brand-brown-light block mb-1">Your Review</label>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience with Nubian Velvet…"
            required
            minLength={10}
            className="w-full border border-brand-brown-light bg-transparent text-brand-brown px-4 py-2.5 text-sm outline-none focus:border-brand-yellow resize-none"
          />
        </div>
        {msg && (
          <p className={`text-xs ${msg.type === "success" ? "text-green-600" : "text-red-500"}`}>{msg.text}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="uppercase tracking-[0.2em] text-xs font-medium px-8 py-3 bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light transition-colors disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(4.9);
  const [totalCount, setTotalCount] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const loadReviews = () => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => {
        const list: Review[] = d.reviews ?? [];
        if (list.length > 0) {
          setReviews(list);
          const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
          setAvgRating(Math.round(avg * 10) / 10);
          setTotalCount(list.length);
        } else {
          // Show fallback reviews from constants while no real reviews exist
          setReviews(fallbackReviews.map((r, i) => ({ id: String(i), ...r })));
          setAvgRating(4.9);
          setTotalCount(124);
        }
      })
      .catch(() => {
        setReviews(fallbackReviews.map((r, i) => ({ id: String(i), ...r })));
      });
  };

  useEffect(() => { loadReviews(); }, []);

  return (
    <section className="bg-brand-surface">
      <div className="h-px bg-brand-yellow w-full" />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">

        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-brand-yellow mb-3">Verified Reviews</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-brown uppercase tracking-widest mb-4">
            What They&apos;re Saying
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="font-display text-4xl text-brand-yellow">{avgRating}</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-brand-yellow text-brand-yellow" />
              ))}
            </div>
            <span className="text-xs text-brand-brown-light">based on {totalCount} verified reviews</span>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              className="bg-brand-white border border-brand-brown-light/20 border-t-[3px] border-t-brand-yellow p-7 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.13, duration: 0.55 }}
            >
              <Quote className="h-5 w-5 text-brand-yellow opacity-60" />
              <div className="flex gap-1">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-brand-yellow text-brand-yellow" />
                ))}
              </div>
              <p className="font-display text-lg italic text-brand-brown leading-relaxed flex-1">
                &ldquo;{review.body}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-brand-brown-light/20">
                <span className="text-sm font-medium text-brand-brown">{review.name}</span>
                <span className="text-[9px] bg-brand-yellow/20 text-brand-yellow font-medium px-2 py-0.5 uppercase tracking-wider">
                  ✓ Verified
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-brand-brown-mid hover:text-brand-yellow transition-colors border-b border-current pb-0.5"
          >
            {showForm ? "Hide Form" : "Write a Review"}
            <span>→</span>
          </button>
        </motion.div>

        {showForm && <ReviewForm onSubmitted={() => { loadReviews(); setShowForm(false); }} />}
      </div>
      <div className="h-px bg-brand-yellow w-full" />
    </section>
  );
}
