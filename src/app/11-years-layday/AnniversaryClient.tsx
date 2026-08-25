"use client";

import { useState, useRef, useEffect } from "react";
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
  ExternalLink,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { openCloudbedsBooking } from "@/lib/tracking";

// ─── Visual Assets ─────────────────────────────────────────────────────────────
const ASSETS = {
  mainPoster: "/anniversary_layday/LD-Anniversary-IGF.jpg",
  tearOffFlyer: "/anniversary_layday/LD-Cotent Social Media-IGF.jpg",
  teaserVideoWithDate: "/anniversary_layday/LD-Anniversary Teaser Video with Date.mp4",
  cangguBar: "/lay_day_canggu/the_bar.jpg",
  logo: "/logo-layday.png",
};

// ─── Wheel of Regret Segments (From Proposal PDF) ──────────────────────────────
interface WheelSegment {
  id: number;
  label: string;
  sub: string;
  color: string;
  icon: string;
  description: string;
}

const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: 0, label: "FREE SHOT", sub: "House Special Shot", color: "#FF5E36", icon: "🍸", description: "Head to the bar and claim your celebratory free house shot!" },
  { id: 1, label: "WATERFALL", sub: "Party Chain", color: "#E6007E", icon: "🌊", description: "Start a group waterfall with the 3 people closest to you!" },
  { id: 2, label: "DANCE OFF", sub: "Show Your Moves", color: "#FFE500", icon: "🕺", description: "Pick someone in the room for a 30-second bar dance off!" },
  { id: 3, label: "KISS NEIGHBOUR", sub: "Pucker Up", color: "#FF2A6D", icon: "😘", description: "Plant a cheeky kiss on the cheek of whoever is to your left!" },
  { id: 4, label: "BUY A DRINK", sub: "Hostel Karma", color: "#05D9E8", icon: "🍻", description: "Buy a cold Bintang for a stranger or your bartender!" },
  { id: 5, label: "KARAOKE SONG", sub: "Belt It Out", color: "#A855F7", icon: "🎤", description: "Grab the mic and belt out the chorus of an absolute banger!" },
  { id: 6, label: "DOUBLE SHOT", sub: "Double Trouble", color: "#FF8E00", icon: "⚡", description: "Double shot time: one for you, one for the legend next to you!" },
  { id: 7, label: "MYSTERY DARE", sub: "Staff Choice", color: "#00F0FF", icon: "🃏", description: "Ask the head bartender for the Anniversary Mystery Challenge!" },
];

// ─── Passport Challenge Items (From Proposal PDF) ─────────────────────────────
const PASSPORT_CHALLENGES = [
  { title: "Sink a Beer Pong Cup", icon: "🏓", points: "+1 Stamp" },
  { title: "Shot with a Staff Member", icon: "🥃", points: "+1 Stamp" },
  { title: "Kiss a Stranger", icon: "💋", points: "+1 Stamp" },
  { title: "Jump in the Pool", icon: "🏊‍♂️", points: "+1 Stamp" },
  { title: "Do a Shoey", icon: "👟", points: "+1 Stamp" },
  { title: "Dance on the Bar", icon: "💃", points: "+1 Stamp" },
  { title: "Complete a Body Shot", icon: "🔥", points: "+1 Stamp" },
  { title: "Complete a Tsunami Shot", icon: "🌊", points: "+1 Stamp" },
  { title: "Do a Shotgun", icon: "🍺", points: "+1 Stamp" },
  { title: "Do a Snorkel", icon: "🤿", points: "+1 Stamp" },
  { title: "Do a Funnel", icon: "🌪️", points: "+1 Stamp" },
  { title: "Do a Lap Dance", icon: "🕺", points: "+1 Stamp" },
];

// ─── Confession Cards (Based on Tear-Off Flyer) ───────────────────────────────
const CONFESSION_ITEMS = [
  {
    id: 1,
    question: "Slept in a stranger's bed?",
    badge: "Hostel Classic",
    story: "Woke up in Dorm 4 when you were actually booked in Dorm 12. Classic Lay Day room shuffle.",
    percent: 84,
  },
  {
    id: 2,
    question: "Swam in the pool after hours?",
    badge: "Midnight Send",
    story: "3:00 AM cannonball with 15 fellow travelers you met just three hours prior at the bar.",
    percent: 92,
  },
  {
    id: 3,
    question: "Lost your friend on a night out?",
    badge: "Canggu Maze",
    story: "Lost them at 11 PM, found them at 7 AM having breakfast with a French surf instructor.",
    percent: 78,
  },
  {
    id: 4,
    question: "Woke up with no idea where you were?",
    badge: "Bali Amnesia",
    story: "Looked out the window, saw palm trees, grabbed a fresh coconut, and kept the party rolling.",
    percent: 71,
  },
  {
    id: 5,
    question: "Made a best friend in one night?",
    badge: "Soul Connection",
    story: "Bonded over a tsunami shot and now you're traveling Southeast Asia together for 6 months.",
    percent: 96,
  },
  {
    id: 6,
    question: "Used someone else's towel?",
    badge: "Accidental Borrow",
    story: "They were all yellow stripe towels. You didn't mean to, but hey, you sent it anyway!",
    percent: 68,
  },
];

// ─── Schedule Items (From Proposal PDF) ───────────────────────────────────────
const SCHEDULE = [
  {
    time: "12:00 PM",
    title: "11TH ANNIVERSARY KICK-OFF",
    subtitle: "Hourly 11-Minute Flash Happy Hour",
    badge: "All Day Every Hour",
    color: "#FF5E36",
    description:
      "Starting at 12:00 PM sharp and repeating every hour on the hour: for 11 minutes only, selected drinks and shots are heavily discounted. Fast, loud, and high energy!",
  },
  {
    time: "ALL DAY",
    title: "LAY DAY PASSPORT CHALLENGE",
    subtitle: "12 Wild Hostel Dares & Grand Prize",
    badge: "Interactive",
    color: "#E6007E",
    description:
      "Grab your official 11th Anniversary Passport card. Complete challenges (Beer Pong, Staff Shots, Shoeys, Pool Jumps, Tsunami Shots) to collect stamps, win free shots, and enter the Limited Edition T-Shirt Grand Prize Draw.",
  },
  {
    time: "ALL DAY",
    title: "THE INFAMOUS WHEEL OF REGRET",
    subtitle: "Spins, Dares & Mystery Prizes",
    badge: "Bar Station",
    color: "#FFE500",
    description:
      "Step up to the Wheel of Regret throughout the day. Spin for random shots, group waterfalls, dance-offs, double shots, and mystery dares.",
  },
  {
    time: "4:00 PM",
    title: "LAY DAY LEGENDS AWARDS",
    subtitle: "Honoring 11 Years of Hostel Royalty",
    badge: "Ceremony",
    color: "#A855F7",
    description:
      "Celebrating the alumni, legends, and guests who made Lay Day legendary since 2015. Categories: Biggest Send, Most Extended Guest, Beer Pong Champ, Staff MVP, Volunteer Legend & Lifetime Party Achievement (with ceremonial Tsunami Shots!).",
  },
  {
    time: "6:00 PM",
    title: "TRADITIONAL NASI TUMPENG SUNSET FEAST",
    subtitle: "Indonesian Sacred Celebration",
    badge: "Complimentary Food",
    color: "#05D9E8",
    description:
      "A special anniversary moment where management, local Balinese staff, volunteers, alumni, and guests unite for the traditional ceremonial Nasi Tumpeng yellow rice cutting and sunset feast.",
  },
  {
    time: "7:00 PM - LATE",
    title: "LIVE DJ SESSIONS & ANNIVERSARY PUB CRAWL",
    subtitle: "Sunset -> Main Party -> Late Night",
    badge: "Live Music",
    color: "#FF2A6D",
    description:
      "Professional DJ sets taking the energy to the moon. Followed by the official 11-Year Anniversary Pub Crawl featuring the limited-edition anniversary crawl tee!",
  },
];

// ─── Conversational Form Questions (4 Steps) ──────────────────────────────────
type FormQuestion =
  | { type: "text"; q: string; placeholder: string; sub?: string }
  | { type: "email"; q: string; placeholder: string; sub?: string }
  | { type: "tel"; q: string; placeholder: string; sub?: string }
  | { type: "radio"; q: string; sub?: string; opts: string[] };

const FORM_QUESTIONS: FormQuestion[] = [
  {
    type: "text",
    q: "What is your full name?",
    placeholder: "e.g. Jake Miller",
    sub: "We'll have your name ready at the guestlist door.",
  },
  {
    type: "email",
    q: "What is your email address?",
    placeholder: "jake@example.com",
    sub: "We'll send your anniversary confirmation & schedule details.",
  },
  {
    type: "tel",
    q: "What is your WhatsApp / Phone number?",
    placeholder: "+62 812 3456 7890",
    sub: "Include your country code for fast guestlist door check-in.",
  },
  {
    type: "radio",
    q: "Which Lay Day location will you celebrate at?",
    sub: "Select your destination for the 04.09.26 celebration.",
    opts: [
      "Lay Day Canggu (The OG)",
      "Lay Day Gili T",
    ],
  },
  {
    type: "text",
    q: "What is your nationality?",
    placeholder: "e.g. Australia, Germany, Brazil...",
    sub: "Tell us where in the world you're joining us from.",
  },
];

// ─── Fullscreen Conversational Form Modal (Creators Week Style) ───────────────
function ConversationalFormModal({
  onClose,
  spinReward,
}: {
  onClose: () => void;
  spinReward: string | null;
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
    const location = finalAnswers[3] || "Lay Day Canggu (The OG)";
    const nationality = finalAnswers[4] || "";

    // 1. Submit to Google Sheets via Next.js API route
    try {
      await fetch("/api/anniversary-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          name,
          email,
          phone,
          location,
          nationality,
          group_size: "1",
          spin_result: spinReward || "Free Shot On Entry",
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
          origin: "anniversary",
          eventSourceUrl: typeof window !== "undefined" ? window.location.href : "",
          email,
          phone,
          firstName: name.split(" ")[0] || name,
          lastName: name.split(" ").slice(1).join(" ") || undefined,
          contentName: `11 Years Lay Day - ${location}`,
        }),
      });
    } catch (err) {
      console.error("Meta CAPI error:", err);
    }

    // 3. Track Pixel & GTM
    if (typeof window !== "undefined") {
      if ((window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: `11 Years Lay Day - ${location}`,
          currency: "IDR",
        });
      }
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: "anniversary_rsvp",
          name,
          location,
          spin_result: spinReward || "Free Shot On Entry",
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

  const handleRadioChoice = (val: string) => {
    const newAnswers = { ...answers, [step]: val };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (step < total - 1) {
        setStep((s) => s + 1);
      } else {
        submitApplication(newAnswers);
      }
    }, 250);
  };

  const canContinue = answers[step] !== undefined && answers[step].trim() !== "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#0A0810] text-white overflow-y-auto h-[100dvh]"
    >
      {/* Top Gradient Progress Bar */}
      <div className="w-full h-1.5 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FF5E36] via-[#E6007E] to-[#FFE500]"
          animate={{ width: `${done ? 100 : progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image src={ASSETS.logo} alt="Lay Day" fill className="object-contain" />
          </div>
          <span className="font-heading tracking-[3px] text-xs uppercase text-white/80">
            11th Anniversary Guestlist • 04.09.26
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-white/80" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ── SUCCESS SCREEN / THANK YOU POPUP ── */}
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 max-w-lg mx-auto gap-5 w-full my-auto"
          >
            {/* Animated Celebration Badge */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF5E36] via-[#E6007E] to-[#FFE500] flex items-center justify-center shadow-[0_0_50px_rgba(230,0,126,0.8)]">
                <Check className="w-10 h-10 text-white stroke-[3]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#FFE500] text-black flex items-center justify-center text-sm font-bold shadow-lg">
                🍸
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE500]/15 border border-[#FFE500]/40 text-[#FFE500] text-[11px] font-extrabold uppercase tracking-[2px]">
                ★ GUESTLIST SPOT CONFIRMED
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wider uppercase text-white leading-tight">
                YOU&apos;RE ON THE LIST!
              </h2>
              <p className="text-sm text-white/80 font-medium">
                Thank you, <span className="text-[#FFE500] font-bold">{answers[0]}</span>. Your spot for <span className="text-[#FF5E36] font-bold">{answers[3] || "Lay Day"}</span> is officially locked in!
              </p>
            </div>

            {/* Official Guestlist Pass Ticket Card */}
            <div className="w-full bg-gradient-to-b from-white/10 to-white/5 border-2 border-[#FFE500]/80 rounded-2xl p-5 text-left relative overflow-hidden shadow-[0_0_30px_rgba(255,229,0,0.2)]">
              <div className="absolute top-0 right-0 bg-[#FFE500] text-black font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                OFFICIAL GUESTLIST PASS
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[2px] text-white/50 block">GUEST NAME</span>
                  <span className="text-lg font-heading tracking-wide uppercase text-white font-bold">{answers[0] || "Lay Day Legend"}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[2px] text-white/50 block">DESTINATION</span>
                    <span className="text-xs font-bold uppercase text-[#FF5E36]">{answers[3] || "Lay Day Canggu"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[2px] text-white/50 block">EVENT DATE</span>
                    <span className="text-xs font-bold uppercase text-white">04 . 09 . 2026</span>
                  </div>
                </div>

                {/* Free Shot Perk Card */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#FF5E36]/20 via-[#E6007E]/20 to-[#FFE500]/20 border border-[#FFE500]/50 flex items-center gap-3">
                  <div className="text-2xl">🍸</div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFE500] block">
                      PERK INCLUDED: 1x FREE WELCOME SHOT
                    </span>
                    <span className="text-[11px] text-white/80 font-medium">
                      Claim your celebratory house shot at the bar upon entry!
                    </span>
                  </div>
                </div>

                {/* Spin Reward Reminder Box */}
                {spinReward && (
                  <div className="p-2.5 rounded-lg bg-[#FFE500]/10 border border-[#FFE500]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white">
                      <Camera className="w-3.5 h-3.5 text-[#FFE500]" />
                      <span>Wheel Reward: <strong className="text-[#FFE500]">{spinReward}</strong></span>
                    </div>
                    <span className="text-[9px] uppercase font-bold text-white/60 tracking-wider">Show Screenshot At Bar</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-white/70 font-medium leading-relaxed -mt-1">
              Simply give your name (<span className="text-white font-bold">{answers[0]}</span>) at the door to get in and claim your free welcome shot at the bar!
            </p>

            {/* Modal Actions */}
            <div className="w-full flex flex-col gap-2 pt-1">
              <Button
                onClick={() => {
                  onClose();
                  const scheduleEl = document.getElementById("schedule");
                  if (scheduleEl) {
                    scheduleEl.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full bg-gradient-to-r from-[#FF5E36] to-[#E6007E] hover:from-[#FF4116] hover:to-[#C4006B] text-white font-extrabold uppercase tracking-[3px] text-xs h-13 rounded-none shadow-[0_0_25px_rgba(230,0,126,0.5)] transition-all"
              >
                VIEW EVENT SCHEDULE & LINEUP <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <button
                onClick={onClose}
                className="text-xs text-white/50 hover:text-white uppercase tracking-widest font-bold py-2 transition-colors"
              >
                Return to Website
              </button>
            </div>
          </motion.div>
        ) : (
          /* ── QUESTION STEPS ── */
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-xl mx-auto w-full gap-6"
          >
            {/* Step Counter */}
            <div className="self-start flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-[3px] uppercase text-[#FF5E36]">
                Question {step + 1} of {total}
              </span>
            </div>

            {/* Question Title */}
            <h3 className="self-start font-heading text-3xl md:text-5xl tracking-wide uppercase text-white leading-tight">
              {current.q}
            </h3>

            {current.sub && (
              <p className="self-start text-xs md:text-sm text-white/60 font-medium -mt-2">
                {current.sub}
              </p>
            )}

            {/* Text / Email / Tel Input */}
            {current.type !== "radio" ? (
              <div className="w-full flex flex-col gap-6 pt-2">
                <input
                  type={current.type}
                  placeholder={current.placeholder}
                  value={answers[step] ?? ""}
                  onChange={(e) => setAnswers({ ...answers, [step]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && canContinue && nextStep()}
                  className="w-full border-b-2 border-white/30 focus:border-[#E6007E] bg-transparent py-4 text-xl md:text-2xl font-medium outline-none placeholder:text-white/25 text-white transition-colors"
                  autoFocus
                />
                <button
                  onClick={nextStep}
                  disabled={!canContinue || isSubmitting}
                  className="self-start flex items-center gap-2 bg-gradient-to-r from-[#FF5E36] to-[#E6007E] hover:from-[#FF4116] hover:to-[#C4006B] text-white font-extrabold uppercase tracking-[3px] text-xs px-8 h-12 rounded-none disabled:opacity-30 transition-all duration-300 shadow-[0_0_20px_rgba(230,0,126,0.4)]"
                >
                  {step === total - 1 ? (isSubmitting ? "CONFIRMING..." : "COMPLETE RSVP") : "NEXT"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Radio Options */
              <div className="w-full grid grid-cols-1 gap-3 pt-2">
                {current.opts.map((option, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleRadioChoice(option)}
                    className={`w-full text-left p-4 md:p-5 rounded-lg border text-sm md:text-base font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
                      answers[step] === option
                        ? "bg-[#E6007E] border-[#E6007E] text-white shadow-[0_0_20px_rgba(230,0,126,0.5)]"
                        : "bg-white/5 border-white/15 text-white/90 hover:bg-white/10 hover:border-white/30"
                    }`}
                  >
                    <span>{option}</span>
                    <ChevronRight className="w-5 h-5 text-white/50" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Landing Page Component ───────────────────────────────────────────────
export function AnniversaryClient() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<WheelSegment | null>(null);

  // Video State
  const videoRef = useRef<HTMLVideoElement>(null);

  // Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelModalOpen, setWheelModalOpen] = useState(false);

  // Confession voting state
  const [userVotes, setUserVotes] = useState<Record<number, "guilty" | "innocent">>({});
  const [activeConfessionTab, setActiveConfessionTab] = useState<number>(1);

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);

  // True Uniform Aleatory Wheel Spin
  const spinTheWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedReward(null);

    const segmentCount = WHEEL_SEGMENTS.length;
    const segmentAngle = 360 / segmentCount;

    // 1. Truly random uniform selection from 0 to 7
    let randomSegmentIndex: number;
    if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      randomSegmentIndex = array[0] % segmentCount;
    } else {
      randomSegmentIndex = Math.floor(Math.random() * segmentCount);
    }

    // 2. Compute the exact angle so top pointer lands right on this slice's center
    const centerAngle = randomSegmentIndex * segmentAngle + segmentAngle / 2;
    const targetOffset = (360 - centerAngle) % 360;

    // 3. Add 6 to 10 full random spins
    const currentBase = Math.ceil(wheelRotation / 360) * 360;
    const extraSpins = (6 + Math.floor(Math.random() * 5)) * 360;
    const finalDegree = currentBase + extraSpins + targetOffset;

    setWheelRotation(finalDegree);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedReward(WHEEL_SEGMENTS[randomSegmentIndex]);
      setWheelModalOpen(true);
    }, 4000);
  };

  return (
    <div className="bg-[#08070B] text-white font-sans selection:bg-[#E6007E] selection:text-white overflow-x-hidden min-h-screen">
      {/* ── FULLSCREEN CONVERSATIONAL FORM (Creators Week Style) ── */}
      <AnimatePresence>
        {formOpen && (
          <ConversationalFormModal
            onClose={() => setFormOpen(false)}
            spinReward={selectedReward?.label || null}
          />
        )}
      </AnimatePresence>

      {/* ── TOP ANNOUNCEMENT TICKER ── */}
      <div className="bg-gradient-to-r from-[#FF5E36] via-[#E6007E] to-[#8B5CF6] text-white text-[11px] md:text-xs font-extrabold uppercase tracking-[3px] py-2.5 px-4 text-center overflow-hidden flex items-center justify-center gap-3 shadow-lg z-30 relative">
        <span className="animate-pulse flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" /> 11 YEARS OF LAY DAY • 04.09.26 • SAVE THE DATE
        </span>
        <span className="opacity-75">|</span>
        <span className="text-[#FFE500] font-black drop-shadow-sm">🍸 JOIN GUESTLIST & GET A FREE SHOT</span>
      </div>

      {/* ── 1. HERO SECTION ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-10 md:pt-14 pb-16 px-4 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] md:w-[850px] h-[550px] md:h-[850px] bg-gradient-to-tr from-[#E6007E]/25 via-[#FF5E36]/20 to-[#FFE500]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Disco Star Particle Accents */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40 -z-10" />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="max-w-6xl mx-auto w-full flex flex-col items-center text-center relative z-10"
        >
          {/* Centered Lay Day Logo on top */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-24 h-24 md:w-32 md:h-32 mb-6 mx-auto filter drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]"
          >
            <Image src={ASSETS.logo} alt="Lay Day Logo" fill priority className="object-contain" />
          </motion.div>

          {/* Milestone Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-[#E6007E]/40 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(230,0,126,0.25)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#FFE500] animate-ping" />
            <span className="text-xs md:text-sm font-extrabold uppercase tracking-[3px] text-white">
              2015 – 2026 • 11TH ANNIVERSARY CELEBRATION
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="space-y-3 md:space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading tracking-[6px] md:tracking-[12px] uppercase text-[#FFE500] drop-shadow-[0_0_20px_rgba(255,229,0,0.4)]">
              11 YEARS OF LAY DAY
            </h2>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-heading tracking-[2px] md:tracking-[6px] uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 drop-shadow-[0_4px_30px_rgba(255,255,255,0.15)]">
              BAD CHOICES MAKE <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E36] via-[#E6007E] to-[#FF2A6D] drop-shadow-[0_0_35px_rgba(230,0,126,0.6)]">
                GOOD STORIES
              </span>
            </h1>
          </motion.div>

          {/* Subtitle & Taglines */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 md:mt-8 max-w-2xl text-base sm:text-lg md:text-xl text-white/80 font-medium leading-relaxed tracking-wide"
          >
            11 years. Countless stories. What started as 30 beds and an electric bar in Canggu became Bali’s most legendary party hostel institution. On{" "}
            <span className="text-[#FFE500] font-bold">04.09.26</span>, we celebrate every wild night, every lifelong friend, and every questionable decision that made us legends.
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
              className="w-full sm:w-auto bg-gradient-to-r from-[#FF5E36] via-[#E6007E] to-[#FF2A6D] hover:from-[#FF4116] hover:to-[#C4006B] text-white font-extrabold uppercase tracking-[3px] md:tracking-[4px] text-xs sm:text-sm md:text-base h-16 md:h-20 px-8 sm:px-12 md:px-16 rounded-none transition-all duration-300 shadow-[0_0_45px_rgba(230,0,126,0.7)] hover:scale-105 active:scale-95 group"
            >
              <span className="flex items-center gap-2">
                🍸 JOIN THE GUESTLIST & GET A FREE SHOT
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <span className="text-[11px] md:text-xs font-bold uppercase tracking-[2px] text-[#FFE500] drop-shadow-[0_0_10px_rgba(255,229,0,0.4)]">
              ★ Instant Door Access • Free Welcome Shot on Arrival • 100% Free RSVP
            </span>
          </motion.div>

          {/* Fast Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl pt-8 border-t border-white/10"
          >
            <div className="p-4 rounded-lg bg-white/5 border border-white/5 backdrop-blur-sm">
              <span className="font-heading text-4xl md:text-5xl text-[#FF5E36] block tracking-widest">11</span>
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-[2px] text-white/70">Years Sending It</span>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5 backdrop-blur-sm">
              <span className="font-heading text-4xl md:text-5xl text-[#E6007E] block tracking-widest">100K+</span>
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-[2px] text-white/70">Legends Hosted</span>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5 backdrop-blur-sm">
              <span className="font-heading text-4xl md:text-5xl text-[#FFE500] block tracking-widest">∞</span>
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-[2px] text-white/70">Bad Decisions</span>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5 backdrop-blur-sm">
              <span className="font-heading text-4xl md:text-5xl text-[#05D9E8] block tracking-widest">2</span>
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-[2px] text-white/70">Epic Locations</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. ARTWORK & VIDEO TEASER SECTION ── */}
      <section id="video" className="py-12 md:py-20 bg-[#0B0910] border-y border-white/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center justify-center">
            {/* Left: Poster Artwork Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative aspect-[4/5] max-w-sm sm:max-w-md mx-auto w-full rounded-2xl overflow-hidden border-[3px] border-[#E6007E]/40 shadow-[0_0_40px_rgba(230,0,126,0.3)] bg-black group"
            >
              <Image
                src={ASSETS.mainPoster}
                alt="11 Years of Lay Day Poster"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
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
              <div className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] rounded-2xl overflow-hidden border-[3px] border-[#FF5E36]/40 shadow-[0_0_50px_rgba(255,94,54,0.35)] bg-black">
                <video
                  ref={videoRef}
                  src={ASSETS.teaserVideoWithDate}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>

              {/* Save The Date Notice */}
              <div className="mt-6 flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
                <Calendar className="w-4 h-4 text-[#FFE500]" />
                <span className="text-xs font-bold uppercase tracking-[2px] text-white">
                  Event Date: <span className="text-[#FFE500]">04 . 09 . 26</span> • Bali & Gili T
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE "WHEEL OF REGRET" MINI-GAME ── */}
      <section id="wheel" className="py-20 md:py-32 bg-[#08070B] relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#FFE500]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FFE500]/10 border border-[#FFE500]/30 text-[#FFE500] text-xs font-extrabold uppercase tracking-[3px]">
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow" /> FEATURED ALL-DAY EVENT
            </div>
            <h2 className="text-4xl md:text-7xl font-heading tracking-widest uppercase text-white leading-none">
              THE WHEEL OF <span className="text-[#FFE500]">REGRET</span>
            </h2>
            <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto font-medium">
              Spin the official Lay Day Wheel of Regret to test your luck! Dares, free shots, group waterfalls, or instant hostel fame.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
            {/* The Interactive Wheel Container */}
            <div className="relative flex flex-col items-center">
              {/* Pointer / Flapper Indicator */}
              <div className="absolute -top-6 z-30 flex flex-col items-center filter drop-shadow-[0_4px_10px_rgba(255,229,0,0.8)]">
                <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[32px] border-t-[#FFE500]" />
              </div>

              {/* The Wheel */}
              <div className="relative w-[320px] sm:w-[420px] md:w-[460px] aspect-square rounded-full p-3 bg-gradient-to-b from-[#FFE500] via-[#FF5E36] to-[#E6007E] shadow-[0_0_60px_rgba(255,229,0,0.35)] border-[4px] border-white/20">
                <div
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transition: isSpinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
                  }}
                  className="relative w-full h-full rounded-full overflow-hidden bg-[#111] shadow-inner"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {WHEEL_SEGMENTS.map((seg, i) => {
                      const total = WHEEL_SEGMENTS.length;
                      const angle = 360 / total;
                      const startAngle = i * angle;
                      const endAngle = (i + 1) * angle;

                      // SVG polar to cartesian
                      const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                      const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                      const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                      const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                      const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
                      const textAngle = startAngle + angle / 2;

                      return (
                        <g key={i}>
                          <path
                            d={pathData}
                            fill={seg.color}
                            stroke="#08070B"
                            strokeWidth="0.8"
                            className="transition-colors hover:brightness-110"
                          />
                          <g transform={`rotate(${textAngle}, 50, 50)`}>
                            <text
                              x="50"
                              y="16"
                              fill="#000"
                              fontSize="3.8"
                              fontWeight="900"
                              letterSpacing="0.2"
                              textAnchor="middle"
                              transform={`rotate(90, 50, 16)`}
                              className="font-heading uppercase select-none"
                            >
                              {seg.label}
                            </text>
                            <text
                              x="50"
                              y="28"
                              fill="#000"
                              fontSize="5.5"
                              textAnchor="middle"
                              transform={`rotate(90, 50, 28)`}
                            >
                              {seg.icon}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Center Hub / Spin Button */}
                <button
                  onClick={spinTheWheel}
                  disabled={isSpinning}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-24 md:w-28 aspect-square rounded-full bg-black border-[4px] border-[#FFE500] text-white flex flex-col items-center justify-center font-heading text-sm sm:text-base tracking-widest uppercase shadow-[0_0_30px_rgba(255,229,0,0.8)] hover:scale-105 active:scale-95 transition-transform disabled:opacity-80 z-20"
                >
                  <span className="text-[#FFE500] font-extrabold">{isSpinning ? "SPINNING" : "SPIN"}</span>
                  <span className="text-[9px] tracking-[2px] text-white/80">WHEEL</span>
                </button>
              </div>
            </div>

            {/* Right: Outcome Rules & Instant Action */}
            <div className="max-w-md w-full space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFE500] text-black flex items-center justify-center font-bold text-lg">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl tracking-wider uppercase text-white">
                      HOW IT WORKS AT THE PARTY
                    </h3>
                    <p className="text-xs text-white/60 uppercase tracking-widest">
                      Every hour on the anniversary day
                    </p>
                  </div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  During the 11th Anniversary event, the physical giant Wheel of Regret will be live at the bar! Anyone on the guestlist gets free spins throughout the day to unlock shots, party challenges, and instant prizes.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 rounded bg-black/40 border border-white/10 text-xs">
                    <span className="text-[#FF5E36] font-bold block">🍸 Free Shots</span>
                    <span className="text-white/60 text-[11px]">Instant bartender pour</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-white/10 text-xs">
                    <span className="text-[#E6007E] font-bold block">🌊 Waterfalls</span>
                    <span className="text-white/60 text-[11px]">Start group chains</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-white/10 text-xs">
                    <span className="text-[#FFE500] font-bold block">🕺 Dance Offs</span>
                    <span className="text-white/60 text-[11px]">30 sec bar show</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-white/10 text-xs">
                    <span className="text-[#05D9E8] font-bold block">🃏 Mystery Dares</span>
                    <span className="text-white/60 text-[11px]">Hostel legend status</span>
                  </div>
                </div>

                <Button
                  onClick={spinTheWheel}
                  disabled={isSpinning}
                  className="w-full bg-[#FFE500] hover:bg-white text-black font-extrabold uppercase tracking-[3px] text-xs h-12 rounded-none transition-all shadow-[0_0_25px_rgba(255,229,0,0.5)]"
                >
                  <RotateCw className={`w-4 h-4 mr-2 ${isSpinning ? "animate-spin" : ""}`} />
                  {isSpinning ? "SPINNING THE REGRET..." : "TAKE A TEST SPIN NOW"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wheel Result Reward Modal with Screenshot Instruction */}
      <Dialog open={wheelModalOpen} onOpenChange={setWheelModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#0D0A14] border-[3px] border-[#FFE500] text-white rounded-none p-6 md:p-8 text-center shadow-[0_0_60px_rgba(0,0,0,0.95),0_0_30px_rgba(255,229,0,0.3)]">
          <DialogHeader>
            <div className="w-16 h-16 rounded-full bg-[#FFE500] text-black text-3xl flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(255,229,0,0.9)]">
              {selectedReward?.icon || "🎉"}
            </div>
            <DialogTitle className="text-3xl md:text-4xl font-heading tracking-widest text-[#FFE500] uppercase">
              {selectedReward?.label}
            </DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-[3px] text-white/80 font-bold">
              {selectedReward?.sub}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <p className="text-white text-base md:text-lg font-semibold leading-relaxed">
              {selectedReward?.description}
            </p>

            {/* Crucial Screenshot Notice - High Contrast */}
            <div className="p-4 md:p-5 bg-[#1B142B] border-[2px] border-[#FFE500] rounded-lg text-center space-y-2 shadow-[0_0_20px_rgba(255,229,0,0.25)]">
              <div className="flex items-center justify-center gap-2 text-[#FFE500] font-black text-sm uppercase tracking-wider">
                <Camera className="w-5 h-5 animate-pulse text-[#FFE500]" />
                TAKE A SCREENSHOT OF THIS RESULT!
              </div>
              <p className="text-xs md:text-sm text-white font-medium leading-relaxed">
                Show this screenshot at the front door when giving your name on the guestlist to claim this reward / challenge!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={() => {
                setWheelModalOpen(false);
                setFormOpen(true);
              }}
              className="flex-1 bg-[#E6007E] hover:bg-white text-white hover:text-black font-extrabold uppercase tracking-[3px] text-xs h-13 rounded-none transition-all shadow-[0_0_25px_rgba(230,0,126,0.7)]"
            >
              CLAIM GUESTLIST & FREE SHOT 🍸
            </Button>
            <button
              onClick={() => setWheelModalOpen(false)}
              className="px-6 h-13 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold uppercase tracking-wider text-xs transition-colors"
            >
              CLOSE
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 4. "BAD DECISIONS MAKE GOOD STORIES" TEAR-OFF BOARD ── */}
      <section id="confessions" className="py-20 md:py-32 bg-[#0C0A14] border-t border-white/10 relative overflow-hidden">
        {/* Ambient magenta glow */}
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#E6007E]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <span className="text-xs font-extrabold tracking-[4px] uppercase text-[#E6007E]">
              11 YEARS • COUNTLESS STORIES
            </span>
            <h2 className="text-4xl md:text-7xl font-heading tracking-widest uppercase text-white">
              BAD DECISIONS <span className="text-[#FF5E36]">CONFESSION BOARD</span>
            </h2>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto font-medium">
              We asked 11 years of Lay Day alumni about their wildest hostel moments. Click any tab below to tear off a confession and cast your vote!
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
                      ? "bg-gradient-to-b from-white/15 to-white/5 border-[#E6007E] shadow-[0_0_30px_rgba(230,0,126,0.3)]"
                      : "bg-white/5 border-white/10 hover:border-white/25"
                  }`}
                >
                  {/* Card Header & Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-[2px] px-2.5 py-1 rounded bg-[#E6007E]/20 text-[#E6007E] border border-[#E6007E]/30">
                        {item.badge}
                      </span>
                      <span className="text-xs font-bold text-white/50">#{item.id}</span>
                    </div>

                    <h3 className="font-heading text-2xl md:text-3xl tracking-wide uppercase text-white leading-snug mb-3">
                      &ldquo;{item.question}&rdquo;
                    </h3>

                    <p className="text-xs md:text-sm text-white/70 leading-relaxed italic mb-6">
                      {item.story}
                    </p>
                  </div>

                  {/* Interactive Voting / Confession Bar */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="text-white/60">Community Verdict:</span>
                      <span className="text-[#FFE500]">{item.percent}% GUILTY</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF5E36] to-[#E6007E] transition-all duration-700"
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
                            ? "bg-[#E6007E] border-[#E6007E] text-white shadow-[0_0_15px_rgba(230,0,126,0.6)]"
                            : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
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
                            ? "bg-[#05D9E8] border-[#05D9E8] text-black shadow-[0_0_15px_rgba(5,217,232,0.6)]"
                            : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
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
          <div className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#FF5E36]/15 via-[#E6007E]/15 to-[#8B5CF6]/15 border border-white/15 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h4 className="font-heading text-2xl md:text-3xl tracking-wider uppercase text-white">
                GOT AN UNFORGETTABLE LAY DAY STORY?
              </h4>
              <p className="text-xs md:text-sm text-white/70 max-w-xl">
                Submit your wildest Lay Day memory on Instagram with hashtag <span className="text-[#FFE500] font-bold">#BadChoicesMakeGoodStories</span> or tag <span className="text-[#FF5E36] font-bold">@laydaycanggu</span> to be featured during the Legends Awards!
              </p>
            </div>
            <a
              href="https://www.instagram.com/laydaycanggu/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-[#E6007E] to-[#FF5E36] text-white font-extrabold uppercase tracking-[3px] text-xs px-6 h-12 shadow-xl hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <FaInstagram className="w-4 h-4" /> SHARE ON INSTAGRAM
            </a>
          </div>
        </div>
      </section>

      {/* ── 5. FULL-DAY EVENT SCHEDULE & PROGRAM ── */}
      <section id="schedule" className="py-20 md:py-32 bg-[#08070B] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-extrabold tracking-[4px] uppercase text-[#FFE500]">
              EVENT PROGRAM & LINEUP
            </span>
            <h2 className="text-4xl md:text-7xl font-heading tracking-widest uppercase text-white leading-none">
              THE 11TH <span className="text-[#FF5E36]">ANNIVERSARY SCHEDULE</span>
            </h2>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto font-medium">
              From 12:00 PM kick-off to the late-night pub crawl, here is how we’re sending it all day long across Bali & Gili T.
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
                className="p-6 md:p-8 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col md:flex-row gap-6 md:items-center justify-between group"
              >
                {/* Time & Badge */}
                <div className="flex flex-col md:w-56 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#FFE500]" />
                    <span className="font-heading text-3xl md:text-4xl tracking-wider text-white group-hover:text-[#FFE500] transition-colors">
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
                  <h3 className="font-heading text-2xl md:text-3xl tracking-wide uppercase text-white">
                    {item.title}
                  </h3>
                  <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-[#FF5E36]">
                    {item.subtitle}
                  </h4>
                  <p className="text-xs md:text-sm text-white/70 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. PASSPORT CHALLENGE SHOWCASE ── */}
      <section className="py-20 bg-[#0C0A14] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6007E]/10 border border-[#E6007E]/30 text-[#E6007E] text-xs font-extrabold uppercase tracking-[3px]">
              <Trophy className="w-4 h-4" /> ALL-DAY FESTIVAL PASSPORT
            </div>
            <h2 className="text-4xl md:text-6xl font-heading tracking-widest uppercase text-white">
              12 DARES. <span className="text-[#E6007E]">ENDLESS GLORY.</span>
            </h2>
            <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto font-medium">
              Collect stamps on your physical Anniversary Passport to win free shots and unlock entry into the 11th Anniversary Grand Prize Draw!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {PASSPORT_CHALLENGES.map((challenge, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#E6007E]/50 transition-all flex flex-col items-center text-center space-y-2 group"
              >
                <span className="text-3xl mb-1 group-hover:scale-125 transition-transform duration-300">
                  {challenge.icon}
                </span>
                <h4 className="font-heading text-lg md:text-xl text-white tracking-wide uppercase">
                  {challenge.title}
                </h4>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFE500]">
                  {challenge.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. ANNIVERSARY SPECIALS & LIMITED OFFERS ── */}
      <section id="offers" className="py-20 md:py-32 bg-[#08070B] border-t border-white/10 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-extrabold tracking-[4px] uppercase text-[#FF5E36]">
              ONE DAY ONLY • 04.09.26
            </span>
            <h2 className="text-4xl md:text-7xl font-heading tracking-widest uppercase text-white leading-none">
              ANNIVERSARY <span className="text-[#FFE500]">SPECIAL OFFERS</span>
            </h2>
            <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto font-medium">
              Exclusive anniversary deals crafted specifically for Lay Day’s 11-Year milestone celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Offer 1: 11 Years 11 Shots Paddle */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-[#FF5E36]/40 shadow-[0_0_30px_rgba(255,94,54,0.2)] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF5E36] text-black flex items-center justify-center font-bold text-2xl">
                  🥃
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-[3px] text-[#FF5E36]">
                  LIMITED EDITION
                </span>
                <h3 className="font-heading text-3xl md:text-4xl tracking-wide uppercase text-white">
                  11 YEARS, 11 SHOTS
                </h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed font-medium">
                  The Official Lay Day Anniversary Shot Paddle! 11 curated mini shots to split with your crew or conquer together. Available for one day only.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10">
                <span className="text-xs font-bold text-[#FFE500] uppercase tracking-wider block">
                  ★ Available at Canggu & Gili T Bars
                </span>
              </div>
            </motion.div>

            {/* Offer 2: 11-Minute Hourly Happy Hour */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-[#E6007E]/40 shadow-[0_0_30px_rgba(230,0,126,0.2)] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#E6007E] text-white flex items-center justify-center font-bold text-2xl">
                  ⚡
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-[3px] text-[#E6007E]">
                  HOURLY FLASH DEALS
                </span>
                <h3 className="font-heading text-3xl md:text-4xl tracking-wide uppercase text-white">
                  11-MINUTE HAPPY HOURS
                </h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed font-medium">
                  Every single hour from 12:00 PM till late, a siren sounds: for exactly 11 minutes, selected beers, cocktails, and shots are heavily discounted!
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10">
                <span className="text-xs font-bold text-[#FFE500] uppercase tracking-wider block">
                  ★ Slashes Prices Every Hour on the Hour
                </span>
              </div>
            </motion.div>

            {/* Offer 3: Limited Edition Merch */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-[#FFE500]/40 shadow-[0_0_30px_rgba(255,229,0,0.2)] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFE500] text-black flex items-center justify-center font-bold text-2xl">
                  👕
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-[3px] text-[#FFE500]">
                  COLLECTOR MERCH
                </span>
                <h3 className="font-heading text-3xl md:text-4xl tracking-wide uppercase text-white">
                  11-YEAR ANNIVERSARY TEE
                </h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed font-medium">
                  Custom 11th Anniversary collector’s T-shirt included in the anniversary pub crawl package and available as the Passport Grand Prize!
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10">
                <span className="text-xs font-bold text-[#FFE500] uppercase tracking-wider block">
                  ★ Limited Run • Never Printed Again
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CTA & RSVP REGISTRATION BANNER ── */}
      <section className="py-24 md:py-36 bg-gradient-to-b from-[#0C0A14] to-[#08070B] border-t border-white/10 relative text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#E6007E]/25 to-[#FF5E36]/20 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FFE500] text-xs font-extrabold uppercase tracking-[3px]">
            🍸 04.09.26 • SECURE YOUR GUESTLIST SPOT & FREE SHOT
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-heading tracking-widest uppercase leading-none text-white drop-shadow-[0_0_30px_rgba(255,94,54,0.4)]">
            DON&apos;T MISS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E36] via-[#E6007E] to-[#FFE500]">
              THE SEND OF THE DECADE
            </span>
          </h2>
          <p className="text-base sm:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Join the official anniversary guestlist now to lock your spot, claim your free welcome house shot upon arrival, and unlock physical Wheel of Regret spin tokens.
          </p>

          <div className="pt-4 flex flex-col items-center justify-center gap-3">
            <Button
              onClick={() => setFormOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-[#FF5E36] to-[#E6007E] hover:from-[#FF4116] hover:to-[#C4006B] text-white font-extrabold uppercase tracking-[3px] md:tracking-[4px] text-sm md:text-base h-16 md:h-20 px-10 md:px-16 rounded-none transition-all shadow-[0_0_45px_rgba(230,0,126,0.6)] hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" /> JOIN THE GUESTLIST & GET A FREE SHOT 🍸
            </Button>
            <span className="text-[11px] md:text-xs font-bold uppercase tracking-[2px] text-white/60">
              ★ Free Registration • Canggu & Gili T
            </span>
          </div>
        </div>
      </section>

      {/* ── 10. FOOTER ── */}
      <footer className="bg-[#050408] text-white/60 py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image src={ASSETS.logo} alt="Lay Day Logo" fill className="object-contain" />
            </div>
            <div>
              <p className="font-heading text-2xl text-white tracking-widest uppercase">
                LAY DAY HOSTELS BALI
              </p>
              <p className="text-xs uppercase tracking-widest text-[#E6007E]">
                11 Years • Still Sending Since 2015
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-[2px]">
            <a
              href="https://www.instagram.com/laydaycanggu/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/80 hover:text-[#FF5E36] transition-colors"
            >
              <FaInstagram className="w-4 h-4" /> @laydaycanggu
            </a>
            <a
              href="https://www.instagram.com/laydaygilit/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/80 hover:text-[#05D9E8] transition-colors"
            >
              <FaInstagram className="w-4 h-4" /> @laydaygilit
            </a>
          </div>

          <div className="text-[11px] text-white/40 tracking-wider">
            © {new Date().getFullYear()} Lay Day Hostels. Bad choices make good stories.
          </div>
        </div>
      </footer>
    </div>
  );
}
