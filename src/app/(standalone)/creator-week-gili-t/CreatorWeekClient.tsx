"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDown, X, Camera, Utensils, Users, Sparkles, ArrowRight, Check } from "lucide-react";

// ─── Assets ──────────────────────────────────────────────────────────────────
const ASSETS = {
  hero:   "/layday_gilit/hero_gilit_oficial.jpeg",
  what:   "/layday_gilit/layday_gilit_picture 1.jpg",
  look:   "/layday_gilit/layday_gilit_picture 3.jpg",
  strip: [
    "/layday_gilit/layday_gilit_picture 1.jpg",
    "/layday_gilit/layday_gilit_picture 2.jpg",
    "/layday_gilit/layday_gilit_picture 3.jpg",
    "/layday_gilit/layday_gilit_picture 4.jpg",
    "/layday_gilit/layday_gilit_picture 5.jpg",
    "/lay_day_gilit/Turtle_Point_Snorkelling.jpeg",
    "/lay_day_gilit/Diving_With_Manta_Dive.png",
    "/lay_day_gilit/outdoor space 3.jpeg",
    "/lay_day_gilit/Horse_Riding.jpeg",
    "/lay_day_gilit/party.jpeg",
    "/lay_day_gilit/Gili_Meno_Island.jpeg",
  ],
};

// ─── Form questions ───────────────────────────────────────────────────────────
type Question =
  | { type: "radio"; q: string; opts: string[] }
  | { type: "text";  q: string; placeholder: string }
  | { type: "textarea"; q: string; placeholder: string };

const QUESTIONS: Question[] = [
  // ── Contact info (indices 0-2)
  { type: "text",     q: "What's your name?", placeholder: "Your full name" },
  { type: "text",     q: "Your email address:", placeholder: "hello@email.com" },
  { type: "text",     q: "Your phone number (with country code):", placeholder: "+61 400 000 000" },
  // ── Eligibility (indices 3-5)
  { type: "radio",    q: "Are you currently in Bali or arriving within the next 30 days?", opts: ["Yes, I'm in Bali now", "Yes, arriving soon (within 30 days)", "No"] },
  { type: "radio",    q: "Do you actively create content on Instagram, TikTok, or both?",  opts: ["Yes", "Only Instagram", "Only TikTok", "No"] },
  { type: "radio",    q: "Would you describe yourself as a travel / lifestyle / social media content creator?", opts: ["Yes", "No"] },
  // ── Creator profile (indices 6-13)
  { type: "text",     q: "Your Instagram handle:", placeholder: "@yourhandle" },
  { type: "text",     q: "Your TikTok handle (if applicable):", placeholder: "@yourhandle" },
  { type: "radio",    q: "Approximate follower count:", opts: ["Under 2.5k", "5k–20k", "20k–100k", "100k+"] },
  { type: "text",     q: "Where is your audience mainly from?", placeholder: "e.g. Australia, USA, Brazil…" },
  { type: "textarea", q: "Link 2–3 of your best recent posts:", placeholder: "Paste links here…" },
  { type: "radio",    q: "What type of content do you usually create?", opts: ["Travel", "Lifestyle", "Party / social", "Fitness / Wellness", "A mix of the above", "Other"] },
  { type: "radio",    q: "What is your average engagement rate on recent posts?", opts: ["I don't know", "Under 3%", "3–6%", "6–10%", "10%+", "Not sure but I get consistent engagement"] },
  { type: "radio",    q: "Have you worked with any brands before?", opts: ["Yes, multiple collaborations", "Yes, a few collaborations", "No", "Not officially, but I've created UGC-style content"] },
  { type: "textarea", q: "If yes, please link or list previous brand collaborations:", placeholder: "Links or names…" },
  // ── Motivation (indices 14-15)
  { type: "textarea", q: "Why do you want to join GILI CREATOR WEEK at Lay Day Gili T?", placeholder: "Tell us…" },
  { type: "textarea", q: "What do you bring to a group creator experience?", placeholder: "Tell us…" },
  // ── Commitment (indices 16-18)
  { type: "radio",    q: "Are you available for a 2–3 day creator trip in Gili T at the end of this month?", opts: ["Yes, fully available", "Mostly available (please explain)", "No"] },
  { type: "radio",    q: "Are you comfortable creating and posting content during the trip in exchange for a hosted stay?", opts: ["Yes", "No"] },
  { type: "radio",    q: "Do you agree to the deliverables (4 Reels/TikToks, 5–10 Stories, 1 feed post, tagging @laydaygilit, content usage rights)?", opts: ["Yes", "No"] },
];

// Question indices that disqualify on "No"
// 3=in Bali, 5=is creator, 17=comfortable creating, 18=agrees deliverables
const DISQUALIFY_ON_NO = new Set([3, 5, 17, 18]);

// WhatsApp CTA
const WA_NUMBER = "61411551667";
function buildWALink(answers: Record<number, string>) {
  const name = answers[0] ? answers[0] : "there";
  const handle = answers[6] ? answers[6] : "(see application)";
  const followers = answers[8] ? answers[8] : "unknown";
  const contentType = answers[11] ? answers[11] : "mixed";
  const msg = encodeURIComponent(
    `Hey! 👋 My name is ${name} and I just filled out the application for the Gili Creator Week at Lay Day Gili T.\n\n` +
    `My Instagram is ${handle}, I create ${contentType.toLowerCase()} content and have around ${followers} followers.\n\n` +
    `I'm super keen to be part of this experience — would love to hear more! 🌴`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

// ─── Form Modal ───────────────────────────────────────────────────────────────
function FormModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);
  const [disqualified, setDisqualified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const total = QUESTIONS.length;
  const current = QUESTIONS[step];
  const progress = Math.round((step / total) * 100);

  const submitToSheets = async (finalAnswers: Record<number, string>) => {
    try {
      const payload = {
        timestamp:            new Date().toISOString(),
        name:                 finalAnswers[0]  ?? "",
        email:                finalAnswers[1]  ?? "",
        phone:                finalAnswers[2]  ?? "",
        in_bali:              finalAnswers[3]  ?? "",
        creates_content:      finalAnswers[4]  ?? "",
        is_creator:           finalAnswers[5]  ?? "",
        instagram_handle:     finalAnswers[6]  ?? "",
        tiktok_handle:        finalAnswers[7]  ?? "",
        follower_count:       finalAnswers[8]  ?? "",
        audience_location:    finalAnswers[9]  ?? "",
        best_posts:           finalAnswers[10] ?? "",
        content_type:         finalAnswers[11] ?? "",
        engagement_rate:      finalAnswers[12] ?? "",
        brand_experience:     finalAnswers[13] ?? "",
        brand_links:          finalAnswers[14] ?? "",
        why_join:             finalAnswers[15] ?? "",
        what_they_bring:      finalAnswers[16] ?? "",
        availability:         finalAnswers[17] ?? "",
        comfortable_creating: finalAnswers[18] ?? "",
        agrees_deliverables:  finalAnswers[19] ?? "",
      };
      await fetch("/api/creator-week-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error("Sheet submission failed:", e);
    }
  };

  const finishForm = async (finalAnswers: Record<number, string>) => {
    if (submitting || done) return;
    setSubmitting(true);
    await submitToSheets(finalAnswers);
    setSubmitting(false);
    setDone(true);
  };

  const next = () => {
    if (submitting || done) return;
    if (step < total - 1) setStep((s) => s + 1);
    else finishForm(answers);
  };

  const canContinue = answers[step] !== undefined && answers[step].trim() !== "";

  const handleRadio = (val: string) => {
    if (submitting || done) return;
    const newAnswers = { ...answers, [step]: val };
    setAnswers(newAnswers);
    
    // Use a small delay for visual feedback, but block further clicks
    setTimeout(() => {
      // Eligibility gate: disqualify on "No" for critical questions
      if (DISQUALIFY_ON_NO.has(step) && val === "No") {
        setDisqualified(true);
        return;
      }
      if (step < total - 1) {
        setStep((s) => s + 1);
      } else {
        finishForm(newAnswers);
      }
    }, 280);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#EBE7E0] text-[#004A61] overflow-y-auto h-[100dvh]"
    >
      {/* Progress bar */}
      <div className="w-full h-1 bg-[#004A61]/10">
        <motion.div
          className="h-full bg-[#EE5B2B]"
          animate={{ width: `${disqualified || done ? 100 : progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#004A61]/10">
        <span className="font-heading tracking-widest text-sm uppercase text-[#004A61]/50">
          Gili Creator Week — Application
        </span>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center hover:bg-[#004A61]/10 rounded-full transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence mode="wait">

        {/* ── DISQUALIFIED SCREEN ── */}
        {disqualified && (
          <motion.div
            key="disqualified"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 gap-6 max-w-lg mx-auto"
          >
            <span className="text-5xl">🌴</span>
            <h2 className="font-heading text-3xl md:text-4xl tracking-widest uppercase leading-tight">
              Thanks for your <span className="text-[#EE5B2B]">interest!</span>
            </h2>
            <p className="text-sm font-medium opacity-70 leading-relaxed max-w-sm">
              This experience is currently only open to creators who are in Bali or traveling there soon.
              Follow us for future opportunities — more creator weeks are coming! 🌴
            </p>
            <a
              href="https://www.instagram.com/laydaygilit"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#EE5B2B] text-white font-bold uppercase tracking-[3px] text-xs px-10 h-12 flex items-center hover:bg-[#004A61] transition-colors duration-300"
            >
              FOLLOW @LAYDAYGILIT
            </a>
            <button
              onClick={onClose}
              className="text-xs text-[#004A61]/40 hover:text-[#004A61]/70 uppercase tracking-widest font-bold transition"
            >
              Close
            </button>
          </motion.div>
        )}

        {/* ── SUCCESS SCREEN ── */}
        {done && !disqualified && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 gap-6 max-w-lg mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-[#EE5B2B] flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-heading text-3xl md:text-5xl tracking-widest uppercase leading-tight">
              Thanks for applying to<br />
              <span className="text-[#EE5B2B]">Gili Creator Week 🌴</span>
            </h2>
            <p className="text-sm font-medium opacity-70 leading-relaxed max-w-sm">
              If selected, our team will contact you within a few days. In the meantime, send us a message on WhatsApp — we&apos;d love to hear from you!
            </p>
            <a
              href={buildWALink(answers)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] text-white font-bold uppercase tracking-[3px] text-xs px-10 h-14 shadow-xl hover:bg-[#1ebe5d] transition-colors duration-300"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              MESSAGE US ON WHATSAPP
            </a>
            <button
              onClick={onClose}
              className="text-xs text-[#004A61]/40 hover:text-[#004A61]/70 uppercase tracking-widest font-bold transition"
            >
              Close
            </button>
          </motion.div>
        )}

        {/* ── QUESTIONS ── */}
        {!done && !disqualified && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center justify-center px-6 py-12 pb-32 max-w-xl mx-auto w-full gap-8"
          >
            <span className="self-start text-[10px] font-bold tracking-[3px] uppercase text-[#EE5B2B]">
              {step + 1} / {total}
            </span>

            <h3 className="self-start font-heading text-2xl md:text-3xl tracking-wide leading-snug uppercase">
              {current.q}
            </h3>

            {current.type === "radio" && (
              <div className="w-full flex flex-col gap-3">
                {current.opts.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleRadio(opt)}
                    className={`w-full text-left px-5 py-3 border-2 font-medium text-sm tracking-wide transition-all duration-200
                      ${answers[step] === opt
                        ? "border-[#EE5B2B] bg-[#EE5B2B] text-white"
                        : "border-[#004A61]/20 hover:border-[#EE5B2B] hover:bg-[#EE5B2B]/5"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {current.type === "text" && (
              <div className="w-full flex flex-col gap-4">
                <input
                  type="text"
                  placeholder={current.placeholder}
                  value={answers[step] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [step]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && canContinue && next()}
                  className="w-full border-b-2 border-[#004A61]/30 focus:border-[#EE5B2B] bg-transparent py-3 text-lg font-medium outline-none placeholder:text-[#004A61]/30 transition-colors"
                  autoFocus
                />
                <ContinueBtn disabled={!canContinue || submitting} onClick={next} />
              </div>
            )}

            {current.type === "textarea" && (
              <div className="w-full flex flex-col gap-4">
                <textarea
                  placeholder={current.placeholder}
                  value={answers[step] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [step]: e.target.value }))}
                  rows={4}
                  className="w-full border-2 border-[#004A61]/20 focus:border-[#EE5B2B] bg-transparent p-4 text-sm font-medium outline-none placeholder:text-[#004A61]/30 resize-none transition-colors"
                  autoFocus
                />
                <ContinueBtn disabled={!canContinue || submitting} onClick={next} />
              </div>
            )}


          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}

function ContinueBtn({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="self-start flex items-center gap-2 bg-[#EE5B2B] text-white font-bold uppercase tracking-[3px] text-xs px-8 h-11 disabled:opacity-30 hover:bg-[#004A61] transition-colors duration-300"
    >
      OK <ArrowRight className="w-4 h-4" />
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function CreatorWeekClient() {
  const [hasMounted, setHasMounted] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => { setHasMounted(true); }, []);

  const { scrollYProgress } = useScroll({ offset: ["start start", "end end"] });
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  if (!hasMounted) return <div className="min-h-screen bg-[#EBE7E0]" />;

  return (
    <div ref={containerRef} className="bg-[#EBE7E0] text-[#004A61] font-sans selection:bg-[#EE5B2B] selection:text-white">

      <AnimatePresence>
        {formOpen && <FormModal onClose={() => setFormOpen(false)} />}
      </AnimatePresence>

      {/* ── 1. HERO ── */}
      <section className="relative h-[100dvh] w-full overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image
            src={ASSETS.hero}
            alt="Gili Creator Week Hero"
            fill priority
            className="object-cover object-[50%_30%] brightness-75 saturate-[0.85]"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 z-10" />

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-4"
          >
            <span className="text-white/70 font-bold tracking-[5px] uppercase text-[10px] block">
              Hosted by Lay Day Gili T
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-heading text-white tracking-widest leading-none drop-shadow-2xl">
              GILI <span className="text-[#EE5B2B]">CREATOR</span> WEEK
            </h1>
            <p className="max-w-lg mx-auto text-white/80 font-medium tracking-wide text-base md:text-lg leading-relaxed">
              Girls trip. Cocktails. Snorkelling. Social vibes.<br />
              A full content experience — captured professionally.
            </p>
            <div className="pt-6 flex flex-col items-center gap-8">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setFormOpen(true)}
                className="bg-[#EE5B2B] text-white font-bold uppercase tracking-[4px] text-xs px-12 h-14 shadow-2xl hover:bg-white hover:text-[#EE5B2B] transition-all duration-300"
              >
                APPLY NOW
              </motion.button>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="opacity-40"
              >
                <ChevronDown className="w-5 h-5 text-white" strokeWidth={1.5} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* ── 2. WHAT IS IT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-[#EE5B2B] font-bold tracking-[4px] uppercase text-[10px]">What is it?</span>
            <h2 className="text-3xl md:text-5xl font-heading tracking-widest uppercase leading-tight">
              A <span className="text-[#EE5B2B]">CURATED</span> CREATOR STAY
            </h2>
            <p className="text-sm md:text-base leading-relaxed font-medium opacity-75">
              We&apos;re bringing together a curated group of creators for a content-focused stay at Lay Day Gili T. Think good energy, new friends, and a week built for memories — and the content to prove it.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { icon: Camera, label: "Pro Photographer & Videographer" },
                { icon: Utensils, label: "Food & Drinks Included" },
                { icon: Users, label: "Connect with Other Creators" },
                { icon: Sparkles, label: "Organized Activities & Experiences" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-[#EE5B2B] mt-0.5 flex-shrink-0" />
                  <span className="text-[11px] font-bold tracking-wider uppercase opacity-80 leading-snug">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] border-[6px] border-white shadow-xl overflow-hidden"
          >
            <Image src={ASSETS.what} alt="Saturdays by the Pool" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
          </motion.div>
        </div>

        {/* ── 3. WHAT YOU GET ── */}
        <section className="mb-10 md:mb-14">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-4xl font-heading tracking-widest uppercase">
              WHAT YOU <span className="text-[#EE5B2B]">GET</span>
            </h2>
            <div className="w-16 h-[2px] bg-[#EE5B2B] mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { num: "01", title: "Free Dorm Stay", body: "Complimentary accommodation at Lay Day Gili T for the duration of the trip." },
              { num: "02", title: "Food & Drinks", body: "All meals and drinks included throughout the creator week." },
              { num: "03", title: "Pro Photographer & Videographer", body: "A dedicated creative team capturing your best moments all week long." },
              { num: "04", title: "Organized Activities", body: "Snorkelling, pool sessions, golden hour shoots, and social experiences." },
              { num: "05", title: "Creator Connections", body: "A chance to connect and grow with a curated group of like-minded creators." },
            ].map(({ num, title, body }) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border-l-4 border-[#EE5B2B] p-6 space-y-3 shadow-sm"
              >
                <span className="font-heading text-4xl text-[#EE5B2B] tracking-widest">{num}</span>
                <h3 className="font-bold text-sm tracking-widest uppercase">{title}</h3>
                <p className="text-sm opacity-80 leading-relaxed font-medium">{body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 4. WHAT WE'RE LOOKING FOR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square border-[6px] border-white shadow-xl overflow-hidden order-last lg:order-first"
          >
            <Image src={ASSETS.look} alt="Golden Hour" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-[#EE5B2B] font-bold tracking-[4px] uppercase text-[10px]">Who we want</span>
            <h2 className="text-3xl md:text-5xl font-heading tracking-widest uppercase leading-tight">
              WHAT WE&apos;RE <span className="text-[#EE5B2B]">LOOKING FOR</span>
            </h2>
            <ul className="space-y-4">
              {[
                "Travel, lifestyle, or social-focused creators",
                "Strong engagement — not just follower count",
                "Good energy & social, outgoing personalities",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EE5B2B] mt-2 flex-shrink-0" />
                  <span className="text-sm font-medium opacity-80 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <h3 className="font-heading text-lg tracking-widest uppercase mb-3">Deliverables</h3>
              <ul className="space-y-2">
                {[
                  "2–4 Reels or TikToks",
                  "5–10 Instagram Stories",
                  "1 main grid post",
                  "Tagging @laydaygilit on all content",
                  "Content usage rights for Lay Day Gili T",
                ].map((d, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold tracking-wider uppercase opacity-70">
                    <span className="text-[#EE5B2B]">—</span> {d}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* ── 5. PHOTO STRIP ── */}
        <section className="mb-10 md:mb-14 -mx-4 overflow-hidden">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-3xl font-heading tracking-widest uppercase">
              THE <span className="text-[#EE5B2B]">VIBE</span>
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-4">
            {ASSETS.strip.map((src, i) => (
              <div key={i} className="relative min-w-[75vw] md:min-w-[320px] aspect-[4/5] border-[4px] border-white shadow-md flex-shrink-0 overflow-hidden">
                <Image src={src} alt={`Creator Week ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 80vw, 320px" />
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── 6. CTA BANNER ── */}
      <section className="relative bg-[#004A61] text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image src="/lay_day_gilit/outdoor space.jpeg" alt="" fill className="object-cover grayscale" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center px-4 gap-6">
          <span className="font-bold tracking-[5px] uppercase text-[10px] text-white/60">Limited Spots Available</span>
          <h2 className="text-4xl md:text-6xl font-heading tracking-widest uppercase leading-none">
            READY TO <span className="text-[#EE5B2B]">CREATE?</span>
          </h2>
          <p className="max-w-md text-white/70 font-medium text-sm leading-relaxed">
            Apply now and join the most content-ready trip in Gili T. Spots are limited and go fast.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFormOpen(true)}
            className="bg-[#EE5B2B] text-white font-bold uppercase tracking-[4px] text-xs px-14 h-14 shadow-2xl hover:bg-white hover:text-[#EE5B2B] transition-all duration-300 mt-2"
          >
            APPLY NOW
          </motion.button>
        </div>
      </section>

      {/* ── Footer strip ── */}
      <div className="bg-[#EBE7E0] border-t border-[#004A61]/10 py-6 text-center">
        <p className="text-[10px] font-bold tracking-[3px] uppercase opacity-40">
          © {new Date().getFullYear()} Lay Day Gili T — All rights reserved
        </p>
      </div>

    </div>
  );
}
