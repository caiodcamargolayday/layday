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
  mainPoster: "/anniversary_layday_uluwatu/IMG_7040.JPEG",
  doorHanger: "/anniversary_layday/LDU-Anniversary Teaser-IGF.jpg",
  teaserVideo: "/anniversary_layday_uluwatu/LDU-Anniversary Teaser Video.mp4",
  logo: "/logo_layday_uluwatu.png",
  mainLogo: "/logo-layday.png",
};

// ─── Wheel of Regret Segments (Uluwatu Plum & Cherry Palette) ─────────────────
interface WheelSegment {
  id: number;
  label: string;
  sub: string;
  color: string;
  icon: string;
  description: string;
}

const WHEEL_SEGMENTS: WheelSegment[] = [
  {
    id: 0,
    label: "FREE SHOT",
    sub: "House Special Shot",
    color: "#7A2856",
    icon: "🍸",
    description: "Head to the Uluwatu pool bar and claim your celebratory free house shot!",
  },
  {
    id: 1,
    label: "WATERFALL",
    sub: "Party Chain",
    color: "#C4276A",
    icon: "🌊",
    description: "Start a group waterfall with the 3 people closest to you by the pool!",
  },
  {
    id: 2,
    label: "DANCE OFF",
    sub: "Show Your Moves",
    color: "#E5AB3A",
    icon: "🕺",
    description: "Pick someone by the deck for a 30-second bar dance-off!",
  },
  {
    id: 3,
    label: "KISS NEIGHBOUR",
    sub: "Pucker Up",
    color: "#9C3B6E",
    icon: "😘",
    description: "Plant a cheeky kiss on the cheek of whoever is to your left!",
  },
  {
    id: 4,
    label: "BUY A DRINK",
    sub: "Hostel Karma",
    color: "#5E193E",
    icon: "🍻",
    description: "Buy a cold Bintang for a stranger or your favorite Uluwatu bartender!",
  },
  {
    id: 5,
    label: "KARAOKE SONG",
    sub: "Belt It Out",
    color: "#D97706",
    icon: "🎤",
    description: "Grab the mic and belt out the chorus of an absolute party anthem!",
  },
  {
    id: 6,
    label: "DOUBLE SHOT",
    sub: "Double Trouble",
    color: "#8D255F",
    icon: "⚡",
    description: "Double shot time: one for you, one for the legend next to you!",
  },
  {
    id: 7,
    label: "MYSTERY DARE",
    sub: "Bartender Choice",
    color: "#B45309",
    icon: "🃏",
    description: "Ask the Uluwatu head bartender for the 2nd Anniversary Mystery Challenge!",
  },
];

// ─── Passport Challenge Items (Uluwatu 12 Dares) ──────────────────────────────
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

// ─── Confession Cards (Directly from Uluwatu Poster IMG_7040.JPEG) ─────────────
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

// ─── Schedule Items (Uluwatu 2nd Anniversary Edition) ─────────────────────────
const SCHEDULE = [
  {
    time: "12:00 PM",
    title: "2ND ANNIVERSARY KICK-OFF",
    subtitle: "Hourly Flash Happy Hours",
    badge: "All Day Every Hour",
    color: "#7A2856",
    description:
      "Starting at 12:00 PM sharp and repeating every hour on the hour: for rapid flash windows, selected Bintangs, cocktails, and shots are heavily discounted! Fast, loud, and pure Uluwatu energy.",
  },
  {
    time: "ALL DAY",
    title: "ULUWATU PASSPORT CHALLENGE",
    subtitle: "12 Wild Hostel Dares & Grand Prize",
    badge: "Interactive Mini-Game",
    color: "#C4276A",
    description:
      "Grab your official 2nd Anniversary Passport card at check-in. Complete challenges (Beer Pong, Staff Shots, Shoeys, Pool Cannonballs, Tsunami Shots) to collect stamps, win free shots, and enter the Limited Edition Merch Grand Prize Draw.",
  },
  {
    time: "ALL DAY",
    title: "THE INFAMOUS WHEEL OF REGRET",
    subtitle: "Spins, Dares & Mystery Free Shots",
    badge: "Pool Bar Station",
    color: "#E5AB3A",
    description:
      "Step up to the giant physical Wheel of Regret at the Uluwatu pool deck. Spin for random shots, group waterfalls, dance-offs, double shots, and mystery dares throughout the celebration.",
  },
  {
    time: "4:00 PM",
    title: "LAY DAY ULUWATU LEGENDS AWARDS",
    subtitle: "Honoring 2 Years of Wild Memories",
    badge: "Ceremony",
    color: "#9C3B6E",
    description:
      "Celebrating the alumni, legends, volunteers, and guests who made Lay Day Uluwatu electric since day one. Categories: Biggest Send, Most Extended Stay, Pool MVP, and Lifetime Party Achievement (with ceremonial Tsunami Shots!).",
  },
  {
    time: "6:00 PM",
    title: "TRADITIONAL NASI TUMPENG SUNSET FEAST",
    subtitle: "Indonesian Sacred Celebration",
    badge: "Complimentary Food",
    color: "#D97706",
    description:
      "A sacred celebratory moment where management, local Balinese staff, volunteers, alumni, and guests unite for the traditional ceremonial Nasi Tumpeng yellow rice cutting and complimentary sunset feast.",
  },
  {
    time: "7:00 PM - LATE",
    title: "LIVE SUNSET DJS & ULUWATU ANNIVERSARY SEND",
    subtitle: "Sunset Beats -> Pool Party -> Late Night",
    badge: "Live Music & DJs",
    color: "#7A2856",
    description:
      "Resident and guest DJs turning up the volume into the night. Expect heavy bass, disco cherry vibes, and unforgettable Bukit memories!",
  },
];

// ─── Conversational Form Questions (3 Direct Steps) ───────────────────────────
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
];

// ─── Fullscreen Conversational Form Modal ─────────────────────────────────────
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
    const reward = spinReward || "Free Shot On Entry";

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
          location: "Lay Day Uluwatu (2nd Anniversary)",
          venue: "Lay Day Uluwatu",
          group_size: "1",
          spin_result: reward,
          eventDate: "04.09.26",
          sourceUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
    } catch (err) {
      console.error("Sheet API error:", err);
    }

    // 2. Submit to Meta CAPI
    try {
      await fetch("/api/meta-capi/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: "anniversary-uluwatu",
          eventSourceUrl: typeof window !== "undefined" ? window.location.href : "",
          email,
          phone,
          firstName: name.split(" ")[0] || name,
          lastName: name.split(" ").slice(1).join(" ") || undefined,
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
          spin_result: reward,
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
                      DATE
                    </span>
                    <span className="text-xs font-bold uppercase text-[#7A2856]">
                      04 . 09 . 26
                    </span>
                  </div>
                </div>

                <div className="pt-1 border-t border-[#7A2856]/15">
                  <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#7A2856]/60 block">
                    UNLOCKED PERK / REWARD
                  </span>
                  <span className="text-xs font-black uppercase text-[#C4276A] tracking-wider flex items-center gap-1.5 mt-0.5">
                    🍸 {spinReward || "Free Welcome House Shot On Entry"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-[#7A2856]/20 flex items-center justify-between text-[10px] text-[#7A2856]/70 font-mono">
                <span>#LDU-ANNIV-2026</span>
                <span className="text-[#7A2856] font-bold">★ SHOW AT DOOR</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full pt-1">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `I just got on the guestlist for Lay Day Uluwatu's 2nd Anniversary on 04.09.26! Claim your spot and free welcome shot here: ${
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
                {spinReward && (
                  <span className="text-[11px] font-bold text-[#C4276A] uppercase tracking-wider bg-[#C4276A]/10 border border-[#C4276A]/20 px-2.5 py-1 rounded-full">
                    Prize: {spinReward}
                  </span>
                )}
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
  const [selectedReward, setSelectedReward] = useState<WheelSegment | null>(null);

  // Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelModalOpen, setWheelModalOpen] = useState(false);

  // Confession voting state
  const [userVotes, setUserVotes] = useState<Record<number, "guilty" | "innocent">>({});
  const [activeConfessionTab, setActiveConfessionTab] = useState<number>(1);

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.98]);

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
            spinReward={selectedReward?.label || null}
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
          {/* Centered Lay Day Uluwatu Logo (Natural Black on Cream Background) */}
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

          {/* Main Headline (Plum Letters as in IMG_7040.JPEG) */}
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
            2 years of unforgettable Bukit sunsets, legendary pool parties, and wild sends. On{" "}
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
            {/* Left: Poster Artwork Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative aspect-[9/16] sm:aspect-[4/5] max-w-sm sm:max-w-md mx-auto w-full rounded-2xl overflow-hidden border-[3px] border-[#7A2856]/30 shadow-[0_15px_40px_rgba(122,40,86,0.15)] bg-white group"
            >
              <Image
                src={ASSETS.mainPoster}
                alt="2 Years of Lay Day Uluwatu Poster"
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

      {/* ── 3. INTERACTIVE "WHEEL OF REGRET" MINI-GAME ── */}
      <section id="wheel" className="py-20 md:py-32 bg-[#FAF8F2] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#7A2856]/10 border border-[#7A2856]/30 text-[#7A2856] text-xs font-extrabold uppercase tracking-[3px]">
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow" /> FEATURED ALL-DAY EVENT
            </div>
            <h2 className="text-4xl md:text-7xl font-heading tracking-widest uppercase text-[#7A2856] leading-none">
              THE WHEEL OF <span className="text-[#C4276A]">REGRET</span>
            </h2>
            <p className="text-base md:text-lg text-[#543245] max-w-xl mx-auto font-medium">
              Spin the official Lay Day Wheel of Regret to test your luck! Dares, free shots, group waterfalls, or instant hostel fame.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
            {/* The Interactive Wheel Container */}
            <div className="relative flex flex-col items-center">
              {/* Pointer / Flapper Indicator */}
              <div className="absolute -top-6 z-30 flex flex-col items-center filter drop-shadow-[0_4px_10px_rgba(122,40,86,0.5)]">
                <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[32px] border-t-[#7A2856]" />
              </div>

              {/* The Wheel */}
              <div className="relative w-[320px] sm:w-[420px] md:w-[460px] aspect-square rounded-full p-3 bg-gradient-to-b from-[#7A2856] via-[#C4276A] to-[#E5AB3A] shadow-[0_15px_50px_rgba(122,40,86,0.25)] border-[4px] border-white">
                <div
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transition: isSpinning
                      ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                      : "none",
                  }}
                  className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-inner"
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
                            stroke="#FAF8F2"
                            strokeWidth="0.8"
                            className="transition-colors hover:brightness-110"
                          />
                          <g transform={`rotate(${textAngle}, 50, 50)`}>
                            <text
                              x="50"
                              y="16"
                              fill="#FFF"
                              fontSize="3.8"
                              fontWeight="900"
                              letterSpacing="0.2"
                              textAnchor="middle"
                              transform={`rotate(90, 50, 16)`}
                              className="font-heading uppercase select-none drop-shadow-sm"
                            >
                              {seg.label}
                            </text>
                            <text
                              x="50"
                              y="28"
                              fill="#FFF"
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
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-24 md:w-28 aspect-square rounded-full bg-[#7A2856] border-[4px] border-white text-white flex flex-col items-center justify-center font-heading text-sm sm:text-base tracking-widest uppercase shadow-[0_4px_20px_rgba(122,40,86,0.6)] hover:scale-105 active:scale-95 transition-transform disabled:opacity-80 z-20"
                >
                  <span className="text-white font-extrabold">
                    {isSpinning ? "SPINNING" : "SPIN"}
                  </span>
                  <span className="text-[9px] tracking-[2px] text-white/80">WHEEL</span>
                </button>
              </div>
            </div>

            {/* Right: Outcome Rules & Instant Action */}
            <div className="max-w-md w-full space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-[#7A2856]/15 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7A2856] text-white flex items-center justify-center font-bold text-lg">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl tracking-wider uppercase text-[#7A2856]">
                      HOW IT WORKS AT THE PARTY
                    </h3>
                    <p className="text-xs text-[#7A2856]/70 uppercase tracking-widest">
                      Every hour on the anniversary day
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[#543245] leading-relaxed">
                  During the 2nd Anniversary celebration, the physical giant Wheel of Regret will be live at the Uluwatu pool bar! Anyone on the guestlist gets free spins throughout the day to unlock shots, party challenges, and instant prizes.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 rounded bg-[#FAF8F2] border border-[#7A2856]/15 text-xs">
                    <span className="text-[#7A2856] font-bold block">🍸 Free Shots</span>
                    <span className="text-[#543245] text-[11px]">Instant bartender pour</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#FAF8F2] border border-[#7A2856]/15 text-xs">
                    <span className="text-[#C4276A] font-bold block">🌊 Waterfalls</span>
                    <span className="text-[#543245] text-[11px]">Start group chains</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#FAF8F2] border border-[#7A2856]/15 text-xs">
                    <span className="text-[#E5AB3A] font-bold block">🕺 Dance Offs</span>
                    <span className="text-[#543245] text-[11px]">30 sec deck show</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#FAF8F2] border border-[#7A2856]/15 text-xs">
                    <span className="text-[#9C3B6E] font-bold block">🃏 Mystery Dares</span>
                    <span className="text-[#543245] text-[11px]">Hostel legend status</span>
                  </div>
                </div>

                <Button
                  onClick={spinTheWheel}
                  disabled={isSpinning}
                  className="w-full bg-[#7A2856] hover:bg-[#5E193E] text-white font-extrabold uppercase tracking-[3px] text-xs h-12 rounded-none transition-all shadow-[0_4px_15px_rgba(122,40,86,0.3)]"
                >
                  <RotateCw
                    className={`w-4 h-4 mr-2 ${isSpinning ? "animate-spin" : ""}`}
                  />
                  {isSpinning ? "SPINNING THE REGRET..." : "TAKE A TEST SPIN NOW"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wheel Result Reward Modal with Screenshot Instruction */}
      <Dialog open={wheelModalOpen} onOpenChange={setWheelModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#FAF8F2] border-[3px] border-[#7A2856] text-[#2E1824] rounded-none p-6 md:p-8 text-center shadow-[0_20px_50px_rgba(122,40,86,0.3)]">
          <DialogHeader>
            <div className="w-16 h-16 rounded-full bg-[#7A2856] text-white text-3xl flex items-center justify-center mx-auto mb-3 shadow-md">
              {selectedReward?.icon || "🎉"}
            </div>
            <DialogTitle className="text-3xl md:text-4xl font-heading tracking-widest text-[#7A2856] uppercase">
              {selectedReward?.label}
            </DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-[3px] text-[#7A2856]/80 font-bold">
              {selectedReward?.sub}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <p className="text-[#543245] text-base md:text-lg font-semibold leading-relaxed">
              {selectedReward?.description}
            </p>

            {/* Crucial Screenshot Notice */}
            <div className="p-4 md:p-5 bg-white border-[2px] border-[#7A2856] rounded-lg text-center space-y-2 shadow-sm">
              <div className="flex items-center justify-center gap-2 text-[#7A2856] font-black text-sm uppercase tracking-wider">
                <Camera className="w-5 h-5 animate-pulse text-[#7A2856]" />
                TAKE A SCREENSHOT OF THIS RESULT!
              </div>
              <p className="text-xs md:text-sm text-[#543245] font-medium leading-relaxed">
                Show this screenshot at the door when giving your name on the guestlist to claim this reward / challenge!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={() => {
                setWheelModalOpen(false);
                setFormOpen(true);
              }}
              className="flex-1 bg-[#7A2856] hover:bg-[#5E193E] text-white font-extrabold uppercase tracking-[3px] text-xs h-13 rounded-none transition-all shadow-md"
            >
              CLAIM GUESTLIST & FREE SHOT 🍸
            </Button>
            <button
              onClick={() => setWheelModalOpen(false)}
              className="px-6 h-13 bg-white hover:bg-[#F4EFE6] text-[#7A2856] border border-[#7A2856]/30 font-bold uppercase tracking-wider text-xs transition-colors"
            >
              CLOSE
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 4. "BAD DECISIONS MAKE GOOD STORIES" TEAR-OFF BOARD (White Paper Flyer Theme) ── */}
      <section
        id="confessions"
        className="py-20 md:py-32 bg-[#F4EFE6] border-t border-[#7A2856]/15 relative overflow-hidden"
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
              We pulled the top questions directly from the official Lay Day Uluwatu tear-off flyer! Click any card below to tear off a confession and cast your verdict.
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
                <span className="text-[#C4276A] font-bold">@laydayuluwatu</span> to be featured during the Legends Awards!
              </p>
            </div>
            <a
              href="https://www.instagram.com/laydayuluwatu/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#7A2856] hover:bg-[#5E193E] text-white font-extrabold uppercase tracking-[3px] text-xs px-6 h-12 shadow-md transition-all flex-shrink-0"
            >
              <FaInstagram className="w-4 h-4" /> SHARE ON INSTAGRAM
            </a>
          </div>
        </div>
      </section>

      {/* ── 5. FULL-DAY EVENT SCHEDULE & PROGRAM ── */}
      <section
        id="schedule"
        className="py-20 md:py-32 bg-[#FAF8F2] border-t border-[#7A2856]/15 relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-extrabold tracking-[4px] uppercase text-[#7A2856]">
              EVENT PROGRAM & LINEUP
            </span>
            <h2 className="text-4xl md:text-7xl font-heading tracking-widest uppercase text-[#7A2856] leading-none">
              THE 2ND <span className="text-[#C4276A]">ANNIVERSARY SCHEDULE</span>
            </h2>
            <p className="text-base md:text-lg text-[#543245] max-w-2xl mx-auto font-medium">
              From 12:00 PM kick-off to the late-night pool party, here is how we’re celebrating 2 years in Uluwatu.
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
                <div className="flex flex-col md:w-56 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#7A2856]" />
                    <span className="font-heading text-3xl md:text-4xl tracking-wider text-[#7A2856] group-hover:text-[#C4276A] transition-colors">
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

      {/* ── 6. PASSPORT CHALLENGE SHOWCASE ── */}
      <section className="py-20 bg-[#F4EFE6] border-t border-[#7A2856]/15 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#7A2856]/20 text-[#7A2856] text-xs font-extrabold uppercase tracking-[3px] shadow-sm">
              <Trophy className="w-4 h-4" /> ALL-DAY FESTIVAL PASSPORT
            </div>
            <h2 className="text-4xl md:text-6xl font-heading tracking-widest uppercase text-[#7A2856]">
              12 DARES. <span className="text-[#C4276A]">ENDLESS GLORY.</span>
            </h2>
            <p className="text-sm md:text-base text-[#543245] max-w-xl mx-auto font-medium">
              Collect stamps on your physical Anniversary Passport to win free shots and unlock entry into the 2nd Anniversary Grand Prize Draw!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {PASSPORT_CHALLENGES.map((challenge, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white border border-[#7A2856]/15 hover:border-[#7A2856]/50 transition-all flex flex-col items-center text-center space-y-2 shadow-sm group"
              >
                <span className="text-3xl mb-1 group-hover:scale-125 transition-transform duration-300">
                  {challenge.icon}
                </span>
                <h4 className="font-heading text-lg md:text-xl text-[#7A2856] tracking-wide uppercase">
                  {challenge.title}
                </h4>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C4276A]">
                  {challenge.points}
                </span>
              </div>
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

            {/* Offer 2: Flash Happy Hours */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl bg-white border border-[#7A2856]/20 shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#C4276A] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                  ⚡
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-[3px] text-[#C4276A]">
                  HOURLY FLASH DEALS
                </span>
                <h3 className="font-heading text-3xl md:text-4xl tracking-wide uppercase text-[#7A2856]">
                  FLASH HAPPY HOURS
                </h3>
                <p className="text-xs md:text-sm text-[#543245] leading-relaxed font-medium">
                  Every single hour from 12:00 PM till late, the siren sounds: for quick flash windows, selected beers and shots are slashed in price!
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#7A2856]/15">
                <span className="text-xs font-bold text-[#7A2856] uppercase tracking-wider block">
                  ★ Slashes Prices Every Hour on the Hour
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
            Join the official Lay Day Uluwatu 2nd Anniversary guestlist now to lock your spot, claim your free welcome house shot upon arrival, and unlock physical Wheel of Regret spin tokens.
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
              href="https://www.instagram.com/laydayuluwatu/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/90 hover:text-[#E5AB3A] transition-colors"
            >
              <FaInstagram className="w-4 h-4" /> @laydayuluwatu
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
