"use client";

import React, { useState, useEffect } from "react";
import { Copy, Send, Zap, CheckCheck, Link, Loader2, X } from "lucide-react";

const products: Record<string, string[]> = {
  "iBuildSkills.com": [
    "Abe the Architect™ (Free Lead Magnet)",
    "Bea the Brain Architect™ ($7)",
    "Starter Kit ($17)",
    "Builder Kit ($37)",
    "Pro Kit ($57)",
    "Full Agent Kit ($97)",
  ],
  "The Ink Riot": [
    "5-Design Starter Pack (Free)",
    "$27 Halftone Vault",
  ],
};

const platforms = [
  "Facebook Ad",
  "Instagram Reel Script",
  "TikTok Viral Script",
  "Email Sequence (3-part)",
  "LinkedIn Post",
  "Etsy Listing Description",
];

const facebookAdStyles = [
  "PAS (Problem-Agitate-Solution)",
  "Social Proof / Testimonial",
  "Story Hook",
  "Direct Response / Offer-First",
  "Curiosity Gap / Question Hook",
];

const angles = [
  "Stop buying one tool, build an agent",
  "The ADHD/Overwhelm Fix",
  "Nobody can copy YOU",
  "Direct & Confident (Joyce's Voice)",
  "Streetwear/Grunge Vibe (Ink Riot)",
];

export default function CashTheConverter() {
  const [loading, setLoading] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [urlContent, setUrlContent] = useState("");
  const [urlMode, setUrlMode] = useState(false); // true = URL overrides all product knowledge
  const [formData, setFormData] = useState({
    brand: "iBuildSkills.com",
    product: "Abe the Architect™ (Free Lead Magnet)",
    platform: "Facebook Ad",
    facebookAdStyle: "PAS (Problem-Agitate-Solution)",
    angle: "Stop buying one tool, build an agent",
    context: "",
    url: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      product: products[prev.brand][0],
    }));
  }, [formData.brand]);

  const fetchUrlContent = async () => {
    if (!formData.url.trim()) return;
    setFetchingUrl(true);
    setUrlContent("");
    setUrlMode(false);
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.url }),
      });
      const data = await response.json();
      if (data.error) {
        setUrlContent("");
        setUrlMode(false);
        setError(`Could not fetch URL: ${data.error}`);
      } else {
        setUrlContent(data.content);
        setUrlMode(true); // URL loaded = override mode ON
        setError("");
      }
    } catch {
      setError("Failed to fetch URL content.");
    }
    setFetchingUrl(false);
  };

  const clearUrl = () => {
    setFormData({ ...formData, url: "" });
    setUrlContent("");
    setUrlMode(false);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setOutput("");
    setError("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          urlContent: urlContent,
          urlMode: urlMode,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setOutput(data.text);
      }
    } catch {
      setError("POW! Something went wrong. Check your API connection.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectClass =
    "w-full border-[3px] border-[#111111] p-3 font-bold bg-white text-[#111111] focus:bg-[#FFD600] outline-none cursor-pointer appearance-none";
  const labelClass =
    "block font-bold mb-1 uppercase tracking-wider text-[#111111] text-sm";

  return (
    <div
      className="min-h-screen text-white p-4 md:p-8"
      style={{
        fontFamily: "'Lato', sans-serif",
        backgroundColor: "#111111",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Oswald:wght@700&family=Lato:wght@400;700&display=swap');
        .comic-shadow { box-shadow: 6px 6px 0px 0px #111111; }
        .btn-shadow { box-shadow: 4px 4px 0px 0px #D32F2F; }
        .btn-shadow:active { box-shadow: none; transform: translateY(2px); }
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%23111'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
        @keyframes pulse-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .generating { animation: pulse-glow 1.5s ease-in-out infinite; }
        .url-mode-banner { background: linear-gradient(135deg, #111 0%, #1a1a1a 100%); border: 3px solid #FFD600; }
        .dimmed { opacity: 0.35; pointer-events: none; user-select: none; }
        .dimmed-label { opacity: 0.35; }
      `,
        }}
      />

      <header
        className="border-4 border-black p-5 md:p-6 mb-8 flex justify-between items-center"
        style={{
          backgroundColor: "#FFD600",
          boxShadow: "6px 6px 0px 0px #D32F2F",
        }}
      >
        <h1
          className="text-3xl md:text-5xl lg:text-6xl text-[#111111] tracking-wider uppercase"
          style={{ fontFamily: "'Bangers', cursive" }}
        >
          CASH THE CONVERTER™
        </h1>
        <div
          className="hidden md:flex items-center gap-2 text-white px-4 py-2 border-2 border-black -rotate-2"
          style={{
            backgroundColor: "#D32F2F",
            fontFamily: "'Oswald', sans-serif",
          }}
        >
          <Zap size={18} />
          AI CONTENT ENGINE
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white border-4 border-black p-6 comic-shadow relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-[0.04]">
            <Zap size={120} color="#111" />
          </div>

          <h2
            className="text-[#111] text-2xl mb-6 uppercase inline-block"
            style={{
              fontFamily: "'Oswald', sans-serif",
              borderBottom: "4px solid #FFD600",
              paddingBottom: "4px",
            }}
          >
            Campaign Settings
          </h2>

          <div className="space-y-5 relative z-10">

            {/* REFERENCE URL — always first, controls everything */}
            <div>
              <label className={labelClass} style={{ fontFamily: "'Oswald', sans-serif" }}>
                Reference URL
                {urlMode && (
                  <span
                    className="ml-2 text-[#D32F2F] text-xs normal-case"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    ★ URL MODE ACTIVE — writing from this page only
                  </span>
                )}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Link size={16} color="#111" />
                  </div>
                  <input
                    type="url"
                    className={`w-full border-[3px] p-3 pl-10 text-[#111111] focus:outline-none resize-none ${
                      urlMode
                        ? "border-[#FFD600] bg-[#fffbe6]"
                        : "border-[#111111] bg-white focus:bg-[#FFD600]"
                    }`}
                    placeholder="Paste any URL — product page, competitor ad, sales funnel..."
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                  />
                </div>
                {urlMode ? (
                  <button
                    onClick={clearUrl}
                    className="border-[3px] border-[#111111] px-4 bg-[#D32F2F] text-white hover:bg-[#111] transition-colors flex items-center gap-2"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                    title="Clear URL and return to product mode"
                  >
                    <X size={18} />
                  </button>
                ) : (
                  <button
                    onClick={fetchUrlContent}
                    disabled={fetchingUrl || !formData.url.trim()}
                    className="border-[3px] border-[#111111] px-4 bg-[#111] text-white hover:bg-[#D32F2F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    {fetchingUrl ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      "FETCH"
                    )}
                  </button>
                )}
              </div>
              {urlMode ? (
                <div className="mt-2 text-xs text-[#D32F2F] font-bold uppercase tracking-wider flex items-center gap-1">
                  ✓ URL loaded — Brand &amp; Product fields are overridden. Cash writes from this page only. Hit ✕ to reset.
                </div>
              ) : (
                <p className="mt-1 text-xs text-gray-400 italic">
                  Optional — paste any URL and hit FETCH. When loaded, Cash ignores pre-set products and writes purely from this page.
                </p>
              )}
            </div>

            {/* BRAND — dimmed when URL mode is active */}
            <div className={urlMode ? "dimmed" : ""}>
              <label
                className={`${labelClass} ${urlMode ? "dimmed-label" : ""}`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Brand {urlMode && <span className="text-gray-400 normal-case font-normal text-xs">(overridden by URL)</span>}
              </label>
              <select
                className={selectClass}
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                tabIndex={urlMode ? -1 : 0}
              >
                <option>iBuildSkills.com</option>
                <option>The Ink Riot</option>
              </select>
            </div>

            {/* PRODUCT — dimmed when URL mode is active */}
            <div className={urlMode ? "dimmed" : ""}>
              <label
                className={`${labelClass} ${urlMode ? "dimmed-label" : ""}`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Product to Promote {urlMode && <span className="text-gray-400 normal-case font-normal text-xs">(overridden by URL)</span>}
              </label>
              <select
                className={selectClass}
                value={formData.product}
                onChange={(e) =>
                  setFormData({ ...formData, product: e.target.value })
                }
                tabIndex={urlMode ? -1 : 0}
              >
                {products[formData.brand].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* PLATFORM */}
            <div>
              <label className={labelClass} style={{ fontFamily: "'Oswald', sans-serif" }}>
                Platform / Format
              </label>
              <select
                className={selectClass}
                value={formData.platform}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
              >
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* FACEBOOK AD STYLE — only shows when Facebook Ad is selected */}
            {formData.platform === "Facebook Ad" && (
              <div
                className="border-l-4 border-[#FFD600] pl-4"
                style={{ borderLeftColor: "#FFD600" }}
              >
                <label className={labelClass} style={{ fontFamily: "'Oswald', sans-serif" }}>
                  Facebook Ad Copy Style
                  <span
                    className="ml-2 text-[10px] text-[#D32F2F] normal-case font-normal"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    Mix these up — Facebook rewards variety
                  </span>
                </label>
                <select
                  className={selectClass}
                  value={formData.facebookAdStyle}
                  onChange={(e) =>
                    setFormData({ ...formData, facebookAdStyle: e.target.value })
                  }
                >
                  {facebookAdStyles.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-400 italic">
                  {formData.facebookAdStyle === "PAS (Problem-Agitate-Solution)" && "Opens with the pain, twists the knife, delivers the fix. Best for cold audiences."}
                  {formData.facebookAdStyle === "Social Proof / Testimonial" && "Leads with a result or transformation. \"She made $X in 30 days...\" — drives shares and tags."}
                  {formData.facebookAdStyle === "Story Hook" && "Personal narrative that pulls people in before the pitch. Great for warm audiences."}
                  {formData.facebookAdStyle === "Direct Response / Offer-First" && "Lead with the deal. Price, value, deadline. Best for retargeting."}
                  {formData.facebookAdStyle === "Curiosity Gap / Question Hook" && "Bold question or claim that creates a pattern interrupt. Drives clicks and comments."}
                </p>
              </div>
            )}

            {/* MARKETING ANGLE */}
            <div>
              <label className={labelClass} style={{ fontFamily: "'Oswald', sans-serif" }}>
                Marketing Angle
              </label>
              <select
                className={selectClass}
                value={formData.angle}
                onChange={(e) =>
                  setFormData({ ...formData, angle: e.target.value })
                }
              >
                {angles.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* ADDITIONAL CONTEXT */}
            <div>
              <label className={labelClass} style={{ fontFamily: "'Oswald', sans-serif" }}>
                Additional Context
              </label>
              <textarea
                className="w-full border-[3px] border-[#111111] p-3 h-24 bg-white text-[#111111] focus:bg-[#FFD600] outline-none resize-none"
                placeholder="Add any specific details, offers, or notes here..."
                value={formData.context}
                onChange={(e) =>
                  setFormData({ ...formData, context: e.target.value })
                }
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full border-4 border-black py-4 text-2xl md:text-3xl text-[#111] hover:bg-[#D32F2F] hover:text-white transition-colors btn-shadow flex justify-center items-center gap-3 uppercase disabled:opacity-60 disabled:cursor-not-allowed ${loading ? "generating" : ""}`}
              style={{
                fontFamily: "'Bangers', cursive",
                backgroundColor: loading ? "#e6c200" : "#FFD600",
              }}
            >
              {loading ? "GENERATING..." : "GENERATE CONTENT"}
              <Send size={22} />
            </button>
          </div>
        </section>

        <section className="flex flex-col">
          <div className="bg-white border-4 border-black p-6 comic-shadow flex-grow relative min-h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2
                className="text-[#111] text-2xl uppercase"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                The Output
              </h2>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-[#111] text-white px-3 py-2 border-2 border-black hover:bg-[#D32F2F] transition-colors text-sm"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                  title="Copy to Clipboard"
                >
                  {copied ? (
                    <>
                      <CheckCheck size={16} /> COPIED!
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> COPY
                    </>
                  )}
                </button>
              )}
            </div>

            <div
              className="text-[#111] whitespace-pre-wrap leading-relaxed text-[15px]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {error ? (
                <div className="text-[#D32F2F] font-bold mt-8 text-center p-4 border-2 border-[#D32F2F]">
                  {error}
                </div>
              ) : output ? (
                output
              ) : (
                <div className="text-gray-400 italic mt-20 text-center text-lg">
                  Select your options and hit{" "}
                  <span
                    className="text-[#111] not-italic"
                    style={{ fontFamily: "'Bangers', cursive" }}
                  >
                    GENERATE CONTENT
                  </span>{" "}
                  to see the magic...
                </div>
              )}
            </div>

            <div
              className="absolute -bottom-6 -right-6 w-20 h-20 border-4 border-black rotate-12 flex items-center justify-center text-white text-lg"
              style={{
                backgroundColor: "#D32F2F",
                fontFamily: "'Bangers', cursive",
              }}
            >
              BOOM!
            </div>
          </div>
        </section>
      </main>

      <footer
        className="mt-12 text-center text-gray-500 tracking-widest uppercase text-sm"
        style={{ fontFamily: "'Oswald', sans-serif" }}
      >
        &copy; {new Date().getFullYear()} Joyce Nelson &middot; iBuildSkills.com
        &amp; The Ink Riot
      </footer>
    </div>
  );
}
