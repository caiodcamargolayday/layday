"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Users, Music, ShieldCheck, ChevronDown, 
  Utensils, Coffee, Waves, Wifi, Dumbbell, Map as MapIcon, Umbrella, Languages, Luggage, Beer, DoorClosed, Wind, Plug, Lock, Lightbulb, PartyPopper, Bath, Bed, LockKeyhole, MapPin, ChevronLeft, ChevronRight, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { openCloudbedsBooking } from "@/lib/tracking";

const ASSETS = {
  hero: "/layday_gilit/hero_gilit_oficial.jpeg",
  pool: "/layday_gilit/layday_gilit_picture 2.jpg",
  social: "/layday_gilit/layday_gilit_picture 3.jpg",
  rooms: "/layday_gilit/layday_gilit_picture 4.jpg",
  vibes: "/layday_gilit/layday_gilit_picture 5.jpg"
};

const FEATURES = [
  { icon: Music, title: "ISLAND VIBES", text: "Gili T energy." },
  { icon: Users, title: "SOCIAL HUB", text: "Meet the global tribe." },
  { icon: ShieldCheck, title: "CLEAN & SAFE", text: "Professional hospitality." }
];

const FACILITIES = [
  { icon: Utensils, label: "Restaurant" },
  { icon: Coffee, label: "Coffee Shop" },
  { icon: Waves, label: "Swimming Pool" },
  { icon: Wifi, label: "Wifi Area" },
  { icon: Dumbbell, label: "Gym/Fitness Center" },
  { icon: MapIcon, label: "Outdoor Activity" },
  { icon: Umbrella, label: "Beachfront" },
  { icon: Languages, label: "Multilingual Staff" },
  { icon: Luggage, label: "Luggage Storage" },
  { icon: MapIcon, label: "Tours & Activities" },
  { icon: Umbrella, label: "Private Beachfront" },
  { icon: Wifi, label: "Free WiFi" },
  { icon: Beer, label: "Bar" },
  { icon: DoorClosed, label: "Private Rooms" },
  { icon: Bed, label: "Shared Dorm Rooms" },
  { icon: Wind, label: "Air Conditioning" },
  { icon: Plug, label: "Personal International Power Sockets" },
  { icon: Lock, label: "Individual Lockers" },
  { icon: Lightbulb, label: "Bed Lights" },
  { icon: PartyPopper, label: "Nightly Events" },
  { icon: Bath, label: "Towels" },
  { icon: Bed, label: "Capsule Beds" },
  { icon: Beer, label: "Poolside Bar" },
  { icon: Beer, label: "Beer Pong Tables" },
  { icon: Waves, label: "Pool Toys" },
  { icon: LockKeyhole, label: "Padlock Rental" },
  { icon: Waves, label: "Surf Lesson" }
];

const ROOMS = [
  {
    image: "/layday_gilit/room_160k.jpeg",
    title: "STANDARD 1 BED MIXED DORM",
    price: "IDR 160,000",
    details: "Sleeps 1 | Single Bed | Ensuite Bathroom",
    cloudbedsId: "672818" // Standard Mixed Dorm
  },
  {
    image: "/layday_gilit/room_200k.jpeg",
    title: "STANDARD 2 BED MIXED DORM",
    price: "IDR 200,000",
    details: "Sleeps 1 | Single Bed | Ensuite Bathroom",
    cloudbedsId: "672820" // Deluxe Mixed Dorm
  },
  {
    image: "/layday_gilit/room_800k.jpeg",
    title: "PRIVATE ROOM",
    price: "IDR 800,000",
    details: "Sleeps 2 | Double Bed | Ensuite Bathroom",
    cloudbedsId: "672822" // Superior Private Room
  },
  {
    image: "/layday_gilit/room_900k.jpeg",
    title: "PREMIUM PRIVATE ROOM",
    price: "IDR 900,000",
    details: "Sleeps 2 | Double Bed | Ensuite Bathroom",
    cloudbedsId: "672821" // Private Rooms Deluxe Ocean view
  }
];

const DESTINATIONS = [
  { image: "/lay_day_gilit/Trawangan_Night_Market.jpeg", title: "Trawangan Night Market", type: "attraction" },
  { image: "/lay_day_gilit/Malibu_Island_Padel.jpeg", title: "Malibu Island Padel", type: "activities" },
  { image: "/lay_day_gilit/Bongkas_Surf_Spot.jpeg", title: "Bongkas Surf Spot", type: "activities" },
  { image: "/lay_day_gilit/Turtle_Point_Snorkelling.jpeg", title: "Turtle Point Snorkelling", type: "beach" },
  { image: "/lay_day_gilit/Horse_Riding.jpeg", title: "Horse Riding", type: "activities" },
  { image: "/lay_day_gilit/Gili_Meno_Island.jpeg", title: "Gili Meno Island", type: "monument" }
];

export function GiliTClient() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);

  const handleBooking = () => {
    openCloudbedsBooking("gilit");
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -40]);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 700;
      carouselRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (!hasMounted) return <div className="min-h-screen bg-[#EBE7E0]" />;

  return (
    <div ref={containerRef} className="bg-[#EBE7E0] text-[#004A61] font-sans selection:bg-[#EE5B2B] selection:text-white">
      
      {/* 1. Hero */}
      <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image 
            src={ASSETS.hero} 
            alt="Gili T Hero" 
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
            <span className="text-white font-bold tracking-[4px] uppercase text-[9px] mb-2 block drop-shadow-lg">Island Sanctuary • Gili T</span>
            <h1 className="text-5xl md:text-7xl font-heading text-white tracking-widest leading-none mb-6 drop-shadow-2xl">
              LAY DAY <span className="text-[#EE5B2B]">GILI T</span>
            </h1>
            <p className="max-w-xl mx-auto text-white/90 font-medium tracking-wide text-lg md:text-xl leading-relaxed">
              Experience the legendary island life. Pure vibes and the best pool parties in Gili Trawangan.
            </p>
            <div className="mt-10 md:mt-12 flex flex-col items-center">
              <Button 
                onClick={handleBooking}
                className="bg-[#EE5B2B] text-white hover:bg-white hover:text-[#004A61] rounded-none h-12 px-10 font-bold uppercase tracking-[3px] text-xs transition-all duration-300 shadow-xl mb-12">
                BOOK NOW
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

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        
        {/* 2. Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center mb-12 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-10"
          >
            <h2 className="text-2xl md:text-5xl font-heading tracking-widest leading-tight uppercase">
              THE <span className="text-[#EE5B2B]">UNFILTERED</span> GILI LIFE
            </h2>
            <p className="text-sm md:text-base leading-relaxed font-medium opacity-70 uppercase tracking-tight">
              Welcome to the island that never sleeps. Our Gili Trawangan location is a sanctuary for the social traveler.
            </p>
            <div className="flex gap-4 pt-2">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <f.icon className="w-4 h-4 text-[#EE5B2B] mb-1" />
                  <h4 className="text-[7px] font-bold tracking-widest uppercase">{f.title}</h4>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square border-[4px] md:border-[8px] border-white shadow-lg overflow-hidden"
          >
            <Image src={ASSETS.pool} alt="Pool" fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
          </motion.div>
        </div>

        {/* 3. Destinations */}
        <section className="mb-16 md:mb-24">
          <div className="mb-10">
            <h2 className="text-2xl md:text-4xl font-heading tracking-widest uppercase">OUR <span className="text-[#EE5B2B]">DESTINATIONS</span></h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-lg font-medium opacity-80 mb-4 border-b border-[#004A61]/10 pb-4">Nearby Places</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {DESTINATIONS.map((dest, i) => (
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
            <div className="relative min-h-[400px] w-full border-[4px] md:border-[8px] border-white shadow-lg overflow-hidden bg-[#A3CAE1]/20">
               {/* Extend iframe height slightly to hide the default localized OSM footer */}
               <div className="absolute top-0 left-0 w-full h-[calc(100%+32px)]">
                 <iframe 
                   width="100%" 
                   height="100%" 
                   frameBorder="0" 
                   scrolling="no" 
                   marginHeight={0} 
                   marginWidth={0} 
                   src="https://www.openstreetmap.org/export/embed.html?bbox=116.0200%2C-8.3650%2C116.0550%2C-8.3400&amp;layer=mapnik&amp;marker=-8.3508%2C116.0383" 
                   style={{ border: "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                 ></iframe>
               </div>
               {/* Custom English Attribution overlay to perfectly match Leaflet */}
               <div className="absolute bottom-0 right-0 bg-white/80 backdrop-blur-sm px-2 py-0.5 text-[10px] text-[#004A61] z-10 pointer-events-none">
                 Leaflet | © OpenStreetMap contributors
               </div>
            </div>
          </div>
        </section>

        {/* 4. Facilities */}
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

        {/* 5. Accommodation Options */}
        <section className="mb-16 md:mb-24 relative">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-heading tracking-widest uppercase">ACCOMMODATION <span className="text-[#EE5B2B]">OPTIONS</span></h2>
          </div>
          
          <div className="relative">
            <div ref={carouselRef} className="flex overflow-x-auto gap-6 md:gap-10 pb-10 snap-x snap-mandatory no-scrollbar scroll-smooth">
              {ROOMS.map((room, i) => (
                <div key={i} className="snap-center shrink-0 w-[85vw] md:w-[800px] bg-white flex flex-col md:flex-row shadow-xl border-[4px] md:border-[8px] border-white">
                  <div className="relative w-full md:w-1/2 h-[300px] md:h-[450px]">
                    <Image src={room.image} alt={room.title} fill className="object-cover" />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center w-full md:w-1/2">
                    <h3 className="text-xl md:text-2xl font-heading tracking-widest text-[#004A61] mb-2 uppercase">{room.title}</h3>
                    <p className="font-bold text-[#EE5B2B] text-lg mb-6">{room.price}</p>
                    <p className="text-sm opacity-70 font-medium mb-10">{room.details}</p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                      <Button onClick={handleBooking} className="bg-[#EE5B2B] text-white hover:bg-[#004A61] rounded-none h-12 px-8 font-bold uppercase text-xs tracking-widest transition-colors w-full sm:w-auto">
                        BOOK NOW
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel Arrows */}
            <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-16 -right-16 justify-between pointer-events-none">
              <button onClick={() => scrollCarousel('left')} className="pointer-events-auto text-[#EE5B2B] opacity-50 hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-12 h-12" strokeWidth={1} />
              </button>
              <button onClick={() => scrollCarousel('right')} className="pointer-events-auto text-[#EE5B2B] opacity-50 hover:opacity-100 transition-opacity">
                <ChevronRight className="w-12 h-12" strokeWidth={1} />
              </button>
            </div>
          </div>
        </section>

        {/* 6. Video */}
        <section className="mb-10 md:mb-16">
          <div className="flex flex-col items-center">
            <h2 className="text-xl md:text-3xl font-heading tracking-widest uppercase mb-6">SEE THE <span className="text-[#EE5B2B]">VIBE</span></h2>
            <div className="w-full max-w-[280px] aspect-[9/16] border-[4px] border-white shadow-xl relative overflow-hidden bg-white">
              <AnimatePresence mode="wait">
                {!isVideoPlaying ? (
                  <motion.div 
                    key="thumbnail"
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 cursor-pointer z-10"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <Image src={ASSETS.vibes} alt="Vibe" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#EE5B2B] flex items-center justify-center shadow-2xl">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/6fdKjRXdurw?autoplay=1&mute=0&loop=1&playlist=6fdKjRXdurw&controls=1&rel=0&modestbranding=1&playsinline=1`} 
                    title="Vibe" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 7. Carousel (The Tribe Scenes) */}
        <section className="mb-10 md:mb-16 overflow-hidden">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-4xl font-heading tracking-widest uppercase">THE <span className="text-[#EE5B2B]">TRIBE</span> SCENES</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-4">
            {[ASSETS.pool, ASSETS.social, ASSETS.rooms, ASSETS.vibes].map((img, i) => (
              <div key={i} className="relative min-w-[75vw] md:min-w-[350px] aspect-[4/5] border-[4px] border-white shadow-md flex-shrink-0">
                <Image src={img} alt="Scene" fill className="object-cover" sizes="(max-width: 768px) 80vw, 30vw" />
              </div>
            ))}
          </div>
        </section>

        {/* 8. CTA */}
        <section className="text-center bg-[#004A61] text-white p-6 md:p-10 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl md:text-4xl font-heading tracking-widest uppercase leading-none">
              READY FOR THE <span className="text-[#EE5B2B]">ISLAND?</span>
            </h2>
            <Button 
              onClick={handleBooking}
              className="bg-[#EE5B2B] text-white hover:bg-white hover:text-[#004A61] rounded-none h-12 px-12 font-bold uppercase tracking-[3px] text-[10px] transition-all duration-500 shadow-xl">
              BOOK NOW
            </Button>
          </div>
          <div className="absolute inset-0 z-0 opacity-10">
            <Image src={ASSETS.vibes} alt="BG" fill className="object-cover grayscale" />
          </div>
        </section>

      </div>
      
      {/* Destinations Modal */}
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
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: rgba(0, 74, 97, 0.4);
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background-color: #EE5B2B;
                }
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
                      <h3 className="text-2xl md:text-3xl font-heading tracking-widest text-[#004A61] uppercase leading-tight">{dest.title}</h3>
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
