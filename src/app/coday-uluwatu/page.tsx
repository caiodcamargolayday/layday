"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ChevronDown, Camera, Waves, Utensils, Wifi, Map as MapIcon,
  Plane, DoorClosed, Bed, Wind, Bath, ChevronLeft, ChevronRight, X,
  Flame, Snowflake, Coffee, Laptop, GlassWater, Sparkles, Refrigerator, Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { openCloudbedsBooking } from "@/lib/tracking";

const ASSETS = {
  hero: "/coday_uluwatu/uluwatu_surfers_hero.png",
  ribbon: [
    "/coday_uluwatu/co living 1.jpg",
    "/coday_uluwatu/co living 2.jpg",
    "/coday_uluwatu/co living 3.jpg",
    "/coday_uluwatu/co living 4.jpg",
    "/coday_uluwatu/sauna 1.jpg",
    "/coday_uluwatu/sauna 2.jpg",
    "/coday_uluwatu/coday 6.jpg",
    "/coday_uluwatu/for this 5.jpg"
  ],
  masonry: [
    { src: "/coday_uluwatu/co living 1.jpg", size: "large", title: "PREMIUM COLIVING" },
    { src: "/coday_uluwatu/sauna 1.jpg", size: "small", title: "RECOVERY SAUNA" },
    { src: "/coday_uluwatu/co living 2.jpg", size: "small", title: "NOMAD LIFE" },
    { src: "/coday_uluwatu/sauna 2.jpg", size: "medium", title: "ICE PLUNGE" },
    { src: "/coday_uluwatu/co living 4.jpg", size: "small", title: "THE SANCTUARY" }
  ],
  facilitiesGallery: [
    "/coday_uluwatu/co living 3.jpg",
    "/coday_uluwatu/sauna 1.jpg",
    "/coday_uluwatu/co living 1.jpg",
    "/coday_uluwatu/sauna 2.jpg",
    "/coday_uluwatu/co living 4.jpg"
  ]
};

const FACILITIES = [
  { icon: Wifi, label: "High speed Wifi" },
  { icon: Flame, label: "Sauna" },
  { icon: Snowflake, label: "Ice bath" },
  { icon: Waves, label: "Pool" },
  { icon: Coffee, label: "Cafe" },
  { icon: Laptop, label: "Co working" },
  { icon: DoorClosed, label: "Private rooms" },
  { icon: Bath, label: "Towels" },
  { icon: GlassWater, label: "Cold welcome drink" },
  { icon: Sparkles, label: "Massage" },
  { icon: Utensils, label: "Breakfast and lunch" },
  { icon: DoorClosed, label: "Private room" },
  { icon: Bath, label: "Private bathroom" },
  { icon: Bath, label: "Shower" },
  { icon: Refrigerator, label: "Mini fridge" },
  { icon: Bed, label: "Kingsize beds" },
  { icon: Car, label: "Parking" },
  { icon: Plane, label: "Airport transfer" },
  { icon: Bath, label: "Toilet" },
  { icon: Sparkles, label: "Toiletries" },
  { icon: Wind, label: "Airconditioning" },
  { icon: Bed, label: "Linen" },
  { icon: GlassWater, label: "Complimentary bottled water" }
];

const DESTINATIONS = [
  { image: "/lay_day_uluwatu/place 5.jpeg", title: "Bingin Beach", type: "beach", description: "Just a 5-minute walk down the cliff path from CoDay. Known for its world-class reef break and laid-back sunset vibes with fresh seafood on the sand." },
  { image: "/lay_day_uluwatu/surf 1.jpeg", title: "Padang Padang Beach", type: "beach", description: "One of Bali's most famous surf beaches, featuring a beautiful sandy cove accessed through a narrow rock crevice." },
  { image: "/lay_day_uluwatu/culture.jpeg", title: "Uluwatu Temple", type: "temple", description: "An iconic 11th-century sea temple perched dramatically on a 70-meter cliff. Famous for its wild monkeys and sunset Kecak fire dance." },
  { image: "/lay_day_uluwatu/party 1.jpeg", title: "Single Fin Bali", type: "activities", description: "Perched high on the cliffs overlooking the legendary Uluwatu surf break. The go-to spot for Sunday sunset sessions and drinks." },
  { image: "/lay_day_uluwatu/place 1.jpeg", title: "Suluban Beach", type: "beach", description: "Also known as Blue Point, accessed by walking down through cave openings to reveal a hidden beach cove and professional surf breaks." },
  { image: "/lay_day_uluwatu/party 2.jpeg", title: "Savaya Bali", type: "activities", description: "An ultra-luxury clifftop dayclub suspended over the Indian Ocean, hosting international DJs and offering premium pool-side lounging." },
  { image: "/lay_day_uluwatu/place 2.jpeg", title: "Dreamland Beach", type: "beach", description: "A wide stretch of white sand perfect for sunbathing, swimming, and watching waves break along the coast." },
  { image: "/lay_day_uluwatu/sport.jpeg", title: "Ulu Cliffhouse", type: "activities", description: "A chic clifftop day club offering spectacular panoramic ocean views, a creative menu, and deep house music by the pool." }
];

const DISPLAY_DESTINATIONS = DESTINATIONS.slice(0, 6);

export default function CodayPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const containerRef = useRef(null);
  const [currentStoryImg, setCurrentStoryImg] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFacilityImg, setCurrentFacilityImg] = useState(0);

  const storyImages = [
    "/coday_uluwatu/co living 1.jpg",
    "/coday_uluwatu/sauna 1.jpg",
    "/coday_uluwatu/co living 2.jpg",
    "/coday_uluwatu/sauna 2.jpg"
  ];

  useEffect(() => {
    setHasMounted(true);
    const timer = setInterval(() => {
      setCurrentStoryImg((prev) => (prev + 1) % storyImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [storyImages.length]);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -40]);
  const ribbonX = useTransform(scrollYProgress, [0, 1], [0, -2500]);

  const scrollFacility = (dir: 'left' | 'right') => {
    const newIdx = dir === 'right'
      ? (currentFacilityImg + 1) % ASSETS.facilitiesGallery.length
      : (currentFacilityImg - 1 + ASSETS.facilitiesGallery.length) % ASSETS.facilitiesGallery.length;
    setCurrentFacilityImg(newIdx);
  };

  if (!hasMounted) return <div className="min-h-screen bg-[#EBE7E0]" />;

  return (
    <div ref={containerRef} className="bg-[#EBE7E0] text-[#004A61] font-sans selection:bg-[#EE5B2B] selection:text-white overflow-x-hidden">

      {/* 1. Hero */}
      <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image
            src={ASSETS.hero}
            alt="Coday Uluwatu Hero"
            fill
            priority
            className="object-cover scale-105 brightness-90 saturate-[0.8]"
            sizes="100vw"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/30 z-10" />

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-white font-bold tracking-[4px] uppercase text-[9px] mb-2 block drop-shadow-lg">Boutique Stays • Coworking • Wellness</span>
            <h1 className="text-5xl md:text-7xl font-heading text-white tracking-widest leading-none mb-6 drop-shadow-2xl">
              CODAY <span className="text-[#EE5B2B]">ULUWATU</span>
            </h1>
            <p className="max-w-xl mx-auto text-white/90 font-medium tracking-wide text-lg md:text-xl leading-relaxed mb-8">
              A high-performance sanctuary for digital nomads, surfers, and wellness enthusiasts.
            </p>
            <div className="flex flex-col items-center">
              <Button
                onClick={() => openCloudbedsBooking("coday")}
                className="bg-[#EE5B2B] text-white hover:bg-white hover:text-[#004A61] rounded-none h-12 px-10 font-bold uppercase tracking-[3px] text-xs transition-all duration-500 shadow-xl mb-6">
                BOOK YOUR STAY
              </Button>

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

      {/* 2. Ribbon */}
      <div className="py-4 md:py-6 overflow-hidden bg-white/5">
        <motion.div
          style={{ x: ribbonX }}
          className="flex gap-4 md:gap-6 whitespace-nowrap"
        >
          {[...ASSETS.ribbon, ...ASSETS.ribbon].map((img, i) => (
            <div key={i} className="relative w-[240px] md:w-[400px] aspect-video flex-shrink-0 grayscale-[0.3] hover:grayscale-0 transition-all duration-700 overflow-hidden">
              <Image src={img} alt="Vibe" fill className="object-cover" sizes="(max-width: 768px) 50vw, 30vw" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">

        {/* 3. Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-3 py-1 border border-[#EE5B2B]/20 rounded-full">
              <Waves className="w-3.5 h-3.5 text-[#EE5B2B]" />
              <span className="text-[10px] font-bold tracking-[2px] uppercase">Nomad Sanctuary</span>
            </div>
            <h2 className="text-2xl md:text-5xl font-heading tracking-widest leading-tight uppercase">
              A NEW STANDARD FOR <span className="text-[#EE5B2B]">MODERN NOMADS</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed font-medium opacity-70 max-w-lg uppercase tracking-tight">
              CoDay Uluwatu isn't just a place to sleep—it's a high-performance sanctuary designed for the digital generation. We've blended luxury boutique aesthetics with industrial coworking infrastructure and premium wellness recovery labs to create a space where productivity meets the raw spirit of the Balinese coast.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[4/5] relative border-[4px] md:border-[8px] border-white shadow-lg overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStoryImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <Image src={storyImages[currentStoryImg]} alt="Story" fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* 4. Our Destinations */}
        <section className="mb-16 md:mb-24">
          <div className="mb-10">
            <h2 className="text-2xl md:text-4xl font-heading tracking-widest uppercase">OUR <span className="text-[#EE5B2B]">DESTINATIONS</span></h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-lg font-medium opacity-80 mb-4 border-b border-[#004A61]/10 pb-4">Nearby Places</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {DISPLAY_DESTINATIONS.map((dest, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-24 h-24 relative flex-shrink-0 overflow-hidden border-2 border-white shadow-sm">
                      <Image src={dest.image} alt={dest.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4 className="font-heading tracking-wider uppercase text-base md:text-lg leading-tight text-[#004A61] group-hover:text-[#EE5B2B] transition-colors mb-1">{dest.title}</h4>
                      <span className="text-xs text-[#EE5B2B] lowercase font-bold tracking-widest">{dest.type}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <Button onClick={() => setIsModalOpen(true)} variant="outline" className="border-[#EE5B2B] text-[#EE5B2B] rounded-none px-8 py-4 h-auto font-bold uppercase tracking-widest text-xs hover:bg-[#EE5B2B] hover:text-white transition-colors">
                  SEE MORE
                </Button>
              </div>
            </div>

            {/* OpenStreetMap — Bingin Beach coords: -8.8145, 115.1145 */}
            <div className="relative min-h-[400px] w-full border-[4px] md:border-[8px] border-white shadow-lg overflow-hidden bg-[#A3CAE1]/20">
              <div className="absolute top-0 left-0 w-full h-[calc(100%+32px)]">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=115.1050%2C-8.8250%2C115.1250%2C-8.8050&amp;layer=mapnik&amp;marker=-8.8145%2C115.1145"
                  style={{ border: "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                ></iframe>
              </div>
              <div className="absolute bottom-0 right-0 bg-white/80 backdrop-blur-sm px-2 py-0.5 text-[10px] text-[#004A61] z-10 pointer-events-none">
                Leaflet | © OpenStreetMap contributors
              </div>
            </div>
          </div>
        </section>

        {/* 5. Facilities + Amenities */}
        <section className="mb-16 md:mb-24 py-12 md:py-16 border-y border-[#004A61]/10">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-heading tracking-widest uppercase">FACILITIES + <span className="text-[#EE5B2B]">AMENITIES</span></h2>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 md:gap-x-12 md:gap-y-12">
            {FACILITIES.map((fac, i) => (
              <div key={i} className="flex flex-col items-center text-center w-[80px] md:w-[100px] group">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                  <fac.icon className="w-6 h-6 md:w-8 md:h-8 text-[#004A61] stroke-[1.5]" />
                </div>
                <span className="text-[10px] md:text-xs font-medium leading-tight opacity-80">{fac.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Facilities Photo Gallery */}
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-heading tracking-widest uppercase">SEE THE <span className="text-[#EE5B2B]">VIBE</span></h2>
          </div>
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden border-[4px] md:border-[8px] border-white shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFacilityImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={ASSETS.facilitiesGallery[currentFacilityImg]}
                    alt="Facility"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Side preview strips */}
              <div className="absolute left-0 top-0 w-[12%] h-full z-10 overflow-hidden opacity-60">
                <Image
                  src={ASSETS.facilitiesGallery[(currentFacilityImg - 1 + ASSETS.facilitiesGallery.length) % ASSETS.facilitiesGallery.length]}
                  alt="prev"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute right-0 top-0 w-[12%] h-full z-10 overflow-hidden opacity-60">
                <Image
                  src={ASSETS.facilitiesGallery[(currentFacilityImg + 1) % ASSETS.facilitiesGallery.length]}
                  alt="next"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-8 mt-6">
              <button
                onClick={() => scrollFacility('left')}
                className="w-10 h-10 rounded-full border-2 border-[#EE5B2B] text-[#EE5B2B] flex items-center justify-center hover:bg-[#EE5B2B] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {ASSETS.facilitiesGallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentFacilityImg(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === currentFacilityImg ? 'bg-[#EE5B2B] w-6' : 'bg-[#004A61]/30 w-2'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => scrollFacility('right')}
                className="w-10 h-10 rounded-full border-2 border-[#EE5B2B] text-[#EE5B2B] flex items-center justify-center hover:bg-[#EE5B2B] hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* 7. Gallery */}
        <section className="mb-12 md:mb-20">
          <div className="text-center mb-8">
            <Camera className="w-5 h-5 text-[#EE5B2B] mx-auto mb-4" />
            <h2 className="text-xl md:text-4xl font-heading tracking-widest uppercase">THE <span className="text-[#EE5B2B]">UNFILTERED</span> GALLERY</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            {ASSETS.masonry.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative overflow-hidden group ${
                  item.size === 'large' ? 'md:col-span-8 md:row-span-2 aspect-[16/10]' :
                  item.size === 'medium' ? 'md:col-span-6 aspect-square' :
                  'md:col-span-4 aspect-[4/5]'
                }`}
              >
                <Image src={item.src} alt={item.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 30vw" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-4 text-center">
                  <h4 className="text-white font-heading text-lg tracking-widest">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 8. Final CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[40vh] md:h-[50vh] flex items-center justify-center text-center overflow-hidden border-2 border-[#004A61] shadow-2xl"
        >
          <div className="absolute inset-0 z-0">
            <Image src="/coday_uluwatu/for this 5.jpg" alt="Vibe" fill className="object-cover grayscale brightness-50" sizes="100vw" />
          </div>
          <div className="relative z-10 px-4 space-y-4">
            <h2 className="text-3xl md:text-6xl font-heading text-white tracking-[6px] md:tracking-[12px] uppercase leading-none">
              LIVE THE <span className="text-[#EE5B2B]">VIBE</span>
            </h2>
            <Button
              onClick={() => openCloudbedsBooking("coday")}
              className="bg-[#EE5B2B] text-white hover:bg-white hover:text-[#004A61] rounded-none h-12 px-12 font-bold uppercase tracking-[4px] text-[10px] transition-all duration-500">
              BOOK NOW
            </Button>
          </div>
        </motion.section>

      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#EBE7E0] w-full max-w-4xl max-h-full overflow-y-auto shadow-2xl flex flex-col custom-scrollbar"
            >
              <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,74,97,0.4); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #EE5B2B; }
              `}</style>
              <div className="sticky top-0 bg-[#EBE7E0] z-10 p-6 flex justify-between items-center border-b border-[#004A61]/10">
                <h2 className="text-xl font-heading tracking-widest uppercase text-[#004A61]">MORE PLACES TO VISIT</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-[#004A61] hover:text-[#EE5B2B] transition-colors">
                  <X className="w-8 h-8" />
                </button>
              </div>
              <div className="p-6 md:p-10 space-y-10">
                {DESTINATIONS.map((dest, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <div className="w-full sm:w-[280px] aspect-[16/10] relative flex-shrink-0">
                      <Image src={dest.image} alt={dest.title} fill className="object-cover shadow-sm border-2 border-white" />
                    </div>
                    <div>
                      <span className="text-[#EE5B2B] lowercase font-bold tracking-widest text-[10px] mb-2 block">{dest.type}</span>
                      <h3 className="text-2xl md:text-3xl font-heading tracking-widest text-[#004A61] uppercase leading-tight mb-3">{dest.title}</h3>
                      <p className="text-sm opacity-70 font-medium">{dest.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
