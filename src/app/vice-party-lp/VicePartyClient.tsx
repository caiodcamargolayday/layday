"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const HERO_IMAGES = [
  "/vice_party_pictures/LDU-Vice Pool Party-IGF-GLANDO.jpg",
  "/vice_party_pictures/LDU-Vice Pool Party-IGF-Jaka.jpg"
];

const ASSETS = {
  hero: "/vice_party_pictures/Lay Day Vice-Newsletter.png",
  images: [
    "/vice_party_pictures/01.jpeg",
    "/vice_party_pictures/02.jpeg",
    "/vice_party_pictures/03.jpeg",
    "/vice_party_pictures/04.jpeg",
    "/vice_party_pictures/05.jpeg",
    "/vice_party_pictures/06.jpeg",
    "/vice_party_pictures/07.jpeg",
    "/vice_party_pictures/08.jpeg",
    "/vice_party_pictures/09.jpeg",
    "/vice_party_pictures/10.jpeg",
    "/vice_party_pictures/11.jpeg",
    "/vice_party_pictures/12.jpeg",
    "/vice_party_pictures/13.jpeg",
  ]
};

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full max-w-[300px] sm:max-w-[340px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden group border-[2px] md:border-[4px] border-[#E72C7F]/40 shadow-[0_0_30px_rgba(255,20,147,0.2)] bg-black">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 cursor-pointer ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
        onClick={togglePlay}
      >
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#E72C7F]/90 flex items-center justify-center shadow-[0_0_25px_rgba(255,20,147,0.8)] transform transition-transform hover:scale-110">
          {isPlaying ? (
            <Pause className="w-8 h-8 md:w-10 md:h-10 text-white ml-0" fill="currentColor" />
          ) : (
            <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1 md:ml-2" fill="currentColor" />
          )}
        </div>
      </div>
    </div>
  );
};

export function VicePartyClient() {
  const containerRef = useRef(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        people: formData.get("people") as string,
      };

      // 1. Submit to Google Sheets (Apps Script)
      const sheetUrl = process.env.NEXT_PUBLIC_VICE_PARTY_SHEETS_URL;
      if (sheetUrl) {
        await fetch(sheetUrl, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "text/plain;charset=utf-8", // text/plain prevents CORS preflight issues with some Apps Script setups
          },
        });
      }

      // 2. Submit to Meta CAPI
      await fetch('/api/meta-capi/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: 'vice',
          eventSourceUrl: window.location.href,
          email: data.email,
          phone: data.phone,
          firstName: data.name.split(' ')[0],
          lastName: data.name.split(' ').slice(1).join(' ') || undefined,
        })
      });

      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const ribbonX = useTransform(scrollYProgress, [0, 1], [0, -2500]);

  const scrollGallery = (dir: 'left' | 'right') => {
    const newIdx = dir === 'right'
      ? (currentImg + 1) % ASSETS.images.length
      : (currentImg - 1 + ASSETS.images.length) % ASSETS.images.length;
    setCurrentImg(newIdx);
  };

  return (
    <div ref={containerRef} className="bg-[#0a0a0a] text-white font-sans selection:bg-[#E72C7F] selection:text-white overflow-x-hidden min-h-screen">
      {/* 1. Hero */}
      <section className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] flex flex-col items-center justify-center pt-10 pb-16 md:pb-24 px-4">
        
        <div className="relative z-10 w-full max-w-sm md:max-w-md mx-auto aspect-[4/5] mb-8 overflow-hidden rounded-lg shadow-[0_0_30px_rgba(231,44,127,0.2)] border border-[#E72C7F]/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <Image
                src={HERO_IMAGES[heroIndex]}
                alt="Vice Party Hero"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-20 w-full flex flex-col items-center gap-4 md:gap-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="w-full flex flex-col items-center gap-4 md:gap-6"
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-heading text-white tracking-widest leading-none drop-shadow-[0_0_15px_rgba(255,20,147,0.5)]">
              VICE <span className="text-[#E72C7F]">PARTY</span>
            </h1>
            <p className="text-lg md:text-xl font-bold text-white tracking-[2px] md:tracking-[4px] uppercase mt-2 mb-4">
              Get <span className="text-[#E72C7F]">2 Free Drinks</span> when you join the guest list
            </p>
            <Dialog onOpenChange={(open) => { if (!open) setIsSuccess(false); }}>
              <DialogTrigger render={
                <Button className="bg-[#E72C7F] text-white hover:bg-white hover:text-[#E72C7F] rounded-none h-14 md:h-16 px-8 md:px-16 font-bold uppercase tracking-[4px] text-sm md:text-base transition-all duration-500 shadow-[0_0_30px_rgba(255,20,147,0.6)] hover:scale-105" />
              }>
                ENTRY IN THE GUEST LIST
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[#111] border-[#E72C7F]/30 text-white rounded-none">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-heading tracking-widest text-[#E72C7F] uppercase">
                    {isSuccess ? "You're on the list!" : "Guest List"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {isSuccess ? "Thank you for registering." : "Register your details below to join the Vice Party guest list."}
                  </DialogDescription>
                </DialogHeader>
                {isSuccess ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                    <p className="text-white text-lg">Your details have been received.</p>
                    <p className="text-white/80">
                      Follow <a href="https://www.instagram.com/laydayuluwatu/" target="_blank" rel="noopener noreferrer" className="text-[#E72C7F] underline hover:text-white transition-colors">@laydayuluwatu</a> on Instagram to stay updated!
                    </p>
                  </div>
                ) : (
                  <form className="grid gap-4 py-4" onSubmit={handleBooking}>
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-white/80 uppercase tracking-widest text-xs">Name</Label>
                      <Input id="name" name="name" required className="bg-white/5 border-[#E72C7F]/30 text-white placeholder:text-white/30 focus-visible:ring-[#E72C7F] rounded-none h-12" placeholder="John Doe" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone" className="text-white/80 uppercase tracking-widest text-xs">Phone</Label>
                      <Input id="phone" name="phone" type="tel" required className="bg-white/5 border-[#E72C7F]/30 text-white placeholder:text-white/30 focus-visible:ring-[#E72C7F] rounded-none h-12" placeholder="+62..." />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-white/80 uppercase tracking-widest text-xs">Email</Label>
                      <Input id="email" name="email" type="email" required className="bg-white/5 border-[#E72C7F]/30 text-white placeholder:text-white/30 focus-visible:ring-[#E72C7F] rounded-none h-12" placeholder="john@example.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="people" className="text-white/80 uppercase tracking-widest text-xs">How many people?</Label>
                      <Input id="people" name="people" type="number" min="1" required className="bg-white/5 border-[#E72C7F]/30 text-white placeholder:text-white/30 focus-visible:ring-[#E72C7F] rounded-none h-12" defaultValue="1" />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full bg-[#E72C7F] text-white hover:bg-white hover:text-[#E72C7F] rounded-none h-12 font-bold uppercase tracking-[4px] mt-2 transition-all duration-300 shadow-[0_0_20px_rgba(255,20,147,0.4)] disabled:opacity-50">
                      {isLoading ? "Registering..." : "Register Now"}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </section>

      {/* 1.5 Video Section */}
      <section className="py-16 md:py-28 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-heading tracking-widest uppercase text-white/90">WATCH THE <span className="text-[#E72C7F]">MADNESS</span></h2>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-10 md:gap-16">
            <VideoPlayer src="/vice_party_pictures/LDU-Vice Pool Party-Motion (GLANDO).mp4" />
            <VideoPlayer src="/vice_party_pictures/LDU-Vice Pool Party-Motion (JAKA).mp4" />
          </div>
        </div>
      </section>

      {/* 2. Ribbon */}
      <div className="py-8 md:py-16 overflow-hidden bg-white/5 border-y border-[#E72C7F]/20">
        <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-heading tracking-widest uppercase text-white/90">FEEL THE <span className="text-[#E72C7F]">VIBE</span></h2>
        </div>
        <motion.div
          style={{ x: ribbonX }}
          className="flex gap-4 md:gap-6 whitespace-nowrap pt-4"
        >
          {[...ASSETS.images, ...ASSETS.images, ...ASSETS.images].map((img, i) => (
            <div key={i} className="relative w-[260px] md:w-[400px] aspect-[4/5] md:aspect-video flex-shrink-0 grayscale-[0.2] hover:grayscale-0 transition-all duration-700 overflow-hidden border border-[#E72C7F]/20 rounded-sm">
              <Image src={img} alt="Vibe" fill className="object-cover" sizes="(max-width: 768px) 80vw, 40vw" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        {/* 3. Interactive Gallery */}
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-heading tracking-widest uppercase text-white/90">PARTY <span className="text-[#E72C7F]">GALLERY</span></h2>
          </div>
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-[4/5] md:aspect-[21/9] overflow-hidden border-[2px] md:border-[4px] border-[#E72C7F]/50 shadow-[0_0_30px_rgba(255,20,147,0.15)] bg-[#111] rounded-sm group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImg}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={ASSETS.images[currentImg]}
                    alt="Party"
                    fill
                    className="object-cover md:object-contain"
                    sizes="100vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Side preview strips - Hidden on mobile */}
              <div className="hidden md:block absolute left-0 top-0 w-[15%] h-full z-10 overflow-hidden opacity-20 hover:opacity-80 transition-opacity cursor-pointer border-r border-[#E72C7F]/30 bg-black/50" onClick={() => scrollGallery('left')}>
                <Image
                  src={ASSETS.images[(currentImg - 1 + ASSETS.images.length) % ASSETS.images.length]}
                  alt="prev"
                  fill
                  className="object-cover blur-sm hover:blur-none transition-all duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <ChevronLeft className="w-12 h-12 text-white drop-shadow-md" />
                </div>
              </div>
              <div className="hidden md:block absolute right-0 top-0 w-[15%] h-full z-10 overflow-hidden opacity-20 hover:opacity-80 transition-opacity cursor-pointer border-l border-[#E72C7F]/30 bg-black/50" onClick={() => scrollGallery('right')}>
                <Image
                  src={ASSETS.images[(currentImg + 1) % ASSETS.images.length]}
                  alt="next"
                  fill
                  className="object-cover blur-sm hover:blur-none transition-all duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <ChevronRight className="w-12 h-12 text-white drop-shadow-md" />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 md:gap-8 mt-8">
              <button
                onClick={() => scrollGallery('left')}
                className="w-12 h-12 rounded-full border-2 border-[#E72C7F] text-[#E72C7F] flex items-center justify-center hover:bg-[#E72C7F] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex gap-2 flex-wrap justify-center max-w-[60vw]">
                {ASSETS.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === currentImg ? 'bg-[#E72C7F] w-8' : 'bg-white/30 w-2 hover:bg-white/50'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => scrollGallery('right')}
                className="w-12 h-12 rounded-full border-2 border-[#E72C7F] text-[#E72C7F] flex items-center justify-center hover:bg-[#E72C7F] hover:text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>

        {/* 4. Final CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[50vh] md:h-[60vh] flex items-center justify-center text-center overflow-hidden border border-[#E72C7F]/30 rounded-lg shadow-[0_0_50px_rgba(255,20,147,0.1)]"
        >
          <div className="absolute inset-0 z-0">
            <Image src={ASSETS.images[0]} alt="Vibe" fill className="object-cover grayscale brightness-[0.15]" sizes="100vw" />
          </div>
          <div className="relative z-10 px-4 space-y-8">
            <h2 className="text-4xl md:text-7xl font-heading text-white tracking-[6px] md:tracking-[12px] uppercase leading-none drop-shadow-[0_0_15px_rgba(255,20,147,0.3)]">
              JOIN THE <span className="text-[#E72C7F]">MADNESS</span>
            </h2>
            <p className="text-lg md:text-xl font-bold text-white tracking-[2px] md:tracking-[4px] uppercase mt-2 mb-4">
              Get <span className="text-[#E72C7F]">2 Free Drinks</span> when you join the guest list
            </p>
            <Dialog onOpenChange={(open) => { if (!open) setIsSuccess(false); }}>
              <DialogTrigger render={
                <Button className="bg-[#E72C7F] text-white hover:bg-white hover:text-[#E72C7F] rounded-none h-14 md:h-16 px-12 md:px-16 font-bold uppercase tracking-[4px] text-sm md:text-base transition-all duration-500 shadow-[0_0_40px_rgba(255,20,147,0.5)] hover:scale-105" />
              }>
                ENTRY IN THE GUEST LIST
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[#111] border-[#E72C7F]/30 text-white rounded-none">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-heading tracking-widest text-[#E72C7F] uppercase">
                    {isSuccess ? "You're on the list!" : "Guest List"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {isSuccess ? "Thank you for registering." : "Register your details below to join the Vice Party guest list."}
                  </DialogDescription>
                </DialogHeader>
                {isSuccess ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                    <p className="text-white text-lg">Your details have been received.</p>
                    <p className="text-white/80">
                      Follow <a href="https://www.instagram.com/laydayuluwatu/" target="_blank" rel="noopener noreferrer" className="text-[#E72C7F] underline hover:text-white transition-colors">@laydayuluwatu</a> on Instagram to stay updated!
                    </p>
                  </div>
                ) : (
                  <form className="grid gap-4 py-4" onSubmit={handleBooking}>
                    <div className="grid gap-2">
                      <Label htmlFor="name2" className="text-white/80 uppercase tracking-widest text-xs">Name</Label>
                      <Input id="name2" name="name" required className="bg-white/5 border-[#E72C7F]/30 text-white placeholder:text-white/30 focus-visible:ring-[#E72C7F] rounded-none h-12" placeholder="John Doe" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone2" className="text-white/80 uppercase tracking-widest text-xs">Phone</Label>
                      <Input id="phone2" name="phone" type="tel" required className="bg-white/5 border-[#E72C7F]/30 text-white placeholder:text-white/30 focus-visible:ring-[#E72C7F] rounded-none h-12" placeholder="+62..." />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email2" className="text-white/80 uppercase tracking-widest text-xs">Email</Label>
                      <Input id="email2" name="email" type="email" required className="bg-white/5 border-[#E72C7F]/30 text-white placeholder:text-white/30 focus-visible:ring-[#E72C7F] rounded-none h-12" placeholder="john@example.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="people2" className="text-white/80 uppercase tracking-widest text-xs">How many people?</Label>
                      <Input id="people2" name="people" type="number" min="1" required className="bg-white/5 border-[#E72C7F]/30 text-white placeholder:text-white/30 focus-visible:ring-[#E72C7F] rounded-none h-12" defaultValue="1" />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full bg-[#E72C7F] text-white hover:bg-white hover:text-[#E72C7F] rounded-none h-12 font-bold uppercase tracking-[4px] mt-2 transition-all duration-300 shadow-[0_0_20px_rgba(255,20,147,0.4)] disabled:opacity-50">
                      {isLoading ? "Registering..." : "Register Now"}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
