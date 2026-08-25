"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  Calendar,
  Clock,
  Trophy,
  Check,
  X,
  ArrowRight,
  ChevronRight,
  RotateCw,
  Camera,
  Volume2,
  VolumeX,
  Flame,
  Music,
  PartyPopper,
  Wine,
  Gift,
  Smile,
} from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ─── Visual Assets ─────────────────────────────────────────────────────────────
const ASSETS = {
  mainPoster: "/anniversary_layday_uluwatu/LDU-Anniversary-A3.jpg",
  doorHanger: "/anniversary_layday/LDU-Anniversary Teaser-IGF.jpg",
  teaserVideo: "/anniversary_layday_uluwatu/LDU-Anniversary Teaser Video.mp4",
  logo: "/logo_layday_uluwatu.png",
  mainLogo: "/logo-layday.png",
};

// ─── Official Guest Challenge Board Items (From Uluwatu Document) ──────────────
interface ChallengeItem {
  id: number;
  title: string;
  category: string;
  icon: string;
  description: string;
  reward: string;
}

const GUEST_CHALLENGES: ChallengeItem[] = [
  {
    id: 1,
    title: "Dive Into the Giant Foam Party",
    category: "3 PM Pool Takeover",
    icon: "🫧",
    description: "Jump into the foam-flooded Uluwatu pool during the 3 PM - 6 PM foam cannon session.",
    reward: "+1 Stamp • Pool MVP",
  },
  {
    id: 2,
    title: "Shot With an Uluwatu Bartender",
    category: "Bar Station",
    icon: "🥃",
    description: "Clink glasses and take a celebratory anniversary shot with our legendary bar crew.",
    reward: "+1 Stamp • Free Shot Token",
  },
  {
    id: 3,
    title: "Strike a Pose at the Photo Booth",
    category: "Photo Op",
    icon: "📸",
    description: "Snap a souvenir strip at the branded photo booth or the 2-Year Anniversary Photo Wall.",
    reward: "+1 Stamp • Souvenir Print",
  },
  {
    id: 4,
    title: "Join the Safari World Record",
    category: "8 PM Activation",
    icon: "🦁",
    description: "Take part in the official Safari challenge activation running throughout the night.",
    reward: "+1 Stamp • World Record Legend",
  },
  {
    id: 5,
    title: "Order the Watermelon Campaign Drink",
    category: "F&B Special",
    icon: "🍉",
    description: "Taste the brand new promotional watermelon cocktail and receive your prize raffle ticket.",
    reward: "+1 Stamp • 1x Raffle Entry",
  },
  {
    id: 6,
    title: "Light a Sparkler at 9:30 PM Countdown",
    category: "Signature Moment",
    icon: "✨",
    description: "Join the 10-second MC countdown, giant cake cutting, and sparkler celebration with everyone.",
    reward: "+1 Stamp • Anniversary Memory",
  },
];

// ─── DJ Lineup Showcase (From Uluwatu Document) ────────────────────────────────
const DJ_LINEUP = [
  {
    name: "CITRA",
    time: "2:00 PM - 5:00 PM",
    genre: "House Sessions with Lyrics",
    description: "Uplifting vocal house grooves to kick off the sunny afternoon by the pool.",
    badge: "Daytime Vibes",
    color: "#9C3B6E",
  },
  {
    name: "URI",
    time: "5:00 PM - 8:00 PM",
    genre: "Reggaeton & Latin Sunset",
    description: "Golden hour Latin rhythms and high-energy bass that sets the pool deck ablaze.",
    badge: "Sunset Session",
    color: "#E5AB3A",
  },
  {
    name: "JAKA",
    time: "8:00 PM - 12:00 AM",
    genre: "Commercial Anthems & Night Send",
    description: "Non-stop commercial anthems and club bangers powering the party to midnight.",
    badge: "Late Night Send",
    color: "#C4276A",
  },
];

// ─── Confession Cards (Directly from Uluwatu Flyer) ───────────────────────────
const CONFESSION_ITEMS = [
  {
    id: 1,
    question: "Slept in a stranger's bed?",
    badge: "Hostel Classic",
    story:
      "Woke up in Dorm 4 when you were actually booked in Dorm 8. Classic Lay Day room shuffle.",
    percent: 86,
  },
  {
    id: 2,
    question: "Swam in the pool after hours?",
    badge: "Midnight Uluwatu Dip",
    story:
      "3:00 AM cannonball into the Uluwatu pool with 12 backpackers you met just three hours prior at the bar.",
    percent: 94,
  },
  {
    id: 3,
    question: "Lost your friend on a night out?",
    badge: "Bukit Maze",
    story:
      "Lost them at Single Fin sunset, found them at 6 AM eating smoothie bowls in Bingin with an Aussie surf crew.",
    percent: 81,
  },
  {
    id: 4,
    question: "Woke up with no idea where you were?",
    badge: "Uluwatu Amnesia",
    story:
      "Looked out the window, saw cliffs and palm trees, grabbed a cold young coconut, and sent it again.",
    percent: 74,
  },
  {
    id: 5,
    question: "Made a best friend in one night?",
    badge: "Soul Connection",
    story:
      "Bonded over a tequila shot at the bar and now you're exploring the entire Indonesian archipelago together.",
    percent: 98,
  },
  {
    id: 6,
    question: "Used someone else's towel?",
    badge: "Accidental Borrow",
    story:
      "Every towel looked exactly the same on the sun lounger. You didn't mean to, but you sent it anyway!",
    percent: 69,
  },
];

// ─── Official Event Schedule (From LDU_2ND_YEAR_ANNIVERSARY_PARTY.pdf) ────────
const SCHEDULE = [
  {
    time: "2:00 PM",
    title: "DOORS OPEN & ANNIVERSARY KICK-OFF",
    subtitle: "Pop-Up Santai & Beer Bar • Photo Op Wall & Photo Booth Open",
    badge: "2:00 PM • Doors Open",
    color: "#7A2856",
    description:
      "The celebration begins! Pop-up Santai & Beer Bar opens, the Lay Day 2-Year Photo Op Mirror / Wall is live, and the branded Photo Booth opens for complimentary souvenir prints.",
  },
  {
    time: "2:00 PM - 5:00 PM",
    title: "DJ CITRA — HOUSE SESSIONS",
    subtitle: "Vocal House & Uplifting Poolside Grooves",
    badge: "2:00 PM - 5:00 PM • Live DJ",
    color: "#9C3B6E",
    description:
      "DJ CITRA starts off the day by the pool deck with energetic house music and sing-along lyrics to get everyone locked into the celebration vibes.",
  },
  {
    time: "3:00 PM - 6:00 PM",
    title: "THE GIANT FOAM POOL PARTY",
    subtitle: "Massive Pool Foam Cannons & Water Takeover",
    badge: "3:00 PM - 6:00 PM • Highlight Event",
    color: "#C4276A",
    description:
      "High-powered foam cannons take over the entire Uluwatu pool! Dive into mountains of bubbles, grab ice-cold drinks, and experience the wildest pool session in the Bukit.",
  },
  {
    time: "5:00 PM - 8:00 PM",
    title: "DJ URI — SUNSET REGGAETON",
    subtitle: "Golden Hour Latin Heat & Heavy Bass",
    badge: "5:00 PM - 8:00 PM • Sunset Session",
    color: "#E5AB3A",
    description:
      "As the sun sets over the Bukit cliffs, DJ URI takes over with an explosive Reggaeton and Latin set that keeps the pool deck rocking.",
  },
  {
    time: "8:00 PM",
    title: "FREE CANAPÉS & SAFARI WORLD RECORD",
    subtitle: "Complimentary Gourmet Bites & Venue Record Activation",
    badge: "8:00 PM • Food & Activation",
    color: "#D97706",
    description:
      "Fresh complimentary gourmet canapés served to all guests! Plus the official Safari World Record challenge activation runs live throughout the venue.",
  },
  {
    time: "8:00 PM - 12:00 AM",
    title: "DJ JAKA — COMMERCIAL NIGHT SEND",
    subtitle: "Non-Stop Party Bangers & Anthem Energy",
    badge: "8:00 PM - Late • Headliner DJ",
    color: "#7A2856",
    description:
      "DJ JAKA delivers the ultimate high-energy late-night experience with non-stop party anthems, commercial bangers, and electric dancefloor energy.",
  },
  {
    time: "9:30 PM",
    title: "OFFICIAL ANNIVERSARY MOMENT & CAKE CUTTING",
    subtitle: "MC 10s Countdown, Sparklers & Magnum Champagne Pop",
    badge: "9:30 PM • Main Climax",
    color: "#C4276A",
    description:
      "The music pauses for the biggest moment of the year! The MC leads the venue in a huge 10-second countdown (10... 9... 8... 3... 2... 1!), cutting the giant anniversary cake with handheld sparklers distributed to all guests and magnum celebration bottles!",
  },
];

// ─── Conversational Form Questions (4 Direct Steps) ───────────────────────────
type FormQuestion = {
  type: "text" | "email" | "tel";
  q: string;
  placeholder: string;
  sub: string;
};

const FORM_QUESTIONS: FormQuestion[] = [
  {
    type: "text",
    q: "What is your full name?",
    placeholder: "e.g. Maya Lin",
    sub: "We'll have your name registered at the VIP guestlist door.",
  },
  {
    type: "email",
    q: "What is your email address?",
    placeholder: "maya@example.com",
    sub: "We'll email your 2nd Anniversary confirmation & full schedule details.",
  },
  {
    type: "tel",
    q: "What is your WhatsApp / Phone number?",
    placeholder: "+62 812 3456 7890",
    sub: "Include your country code for fast check-in at the door.",
  },
  {
    type: "text",
    q: "What is your nationality?",
    placeholder: "e.g. Australia, Germany, Brazil...",
    sub: "Tell us where in the world you're joining us from.",
  },
];

// ─── Fullscreen Conversational Form Modal ─────────────────────────────────────
function ConversationalFormModal({
  onClose,
  customPerk,
}: {
  onClose: () => void;
  customPerk?: string | null;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = FORM_QUESTIONS.length;
  const current = FORM_QUESTIONS[step];
  const progress = Math.round((step / total) * 100);

  const submitApplication = async (finalAnswers: Record<number, string>) => {
    if (isSubmitting || done) return;
    setIsSubmitting(true);

    const name = finalAnswers[0] || "";
    const email = finalAnswers[1] || "";
    const phone = finalAnswers[2] || "";
    const nationality = finalAnswers[3] || "";
    const perk = customPerk || "Free Welcome House Shot On Entry";

    // 1. Submit to Google Sheets via Next.js API route
    try {
      await fetch("/api/anniversary-uluwatu-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          name,
          email,
          phone,
          location: "Lay Day Uluwatu",
          nationality,
          spin_result: perk,
        }),
      });
    } catch (err) {
      console.error("Sheet API error:", err);
    }

    // 2. Submit to Meta CAPI (Lead Event)
    try {
      await fetch("/api/meta-capi/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: "anniversary-uluwatu",
          eventSourceUrl: typeof window !== "undefined" ? window.location.href : "",
          email,
          phone,
          firstName: name.split(" ")[0] || name,
          lastName: name.split(" ").slice(1).join(" ") || undefined,
          contentName: "2 Years Lay Day Uluwatu Anniversary - Lead",
        }),
      });
    } catch (err) {
      console.error("Meta CAPI error:", err);
    }

    // 3. Track Pixel & GTM
    if (typeof window !== "undefined") {
      if ((window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: "2 Years Lay Day Uluwatu Anniversary",
          currency: "IDR",
        });
      }
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: "uluwatu_anniversary_rsvp",
          name,
          venue: "Lay Day Uluwatu",
          spin_result: perk,
        });
      }
    }

    setIsSubmitting(false);
    setDone(true);
  };

  const nextStep = () => {
    if (isSubmitting || done) return;
    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      submitApplication(answers);
    }
  };

  const canContinue = answers[step] !== undefined && answers[step].trim() !== "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#FAF8F2] text-[#2E1824] overflow-y-auto h-[100dvh]"
    >
      {/* Top Gradient Progress Bar */}
      <div className="w-full h-1.5 bg-[#7A2856]/10">
        <motion.div
          className="h-full bg-gradient-to-r from-[#7A2856] via-[#C4276A] to-[#E5AB3A]"
          animate={{ width: `${done ? 100 : progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#7A2856]/15 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative w-28 h-8">
            <Image
              src={ASSETS.logo}
              alt="Lay Day Uluwatu"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-heading tracking-[3px] text-xs uppercase text-[#7A2856] font-bold hidden sm:inline">
            2nd Anniversary • 04.09.26
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center hover:bg-[#7A2856]/10 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-[#7A2856]" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ── SUCCESS SCREEN / THANK YOU PASS ── */}
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 max-w-lg mx-auto gap-5 w-full my-auto"
          >
            {/* Animated Celebration Badge */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#7A2856] via-[#C4276A] to-[#E5AB3A] flex items-center justify-center shadow-[0_0_40px_rgba(122,40,86,0.4)]">
                <Check className="w-10 h-10 text-white stroke-[3]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#FAF8F2] text-black flex items-center justify-center text-sm font-bold shadow-lg border border-[#7A2856]/20">
                🍒
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A2856]/10 border border-[#7A2856]/30 text-[#7A2856] text-[11px] font-extrabold uppercase tracking-[2px]">
                ★ OFFICIAL VIP GUESTLIST PASS
              </div>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-wider uppercase text-[#7A2856] leading-tight">
                YOU&apos;RE ON THE LIST!
              </h2>
              <p className="text-sm text-[#543245] font-medium">
                Thank you, <span className="text-[#7A2856] font-bold">{answers[0]}</span>. Your spot for the{" "}
                <span className="text-[#C4276A] font-bold">Lay Day Uluwatu 2nd Anniversary</span> is locked in!
              </p>
            </div>

            {/* Official Guestlist Pass Ticket Card */}
            <div className="w-full bg-white border-2 border-[#7A2856] rounded-2xl p-5 text-left relative overflow-hidden shadow-[0_15px_35px_rgba(122,40,86,0.15)]">
              <div className="absolute top-0 right-0 bg-[#7A2856] text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                LAY DAY ULUWATU VIP
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#7A2856]/60 block">
                    GUEST NAME
                  </span>
                  <span className="text-xl font-heading tracking-wide uppercase text-[#7A2856] font-bold">
                    {answers[0] || "Lay Day Legend"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#7A2856]/15">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#7A2856]/60 block">
                      VENUE
                    </span>
                    <span className="text-xs font-bold uppercase text-[#7A2856]">
                      Lay Day Uluwatu
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#7A2856]/60 block">
                      EVENT DATE
                    </span>
                    <span className="text-xs font-bold uppercase text-[#7A2856]">
                      04 . 09 . 26 • 2:00 PM
                    </span>
                  </div>
                </div>

                <div className="pt-1 border-t border-[#7A2856]/15">
                  <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#7A2856]/60 block">
                    INCLUDED PERKS
                  </span>
                  <span className="text-xs font-black uppercase text-[#C4276A] tracking-wider flex items-center gap-1.5 mt-0.5">
                    🍸 1x Free Welcome House Shot On Entry + Foam Party Access
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-[#7A2856]/20 flex items-center justify-between text-[10px] text-[#7A2856]/70 font-mono">
                <span>#LDU-ANNIV-2026</span>
                <span className="text-[#7A2856] font-bold">★ SHOW AT DOOR FOR ENTRY</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full pt-1">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `I just got on the VIP guestlist for Lay Day Uluwatu's 2nd Anniversary on 04.09.26! Claim your free spot and welcome house shot here: ${
                    typeof window !== "undefined" ? window.location.href : ""
                  }`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold uppercase tracking-[2px] text-xs h-12 rounded-lg transition-all shadow-md font-sans"
              >
                <FaWhatsapp className="w-4 h-4" /> Share on WhatsApp
              </a>
              <Button
                onClick={onClose}
                className="px-6 h-12 bg-[#7A2856]/10 hover:bg-[#7A2856]/20 text-[#7A2856] font-extrabold uppercase tracking-wider text-xs rounded-lg transition-colors border border-[#7A2856]/20"
              >
                Back to Site
              </Button>
            </div>
          </motion.div>
        ) : (
          /* ── QUESTION STEPS ── */
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full px-6 py-12"
          >
            <div className="space-y-6">
              {/* Step indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#7A2856] bg-[#7A2856]/10 border border-[#7A2856]/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Step {step + 1} of {total}
                </span>
                <span className="text-[11px] font-bold text-[#C4276A] uppercase tracking-wider bg-[#C4276A]/10 border border-[#C4276A]/20 px-2.5 py-1 rounded-full">
                  Perk: Free Welcome Shot 🍸
                </span>
              </div>

              {/* Question */}
              <div className="space-y-2">
                <h3 className="font-heading text-4xl sm:text-5xl md:text-6xl uppercase tracking-wide text-[#7A2856] leading-tight">
                  {current.q}
                </h3>
                {current.sub && (
                  <p className="text-sm sm:text-base text-[#543245] font-medium">
                    {current.sub}
                  </p>
                )}
              </div>

              {/* Input field */}
              <div className="pt-2">
                <input
                  type={current.type}
                  value={answers[step] || ""}
                  placeholder={current.placeholder}
                  autoFocus
                  onChange={(e) =>
                    setAnswers({ ...answers, [step]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canContinue) {
                      nextStep();
                    }
                  }}
                  className="w-full bg-white border-2 border-[#7A2856]/25 focus:border-[#7A2856] text-[#7A2856] text-xl sm:text-2xl px-5 py-4 rounded-xl outline-none transition-all placeholder:text-[#7A2856]/30 font-medium shadow-sm"
                />
              </div>

              {/* Controls */}
              <div className="pt-4 flex items-center justify-between gap-4">
                {step > 0 ? (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="text-xs uppercase tracking-widest text-[#7A2856]/70 hover:text-[#7A2856] transition-colors font-bold px-3 py-2"
                  >
                    ← Back
                  </button>
                ) : (
                  <div />
                )}

                <Button
                  onClick={nextStep}
                  disabled={!canContinue || isSubmitting}
                  className="bg-gradient-to-r from-[#7A2856] via-[#C4276A] to-[#7A2856] hover:opacity-95 text-white font-extrabold uppercase tracking-[3px] text-xs sm:text-sm h-14 px-8 rounded-xl transition-all shadow-[0_8px_25px_rgba(122,40,86,0.35)] disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <RotateCw className="w-4 h-4 animate-spin" /> LOCKING SPOT...
                    </span>
                  ) : step === total - 1 ? (
                    <span className="flex items-center gap-2">
                      CONFIRM GUESTLIST SPOT <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      CONTINUE <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Uluwatu Anniversary Client Component (Light Cream / White Theme) ────
export function AnniversaryUluwatuClient() {
  const [formOpen, setFormOpen] = useState(false);

  // Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // Interactive Guest Challenge Board State (Stamps collected)
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([1, 6]);

  // Confession voting state
  const [userVotes, setUserVotes] = useState<Record<number, "guilty" | "innocent">>({});
  const [activeConfessionTab, setActiveConfessionTab] = useState<number>(1);

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.98]);

  const toggleChallengeStamp = (id: number) => {
    setCompletedChallenges((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="bg-[#FAF8F2] text-[#2E1824] font-sans selection:bg-[#7A2856] selection:text-white overflow-x-hidden min-h-screen">
      {/* ── FULLSCREEN CONVERSATIONAL FORM MODAL ── */}
      <AnimatePresence>
        {formOpen && (
          <ConversationalFormModal
            onClose={() => setFormOpen(false)}
            customPerk="Free Welcome House Shot On Entry"
          />
        )}
      </AnimatePresence>

      {/* ── TOP ANNOUNCEMENT TICKER ── */}
      <div className="bg-gradient-to-r from-[#7A2856] via-[#A8336D] to-[#7A2856] text-white text-[11px] md:text-xs font-extrabold uppercase tracking-[3px] py-2.5 px-4 text-center overflow-hidden flex items-center justify-center gap-3 shadow-md z-30 relative">
        <span className="animate-pulse flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" /> 2 YEARS OF LAY DAY ULUWATU • 04.09.26 • SAVE THE DATE
        </span>
        <span className="opacity-75 hidden sm:inline">|</span>
        <span className="text-[#FFE082] font-black drop-shadow-sm hidden sm:inline">
          🍒 JOIN GUESTLIST & GET A FREE SHOT
        </span>
      </div>

      {/* ── 1. HERO SECTION ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-10 md:pt-14 pb-16 px-4 overflow-hidden">
        {/* Subtle Ambient Plum / Cherry Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] md:w-[850px] h-[550px] md:h-[850px] bg-gradient-to-tr from-[#7A2856]/10 via-[#C4276A]/10 to-[#E5AB3A]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="max-w-6xl mx-auto w-full flex flex-col items-center text-center relative z-10"
        >
          {/* Centered Lay Day Uluwatu Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-44 h-16 md:w-56 md:h-20 mb-6 mx-auto"
          >
            <Image
              src={ASSETS.logo}
              alt="Lay Day Uluwatu Logo"
              fill
              priority
              className="object-contain"
            />
          </motion.div>

          {/* Milestone Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#7A2856]/30 backdrop-blur-md mb-6 shadow-[0_4px_15px_rgba(122,40,86,0.1)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#7A2856] animate-ping" />
            <span className="text-xs md:text-sm font-extrabold uppercase tracking-[3px] text-[#7A2856]">
              2024 – 2026 • 2ND ANNIVERSARY CELEBRATION
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="space-y-3 md:space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-heading tracking-[3px] md:tracking-[8px] uppercase leading-none text-[#7A2856] drop-shadow-sm">
              BAD DECISIONS <br className="hidden sm:inline" />
              <span className="text-[#7A2856]">
                MAKE GOOD STORIES
              </span>
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-heading tracking-[4px] md:tracking-[8px] uppercase text-[#9C3B6E]">
              2 YEARS OF LAY DAY ULUWATU • COUNTLESS STORIES
            </h2>
          </motion.div>

          {/* Subtitle & Taglines */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 md:mt-8 max-w-2xl text-base sm:text-lg md:text-xl text-[#543245] font-medium leading-relaxed tracking-wide"
          >
            2 years of unforgettable Bukit sunsets, foam pool parties, and wild sends. On{" "}
            <span className="text-[#7A2856] font-bold">04.09.26</span>, we celebrate every late night, every lifelong friend, and every questionable decision made under the Uluwatu stars.
          </motion.p>

          {/* Big High-Impact Free Shot CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-8 md:mt-10 flex flex-col items-center gap-3.5 w-full sm:w-auto"
          >
            <Button
              onClick={() => setFormOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-[#7A2856] via-[#C4276A] to-[#7A2856] hover:opacity-95 text-white font-extrabold uppercase tracking-[3px] md:tracking-[4px] text-xs sm:text-sm md:text-base h-16 md:h-20 px-8 sm:px-12 md:px-16 rounded-none transition-all duration-300 shadow-[0_8px_30px_rgba(122,40,86,0.35)] hover:scale-105 active:scale-95 group"
            >
              <span className="flex items-center gap-2">
                🍸 JOIN THE GUESTLIST & GET A FREE SHOT
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <span className="text-[11px] md:text-xs font-bold uppercase tracking-[2px] text-[#7A2856]">
              ★ Instant Door Access • Free Welcome Shot on Arrival • 100% Free RSVP
            </span>
          </motion.div>

          {/* Fast Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl pt-8 border-t border-[#7A2856]/15"
          >
            <div className="p-4 rounded-xl bg-white border border-[#7A2856]/15 shadow-sm">
              <span className="font-heading text-4xl md:text-5xl text-[#7A2856] block tracking-widest">
                2
              </span>
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-[2px] text-[#543245]">
                Years in Uluwatu
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#7A2856]/15 shadow-sm">
              <span className="font-heading text-4xl md:text-5xl text-[#C4276A] block tracking-widest">
                25K+
              </span>
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-[2px] text-[#543245]">
                Legends Hosted
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#7A2856]/15 shadow-sm">
              <span className="font-heading text-4xl md:text-5xl text-[#E5AB3A] block tracking-widest">
                ∞
              </span>
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-[2px] text-[#543245]">
                Bad Decisions
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#7A2856]/15 shadow-sm">
              <span className="font-heading text-4xl md:text-5xl text-[#7A2856] block tracking-widest">
                #1
              </span>
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-[2px] text-[#543245]">
                Party Hostel in Bukit
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. ARTWORK & VIDEO TEASER SECTION ── */}
      <section id="video" className="py-12 md:py-20 bg-[#F4EFE6] border-y border-[#7A2856]/15 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center justify-center">
            {/* Left: Poster Artwork Showcase (LDU-Anniversary-A3) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative aspect-[1/1.414] max-w-sm sm:max-w-md mx-auto w-full rounded-2xl overflow-hidden border-[3px] border-[#7A2856]/30 shadow-[0_15px_40px_rgba(122,40,86,0.15)] bg-white group"
            >
              <Image
                src={ASSETS.mainPoster}
                alt="2 Years of Lay Day Uluwatu Official Poster"
                fill
                priority
                className="object-contain p-1 group-hover:scale-[1.02] transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* Right: Teaser Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-6 flex flex-col items-center justify-center"
            >
              <div className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] rounded-2xl overflow-hidden border-[3px] border-[#7A2856]/30 shadow-[0_15px_40px_rgba(122,40,86,0.15)] bg-black group">
                <video
                  ref={videoRef}
                  src={ASSETS.teaserVideo}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* Sound toggle overlay button */}
                <button
                  onClick={toggleVideoMute}
                  className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  aria-label="Toggle Sound"
                >
                  {isVideoMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>

              {/* Save The Date Notice */}
              <div className="mt-6 flex items-center gap-3 bg-white border border-[#7A2856]/20 px-6 py-3 rounded-full shadow-sm">
                <Calendar className="w-4 h-4 text-[#7A2856]" />
                <span className="text-xs font-bold uppercase tracking-[2px] text-[#7A2856]">
                  Event Date: <span className="text-[#C4276A] font-black">04 . 09 . 26</span> • Lay Day Uluwatu
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. OFFICIAL ULUWATU HIGHLIGHTS & GUEST CHALLENGE BOARD (Replacing Wheel of Regret) ── */}
      <section id="highlights" className="py-20 md:py-32 bg-[#FAF8F2] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#7A2856]/10 border border-[#7A2856]/30 text-[#7A2856] text-xs font-extrabold uppercase tracking-[3px]">
              <Sparkles className="w-3.5 h-3.5" /> 2ND ANNIVERSARY SIGNATURE HIGHLIGHTS
            </div>
            <h2 className="text-4xl md:text-7xl font-heading tracking-widest uppercase text-[#7A2856] leading-none">
              THE OFFICIAL <span className="text-[#C4276A]">EXPERIENCE</span>
            </h2>
            <p className="text-base md:text-lg text-[#543245] max-w-2xl mx-auto font-medium">
              From the 3 PM giant foam pool takeover to the 9:30 PM sparkler countdown, here are the signature moments powering our biggest celebration of the year!
            </p>
          </div>

          {/* 3 Pillar Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Card 1: Giant Foam Party */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 md:p-8 rounded-2xl bg-white border border-[#7A2856]/15 shadow-md flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C4276A]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#C4276A]/10 border border-[#C4276A]/30 flex items-center justify-center text-3xl">
                  🫧
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-[2px] text-[#C4276A]">
                    3:00 PM – 6:00 PM • POOL TAKEOVER
                  </span>
                  <h3 className="font-heading text-2xl md:text-3xl tracking-wide uppercase text-[#7A2856]">
                    THE GIANT FOAM POOL PARTY
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-[#543245] leading-relaxed">
                  High-powered foam cannons flooding the entire Uluwatu pool! Dive into mountains of bubbles, iced cocktail buckets, pool inflatables, and sunny poolside bangers.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#7A2856]/10 flex items-center justify-between text-xs font-bold text-[#7A2856]">
                <span>★ Foam Cannons Ready</span>
                <span className="text-[#C4276A]">Bring Swimwear</span>
              </div>
            </motion.div>

            {/* Card 2: 9:30 PM Sparkler Countdown */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 md:p-8 rounded-2xl bg-white border border-[#7A2856]/15 shadow-md flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E5AB3A]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E5AB3A]/15 border border-[#E5AB3A]/40 flex items-center justify-center text-3xl">
                  🎂
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-[2px] text-[#E5AB3A]">
                    9:30 PM • SIGNATURE CLIMAX
                  </span>
                  <h3 className="font-heading text-2xl md:text-3xl tracking-wide uppercase text-[#7A2856]">
                    SPARKLER COUNTDOWN & CAKE
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-[#543245] leading-relaxed">
                  The music pauses as the MC leads a massive 10-second countdown (10...9...1!). Giant celebration magnum bottles pop, handheld sparklers ignite for every guest, and we cut the 2-Year Cake.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#7A2856]/10 flex items-center justify-between text-xs font-bold text-[#7A2856]">
                <span>★ Free Handheld Sparklers</span>
                <span className="text-[#E5AB3A]">All Guests Unite</span>
              </div>
            </motion.div>

            {/* Card 3: Free Canapes & Photo Booth */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-6 md:p-8 rounded-2xl bg-white border border-[#7A2856]/15 shadow-md flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#7A2856]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#7A2856]/10 border border-[#7A2856]/30 flex items-center justify-center text-3xl">
                  📸
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-[2px] text-[#7A2856]">
                    ALL DAY & NIGHT
                  </span>
                  <h3 className="font-heading text-2xl md:text-3xl tracking-wide uppercase text-[#7A2856]">
                    PHOTO BOOTH & FREE CANAPÉS
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-[#543245] leading-relaxed">
                  Complimentary gourmet canapés served from 8:00 PM. Plus a branded vintage Photo Booth and illuminated 2-Year Anniversary Mirror Photo Op Wall for instant souvenir strips!
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#7A2856]/10 flex items-center justify-between text-xs font-bold text-[#7A2856]">
                <span>★ Free Canapés at 8 PM</span>
                <span className="text-[#7A2856]">Instant Souvenir Prints</span>
              </div>
            </motion.div>
          </div>

          {/* ── INTERACTIVE GUEST CHALLENGE BOARD ── */}
          <div className="p-6 md:p-10 rounded-3xl bg-white border-2 border-[#7A2856]/25 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-[#7A2856]/15">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A2856]/10 text-[#7A2856] text-[11px] font-extrabold uppercase tracking-[2px] mb-2">
                  <Trophy className="w-3.5 h-3.5" /> GUEST DELIVERABLE
                </div>
                <h3 className="font-heading text-3xl md:text-5xl uppercase tracking-wider text-[#7A2856]">
                  THE OFFICIAL GUEST CHALLENGE BOARD
                </h3>
                <p className="text-xs md:text-sm text-[#543245] max-w-xl font-medium mt-1">
                  Every guest receives a physical Challenge Board card on arrival! Click each challenge below to preview the tasks and collect your virtual stamps.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-[#FAF8F2] border border-[#7A2856]/20 px-5 py-3 rounded-2xl self-stretch lg:self-auto justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7A2856]/70 tracking-widest block">
                    STAMPS COLLECTED
                  </span>
                  <span className="text-2xl font-heading text-[#7A2856] font-bold">
                    {completedChallenges.length} / {GUEST_CHALLENGES.length}
                  </span>
                </div>
                <Button
                  onClick={() => setFormOpen(true)}
                  className="bg-[#7A2856] hover:bg-[#5E193E] text-white font-extrabold uppercase tracking-wider text-xs h-10 px-4 rounded-lg"
                >
                  GET YOUR BOARD AT DOOR
                </Button>
              </div>
            </div>

            {/* Grid of 6 Interactive Challenge Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
              {GUEST_CHALLENGES.map((challenge) => {
                const isStamped = completedChallenges.includes(challenge.id);

                return (
                  <motion.div
                    key={challenge.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => toggleChallengeStamp(challenge.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                      isStamped
                        ? "bg-gradient-to-br from-[#7A2856]/5 via-[#C4276A]/5 to-[#E5AB3A]/10 border-[#7A2856] shadow-sm"
                        : "bg-[#FAF8F2] border-[#7A2856]/15 hover:border-[#7A2856]/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{challenge.icon}</span>
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition-colors ${
                            isStamped
                              ? "bg-[#7A2856] text-white border-[#7A2856]"
                              : "bg-white text-[#7A2856] border-[#7A2856]/20"
                          }`}
                        >
                          {isStamped ? "✓ STAMP COLLECTED" : "CLICK TO STAMP"}
                        </span>
                      </div>

                      <h4 className="font-heading text-xl text-[#7A2856] uppercase tracking-wide mb-1">
                        {challenge.title}
                      </h4>
                      <span className="text-[10px] font-bold text-[#C4276A] uppercase tracking-widest block mb-2">
                        {challenge.category}
                      </span>
                      <p className="text-xs text-[#543245] leading-relaxed font-medium">
                        {challenge.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#7A2856]/10 flex items-center justify-between text-[11px] font-bold text-[#7A2856]">
                      <span>{challenge.reward}</span>
                      <span className="text-base">{isStamped ? "🏆" : "⭕"}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Notice */}
            <div className="mt-6 p-4 rounded-xl bg-[#FAF8F2] border border-[#7A2856]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <span className="text-xs text-[#543245] font-medium">
                ★ Complete your board on 04.09.26 to redeem limited edition merchandise, free shot tokens, and enter the Anniversary Grand Prize Draw!
              </span>
              <Button
                onClick={() => setFormOpen(true)}
                className="bg-[#C4276A] hover:bg-[#A81E57] text-white font-extrabold uppercase tracking-[2px] text-xs h-10 px-5 flex-shrink-0"
              >
                JOIN GUESTLIST & GET FREE SHOT 🍸
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. DJ LINE-UP SHOWCASE ── */}
      <section className="py-16 bg-[#F4EFE6] border-y border-[#7A2856]/15">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-extrabold tracking-[3px] uppercase text-[#7A2856]">
              NON-STOP BEATS FROM 2:00 PM TO MIDNIGHT
            </span>
            <h3 className="font-heading text-3xl md:text-5xl uppercase tracking-wider text-[#7A2856]">
              THE ANNIVERSARY <span className="text-[#C4276A]">DJ LINE-UP</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DJ_LINEUP.map((dj, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-[#7A2856]/15 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-[2px] px-2.5 py-1 rounded border"
                      style={{
                        backgroundColor: `${dj.color}15`,
                        color: dj.color,
                        borderColor: `${dj.color}40`,
                      }}
                    >
                      {dj.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#7A2856]/70">
                      {dj.time}
                    </span>
                  </div>
                  <h4 className="font-heading text-3xl text-[#7A2856] uppercase tracking-wide">
                    DJ {dj.name}
                  </h4>
                  <span className="text-xs font-bold text-[#C4276A] uppercase tracking-wider block">
                    {dj.genre}
                  </span>
                  <p className="text-xs text-[#543245] leading-relaxed">
                    {dj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. "BAD DECISIONS MAKE GOOD STORIES" TEAR-OFF BOARD (Flyer Theme) ── */}
      <section
        id="confessions"
        className="py-20 md:py-32 bg-[#FAF8F2] relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <span className="text-xs font-extrabold tracking-[4px] uppercase text-[#7A2856]">
              2 YEARS • COUNTLESS STORIES
            </span>
            <h2 className="text-4xl md:text-7xl font-heading tracking-widest uppercase text-[#7A2856]">
              BAD DECISIONS <span className="text-[#C4276A]">CONFESSION BOARD</span>
            </h2>
            <p className="text-base md:text-lg text-[#543245] max-w-2xl mx-auto font-medium">
              We pulled the top questions directly from the official Lay Day Uluwatu tear-off flyer! Click any card below to cast your verdict.
            </p>
          </div>

          {/* Interactive Tear-off Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONFESSION_ITEMS.map((item) => {
              const vote = userVotes[item.id];
              const isSelected = activeConfessionTab === item.id;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -6 }}
                  onClick={() => setActiveConfessionTab(item.id)}
                  className={`relative p-6 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-white border-[#7A2856] shadow-[0_12px_35px_rgba(122,40,86,0.15)] ring-2 ring-[#7A2856]"
                      : "bg-white border-[#7A2856]/15 hover:border-[#7A2856]/40 shadow-sm"
                  }`}
                >
                  {/* Card Header & Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-[2px] px-2.5 py-1 rounded bg-[#7A2856]/10 text-[#7A2856] border border-[#7A2856]/20">
                        {item.badge}
                      </span>
                      <span className="text-xs font-bold text-[#7A2856]/50">#{item.id}</span>
                    </div>

                    <h3 className="font-heading text-2xl md:text-3xl tracking-wide uppercase text-[#7A2856] leading-snug mb-3">
                      &ldquo;{item.question}&rdquo;
                    </h3>

                    <p className="text-xs md:text-sm text-[#543245] leading-relaxed italic mb-6">
                      {item.story}
                    </p>
                  </div>

                  {/* Interactive Voting / Confession Bar */}
                  <div className="pt-4 border-t border-[#7A2856]/15 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="text-[#543245]">Community Verdict:</span>
                      <span className="text-[#7A2856] font-extrabold">{item.percent}% GUILTY</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#7A2856]/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#7A2856] to-[#C4276A] transition-all duration-700"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>

                    {/* Voting Buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUserVotes((prev) => ({ ...prev, [item.id]: "guilty" }));
                        }}
                        className={`flex-1 py-2 text-[11px] font-extrabold uppercase tracking-wider rounded border transition-all ${
                          vote === "guilty"
                            ? "bg-[#7A2856] border-[#7A2856] text-white shadow-sm"
                            : "bg-[#FAF8F2] border-[#7A2856]/20 text-[#7A2856] hover:bg-[#7A2856]/10"
                        }`}
                      >
                        {vote === "guilty" ? "✓ GUILTY!" : "GUILTY 🙋‍♂️"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUserVotes((prev) => ({ ...prev, [item.id]: "innocent" }));
                        }}
                        className={`flex-1 py-2 text-[11px] font-extrabold uppercase tracking-wider rounded border transition-all ${
                          vote === "innocent"
                            ? "bg-[#E5AB3A] border-[#E5AB3A] text-black shadow-sm"
                            : "bg-[#FAF8F2] border-[#7A2856]/20 text-[#7A2856] hover:bg-[#7A2856]/10"
                        }`}
                      >
                        {vote === "innocent" ? "✓ INNOCENT" : "INNOCENT 😇"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Social Story Submission Banner */}
          <div className="mt-12 p-6 md:p-8 rounded-2xl bg-white border border-[#7A2856]/20 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h4 className="font-heading text-2xl md:text-3xl tracking-wider uppercase text-[#7A2856]">
                GOT AN UNFORGETTABLE ULUWATU STORY?
              </h4>
              <p className="text-xs md:text-sm text-[#543245] max-w-xl">
                Submit your wildest Lay Day Uluwatu memory on Instagram with hashtag{" "}
                <span className="text-[#7A2856] font-bold">#BadChoicesMakeGoodStories</span> or tag{" "}
                <span className="text-[#C4276A] font-bold">@staylayday</span> to be featured during the celebration!
              </p>
            </div>
            <a
              href="https://www.instagram.com/staylayday/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#7A2856] hover:bg-[#5E193E] text-white font-extrabold uppercase tracking-[3px] text-xs px-6 h-12 shadow-md transition-all flex-shrink-0"
            >
              <FaInstagram className="w-4 h-4" /> SHARE ON INSTAGRAM
            </a>
          </div>
        </div>
      </section>

      {/* ── 6. FULL-DAY EVENT SCHEDULE & PROGRAM (From PDF) ── */}
      <section
        id="schedule"
        className="py-20 md:py-32 bg-[#F4EFE6] border-t border-[#7A2856]/15 relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-extrabold tracking-[4px] uppercase text-[#7A2856]">
              OFFICIAL EVENT PROGRAM & LINEUP
            </span>
            <h2 className="text-4xl md:text-7xl font-heading tracking-widest uppercase text-[#7A2856] leading-none">
              THE 2ND <span className="text-[#C4276A]">ANNIVERSARY SCHEDULE</span>
            </h2>
            <p className="text-base md:text-lg text-[#543245] max-w-2xl mx-auto font-medium">
              From 2:00 PM doors open to the 9:30 PM sparkler countdown and midnight finale, here is the official program.
            </p>
          </div>

          {/* Timeline Grid */}
          <div className="space-y-6">
            {SCHEDULE.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-6 md:p-8 rounded-xl bg-white border border-[#7A2856]/15 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 md:items-center justify-between group"
              >
                {/* Time & Badge */}
                <div className="flex flex-col md:w-64 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#7A2856]" />
                    <span className="font-heading text-2xl md:text-3xl tracking-wider text-[#7A2856] group-hover:text-[#C4276A] transition-colors">
                      {item.time}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-extrabold uppercase tracking-[2px] px-2.5 py-1 rounded inline-block self-start border"
                    style={{
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                      borderColor: `${item.color}40`,
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <h3 className="font-heading text-2xl md:text-3xl tracking-wide uppercase text-[#7A2856]">
                    {item.title}
                  </h3>
                  <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-[#C4276A]">
                    {item.subtitle}
                  </h4>
                  <p className="text-xs md:text-sm text-[#543245] leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. ANNIVERSARY SPECIALS & LIMITED OFFERS ── */}
      <section
        id="offers"
        className="py-20 md:py-32 bg-[#FAF8F2] border-t border-[#7A2856]/15 relative"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-extrabold tracking-[4px] uppercase text-[#7A2856]">
              ONE DAY ONLY • 04.09.26
            </span>
            <h2 className="text-4xl md:text-7xl font-heading tracking-widest uppercase text-[#7A2856] leading-none">
              ANNIVERSARY <span className="text-[#C4276A]">SPECIAL OFFERS</span>
            </h2>
            <p className="text-base md:text-lg text-[#543245] max-w-2xl mx-auto font-medium">
              Exclusive deals crafted specifically for Lay Day Uluwatu’s 2-Year celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Offer 1: 2 Years Anniversary Buckets */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl bg-white border border-[#7A2856]/20 shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#7A2856] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                  🍹
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-[3px] text-[#7A2856]">
                  LIMITED EDITION
                </span>
                <h3 className="font-heading text-3xl md:text-4xl tracking-wide uppercase text-[#7A2856]">
                  2-YEAR ANNIVERSARY BUCKETS
                </h3>
                <p className="text-xs md:text-sm text-[#543245] leading-relaxed font-medium">
                  The Official Lay Day Uluwatu Anniversary Cocktail Buckets! Crafted to split with your crew around the pool. Available for one day only.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#7A2856]/15">
                <span className="text-xs font-bold text-[#7A2856] uppercase tracking-wider block">
                  ★ Available at Lay Day Uluwatu Bar
                </span>
              </div>
            </motion.div>

            {/* Offer 2: Watermelon Campaign & Raffle */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl bg-white border border-[#7A2856]/20 shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#C4276A] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                  🍉
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-[3px] text-[#C4276A]">
                  NEW CAMPAIGN LAUNCH
                </span>
                <h3 className="font-heading text-3xl md:text-4xl tracking-wide uppercase text-[#7A2856]">
                  WATERMELON DRINK & RAFFLE
                </h3>
                <p className="text-xs md:text-sm text-[#543245] leading-relaxed font-medium">
                  Launch of our brand new Watermelon campaign drink! Purchase the promotional cocktail and receive an official raffle ticket for the mystery grand prize draw.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#7A2856]/15">
                <span className="text-xs font-bold text-[#7A2856] uppercase tracking-wider block">
                  ★ Every Drink Includes 1x Raffle Entry
                </span>
              </div>
            </motion.div>

            {/* Offer 3: Limited Edition Merch */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl bg-white border border-[#7A2856]/20 shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#E5AB3A] text-black flex items-center justify-center font-bold text-2xl shadow-sm">
                  👕
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-[3px] text-[#7A2856]">
                  COLLECTOR MERCH
                </span>
                <h3 className="font-heading text-3xl md:text-4xl tracking-wide uppercase text-[#7A2856]">
                  2-YEAR ANNIVERSARY TEE
                </h3>
                <p className="text-xs md:text-sm text-[#543245] leading-relaxed font-medium">
                  Custom 2nd Anniversary collector’s T-shirt featuring the iconic disco cherries visual identity. Limited print run!
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#7A2856]/15">
                <span className="text-xs font-bold text-[#7A2856] uppercase tracking-wider block">
                  ★ Limited Run • Never Printed Again
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CTA & RSVP REGISTRATION BANNER ── */}
      <section className="py-24 md:py-36 bg-[#F4EFE6] border-t border-[#7A2856]/15 relative text-center overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#7A2856]/20 text-[#7A2856] text-xs font-extrabold uppercase tracking-[3px] shadow-sm">
            🍸 04.09.26 • SECURE YOUR GUESTLIST SPOT & FREE SHOT
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-heading tracking-widest uppercase leading-none text-[#7A2856]">
            DON&apos;T MISS <br />
            <span className="text-[#C4276A]">
              THE SEND OF THE YEAR
            </span>
          </h2>
          <p className="text-base sm:text-xl text-[#543245] font-medium max-w-2xl mx-auto leading-relaxed">
            Join the official Lay Day Uluwatu 2nd Anniversary guestlist now to lock your spot, claim your free welcome house shot upon arrival, and participate in the Foam Pool Party and 9:30 PM Sparkler Countdown.
          </p>

          <div className="pt-4 flex flex-col items-center justify-center gap-3">
            <Button
              onClick={() => setFormOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-[#7A2856] via-[#C4276A] to-[#7A2856] hover:opacity-95 text-white font-extrabold uppercase tracking-[3px] md:tracking-[4px] text-sm md:text-base h-16 md:h-20 px-10 md:px-16 rounded-none transition-all shadow-[0_8px_30px_rgba(122,40,86,0.35)] hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" /> JOIN THE GUESTLIST & GET A FREE SHOT 🍸
            </Button>
            <span className="text-[11px] md:text-xs font-bold uppercase tracking-[2px] text-[#7A2856]/70">
              ★ Free Registration • Lay Day Uluwatu
            </span>
          </div>
        </div>
      </section>

      {/* ── 9. FOOTER ── */}
      <footer className="bg-[#240A1A] text-white/70 py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-10 flex-shrink-0">
              <Image
                src={ASSETS.logo}
                alt="Lay Day Uluwatu Logo"
                fill
                className="object-contain filter invert"
              />
            </div>
            <div>
              <p className="font-heading text-2xl text-white tracking-widest uppercase">
                LAY DAY ULUWATU
              </p>
              <p className="text-xs uppercase tracking-widest text-[#E5AB3A]">
                2 Years • Bad Choices Make Good Stories
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-[2px]">
            <a
              href="https://www.instagram.com/staylayday/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/90 hover:text-[#E5AB3A] transition-colors"
            >
              <FaInstagram className="w-4 h-4" /> @staylayday
            </a>
          </div>

          <div className="text-[11px] text-white/40 tracking-wider">
            © {new Date().getFullYear()} Lay Day Hostels Bali. Bad choices make good stories.
          </div>
        </div>
      </footer>
    </div>
  );
}
