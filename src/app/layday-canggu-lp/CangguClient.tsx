"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ChevronDown, Camera, Waves, Utensils, Wifi, Map as MapIcon,
  Plane, Luggage, Users, Cigarette, Beer, DoorClosed, Bed, Wind, Plug, Lock,
  Lightbulb, PartyPopper, Bath, ChevronLeft, ChevronRight, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { openCloudbedsBooking } from "@/lib/tracking";

const ASSETS = {
  hero: "/lay_day_canggu/beach 2.jpeg",
  ribbon: [
    "/lay_day_canggu/bar 1.jpeg",
    "/lay_day_canggu/bar 2.jpeg",
    "/lay_day_canggu/bar 4.jpeg",
    "/lay_day_canggu/bar 5.jpeg",
    "/lay_day_canggu/bar 6.jpeg",
    "/lay_day_canggu/bar 7.jpeg",
    "/lay_day_canggu/meals 1.jpeg",
    "/lay_day_canggu/swimming_pools.jpeg",
    "/lay_day_canggu/beach 2.jpeg"
  ],
  masonry: [
    { src: "/lay_day_canggu/room700k.png", size: "large", title: "THE VILLA" },
    { src: "/lay_day_canggu/swimming_pools.jpeg", size: "small", title: "POOL SESSIONS" },
    { src: "/lay_day_canggu/meals 1.jpeg", size: "small", title: "ISLAND FLAVORS" },
    { src: "/lay_day_canggu/bar 7.jpeg", size: "medium", title: "SOCIAL BAR" },
    { src: "/lay_day_canggu/rooftop_cafe.jpeg", size: "small", title: "ROOFTOP CAFE" }
  ],
  facilitiesGallery: [
    "/lay_day_canggu/swimming_pools.jpeg",
    "/lay_day_canggu/bar 1.jpeg",
    "/lay_day_canggu/rooftop_cafe.jpeg",
    "/lay_day_canggu/bar 6.jpeg",
    "/lay_day_canggu/meals 1.jpeg"
  ]
};

const FACILITIES = [
  { icon: Utensils, label: "Restaurant" },
  { icon: Waves, label: "Swimming Pool" },
  { icon: Wifi, label: "Wifi Area" },
  { icon: MapIcon, label: "Outdoor Activity" },
  { icon: Plane, label: "Airport Transfer" },
  { icon: Luggage, label: "Luggage Storage" },
  { icon: Users, label: "Tours & Activities" },
  { icon: Wifi, label: "Free WiFi" },
  { icon: Cigarette, label: "Smoking Area" },
  { icon: Beer, label: "Bar" },
  { icon: DoorClosed, label: "Private Rooms" },
  { icon: Bed, label: "Shared Dorm Rooms" },
  { icon: Wind, label: "Air Conditioning" },
  { icon: Plug, label: "Personal International Power Sockets" },
  { icon: Lock, label: "Individual Lockers" },
  { icon: Lightbulb, label: "Bed Lights" },
  { icon: PartyPopper, label: "Nightly Events" },
  { icon: Bath, label: "Towels" }
];

const ROOMS = [
  {
    image: "/lay_day_canggu/room160k.jpeg",
    title: "STANDARD 6-BED MIXED DORM",
    price: "Starts from IDR 160,000",
    details: "Sleeps 1 I Single Bed I Ensuite Bathroom"
  },
  {
    image: "/lay_day_canggu/room180k.jpeg",
    title: "STANDARD 6-FEMALE BED DORM",
    price: "Starts from IDR 180,000",
    details: "Sleeps 1 I Single Bed I Ensuite Bathroom"
  },
  {
    image: "/lay_day_canggu/room200k.jpeg",
    title: "DELUXE 6-BED MIXED DORM",
    price: "Starts from IDR 200,000",
    details: "Sleeps 1 I Single Bed I Ensuite Bathroom"
  },
  {
    image: "/lay_day_canggu/room220k.jpeg",
    title: "DELUXE 4-BED MIXED DORM",
    price: "Starts from IDR 220,000",
    details: "Sleeps 1 I Single Bed I Ensuite Bathroom"
  },
  {
    image: "/lay_day_canggu/room650k.png",
    title: "PRIVATE STANDARD QUEEN ROOM",
    price: "Starts from IDR 650,000",
    details: "Sleeps 2 I Queen Bed I Ensuite Bathroom"
  },
  {
    image: "/lay_day_canggu/room700k.png",
    title: "PRIVATE SUPERIOR QUEEN BUNGALOW",
    price: "Starts from IDR 700,000",
    details: "Sleeps 2 I Queen Bed I Ensuite Bathroom I Private Balcony"
  },
  {
    image: "/lay_day_canggu/room750k.png",
    title: "PRIVATE SUPERIOR KING BUNGALOW",
    price: "Starts from IDR 750,000",
    details: "Sleeps 2 I King Sized Bed I Ensuite Bathroom I Private Balcony"
  },
  {
    image: "/lay_day_canggu/room800k.png",
    title: "PRIVATE DELUXE KING BUNGALOW",
    price: "Starts from IDR 800,000",
    details: "Sleeps 2 I King Sized Bed I Ensuite Bathroom I Private Balcony"
  }
];

const DESTINATIONS = [
  { image: "/lay_day_canggu/Sunsets at Echo Beach.jpeg", title: "Sunsets at Echo Beach", type: "beach", description: "One of Canggu's vibrant beaches, where the surf is great and sunsets are just something else!" },
  { image: "/lay_day_canggu/Surf Lessons at Batu Bolong Beach Beach.jpeg", title: "Surf Lessons at Batu Bolong", type: "beach", description: "Another one of Canggu's most popular beaches boasts several surf schools and sunsets." },
  { image: "/lay_day_canggu/Tanah Lot Temple.jpeg", title: "Tanah Lot Temple", type: "temple", description: "One of Bali's most renowned traditional balinese temples on a small rocky island overlooking the ocean." },
  { image: "/lay_day_canggu/Vault Night Club.jpeg", title: "Vault Night Club", type: "activities", description: "One of the locations Lay Day visits with their pubcrawl — Bali's biggest underground nightclub." },
  { image: "/lay_day_canggu/Metto Mondays at Luigi's.jpeg", title: "Metto Mondays at Luigi's", type: "activities", description: "One of the locations Lay Day visits with their pubcrawl — the must-go destination for the Monday party." },
  { image: "/lay_day_canggu/Nirvana Gym.jpeg", title: "Nirvana Gym", type: "activities", description: "A brand-new concept of Health, Wellness, Networking and Co-working — A Social Club, focusing on improving Lives." },
  { image: "/lay_day_canggu/La Brisa Sunday Market.jpeg", title: "La Brisa Sunday Market", type: "activities", description: "La Brisa Sunday Market EVERY SUNDAY 10:00 am - 4:00 pm at Echo Beach, Canggu." },
  { image: "/lay_day_canggu/Love Anchor.jpeg", title: "Love Anchor", type: "activities", description: "Love Anchor markets are open daily with 50+ vendors selling everything from homewares, clothing, jewelry to handmade decor." }
];

const DISPLAY_DESTINATIONS = DESTINATIONS.slice(0, 6);

export function CangguClient() {
  const [hasMounted, setHasMounted] = useState(false);
  const containerRef = useRef(null);
  const [currentStoryImg, setCurrentStoryImg] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFacilityImg, setCurrentFacilityImg] = useState(0);
  
  const handleBooking = () => {
    openCloudbedsBooking("canggu");
  };

  const storyImages = [
    "/lay_day_canggu/bar 1.jpeg",
    "/lay_day_canggu/swimming_pools.jpeg",
    "/lay_day_canggu/bar 6.jpeg",
    "/lay_day_canggu/rooftop_cafe.jpeg"
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

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 700;
      carouselRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const facilityScrollRef = useRef<HTMLDivElement>(null);
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
            alt="Canggu Hero" 
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
            <span className="text-white font-bold tracking-[4px] uppercase text-[9px] mb-2 block drop-shadow-lg">The OG Sanctuary • Canggu</span>
            <h1 className="text-5xl md:text-7xl font-heading text-white tracking-widest leading-none mb-6 drop-shadow-2xl">
              LAY DAY <span className="text-[#EE5B2B]">CANGGU</span>
            </h1>
            <p className="max-w-xl mx-auto text-white/90 font-medium tracking-wide text-lg md:text-xl leading-relaxed mb-8">
              Born from a love of surf and social chaos. Epicenter of the Batu Bolong tribe.
            </p>
            <div className="flex flex-col items-center">
              <Button 
                onClick={handleBooking}
                className="bg-[#EE5B2B] text-white hover:bg-white hover:text-[#004A61] rounded-none h-12 px-10 font-bold uppercase tracking-[3px] text-xs transition-all duration-500 shadow-xl mb-6">
                BOOK THE LEGEND
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
              <span className="text-[10px] font-bold tracking-[2px] uppercase">Surf &amp; Party</span>
            </div>
            <h2 className="text-2xl md:text-5xl font-heading tracking-widest leading-tight uppercase">
              WHERE THE <span className="text-[#EE5B2B]">STORY</span> BEGAN
            </h2>
            <p className="text-sm md:text-base leading-relaxed font-medium opacity-70 max-w-lg uppercase tracking-tight">
              Welcome to Lay Day, your ultimate Bali retreat! Nestled in the heart of Canggu, we offer 16 dorms and private rooms for the perfect night&apos;s rest. But that&apos;s just the beginning. Get ready to experience our legendary bar, multiple swimming pools, and a rooftop cafe. We keep the buzz alive with ongoing events that&apos;ll have you dancing, mingling, and making memories.
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
                  src="https://www.openstreetmap.org/export/embed.html?bbox=115.1200%2C-8.6550%2C115.1600%2C-8.6300&amp;layer=mapnik&amp;marker=-8.6425%2C115.1399" 
                  style={{ border: "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                ></iframe>
              </div>
              {/* Custom English Attribution overlay */}
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

        {/* 6. Accommodation Options */}
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

        {/* 7. Facilities Photo Gallery */}
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

            {/* Navigation Buttons */}
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
                    className={`w-2 h-2 rounded-full transition-all ${i === currentFacilityImg ? 'bg-[#EE5B2B] w-6' : 'bg-[#004A61]/30'}`}
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

        {/* 8. Gallery */}
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

        {/* 9. Final CTA */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative h-[40vh] md:h-[50vh] flex items-center justify-center text-center overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <Image src="/lay_day_canggu/bar 6.jpeg" alt="Vibe" fill className="object-cover grayscale brightness-50" sizes="100vw" />
          </div>
          <div className="relative z-10 px-4 space-y-4">
            <h2 className="text-3xl md:text-6xl font-heading text-white tracking-[6px] md:tracking-[12px] uppercase leading-none">
              LIVE THE <span className="text-[#EE5B2B]">VIBE</span>
            </h2>
            <Button 
              onClick={handleBooking}
              className="bg-[#EE5B2B] text-white hover:bg-white hover:text-[#004A61] rounded-none h-12 px-12 font-bold uppercase tracking-[4px] text-[10px] transition-all duration-500">
              BOOK NOW
            </Button>
          </div>
        </motion.section>

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
