import fs from "fs";
import path from "path";
import { MapPin, CheckCircle2, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HotelBookingButton } from "@/components/hotel/HotelBookingButton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";

const HOSTEL_DATA = {
  "1": {
    name: "Lay Day Canggu",
    location: "Canggu, Indonesia",
    folder: "lay_day_canggu",
    description: "Welcome to Lay Day Canggu, your home away from home in the heart of Bali's most vibrant surf town. We offer the perfect mix of party, surf, and chill vibes. Expect epic pool parties, comfortable beds, and a community of like-minded travelers.",
    amenities: ["Free WiFi", "Swimming Pool", "Bar & Restaurant", "Air Conditioning", "24/7 Security", "Surf Lessons"],
    price: 15,
    rating: 4.8,
    tags: ["Party", "Surf", "Popular"],
    rooms: [
      { name: "6-Bed Mixed Dorm", price: 15, desc: "Bunk beds, A/C, lockers." },
      { name: "4-Bed Female Dorm", price: 18, desc: "A/C, ensuite bathroom." },
      { name: "Private Double", price: 45, desc: "Queen bed, private bath, A/C." }
    ],
    faqs: [
      { q: "Is breakfast included?", a: "No, but we have a cafe on site." },
      { q: "Do you offer airport pickup?", a: "Yes, for $25 per car. Contact us in advance." }
    ]
  },
  "17": {
    name: "Lay Day Uluwatu",
    location: "Uluwatu, Indonesia",
    folder: "lay_day_uluwatu",
    description: "Perched on the cliffs of Uluwatu, this hostel offers breathtaking ocean views and easy access to world-class surf breaks. Enjoy our infinity pool, daily yoga sessions, and legendary sunset parties.",
    amenities: ["Ocean View", "Infinity Pool", "Yoga Deck", "Scooter Rental", "Free WiFi"],
    price: 18,
    rating: 4.9,
    tags: ["Ocean View", "Yoga", "Chill"],
    rooms: [
      { name: "8-Bed Mixed Dorm", price: 18, desc: "A/C, privacy curtains." },
      { name: "Private Ocean View", price: 60, desc: "Balcony, Queen bed, A/C." }
    ],
    faqs: [
      { q: "How far is the beach?", a: "It's a 10-minute walk down the cliff." },
      { q: "Do you rent surfboards?", a: "Yes, we have a large selection!" }
    ]
  },
  "18": {
    name: "Lay Day Gili T",
    location: "Gili Trawangan, Indonesia",
    folder: "lay_day_gilit",
    description: "Experience the ultimate island life at Lay Day Gili T. No cars, no motorbikes, just bicycles, horse carts, and crystal clear waters. Join our famous boat parties and snorkel with turtles.",
    amenities: ["Beachfront", "Dive Center", "Barbecue Area", "Bicycle Rental", "Free Breakfast"],
    price: 12,
    rating: 4.7,
    tags: ["Island Life", "Diving", "Party"],
    rooms: [
      { name: "10-Bed Mixed Dorm", price: 12, desc: "A/C, lockers." },
      { name: "Private Bungalow", price: 40, desc: "Traditional style, A/C, ensuite." }
    ],
    faqs: [
      { q: "How do I get there?", a: "Take a fast boat from Padang Bai or Sanur in Bali." },
      { q: "Are there ATMs on the island?", a: "Yes, there are several ATMs." }
    ]
  },
  "20": {
    name: "CoDay Uluwatu",
    location: "Uluwatu, Indonesia",
    folder: "coday_uluwatu",
    description: "Coming Soon! CoDay Uluwatu is our newest addition, designed for digital nomads and remote workers who want to blend productivity with the laid-back surf lifestyle.",
    amenities: ["Coworking Space", "High-Speed Internet", "Private Pods", "Cafe", "Gym"],
    price: 25,
    rating: 5.0,
    tags: ["Coworking", "Nomads", "New"],
    rooms: [
      { name: "Work/Sleep Pod", price: 25, desc: "A/C, desk, fast WiFi." },
      { name: "Private Suite", price: 80, desc: "Full apartment style, kitchenette." }
    ],
    faqs: [
      { q: "When are you opening?", a: "We aim to open by Q3 2026." },
      { q: "What is the WiFi speed?", a: "Dedicated 100Mbps fiber line." }
    ]
  }
};

export default async function HotelPage({ params }: { params: Promise<{ id: string, slug: string }> }) {
  const resolvedParams = await params;
  const data = HOSTEL_DATA[resolvedParams.id as keyof typeof HOSTEL_DATA];

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center pt-20">
        <h1 className="text-2xl font-bold font-heading text-[#083248]">Hostel not found</h1>
      </div>
    );
  }

  let images: string[] = [];
  try {
    const publicDir = path.join(process.cwd(), "public", data.folder);
    if (fs.existsSync(publicDir)) {
      const files = fs.readdirSync(publicDir);
      images = files
        .filter(file => file.match(/\.(png|jpe?g|webp|gif)$/i))
        .map(file => encodeURI(`/${data.folder}/${file}`));
    }
  } catch (error) {
    console.error("Failed to read images directory", error);
  }

  if (images.length === 0) {
    images = [encodeURI("/logo-layday.png")];
  }

  return (
    <div className="pt-24 pb-20 bg-[#EBE6D8] min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {data.tags.map(tag => (
              <Badge key={tag} className="bg-[#083248] text-white hover:bg-[#083248]/80 uppercase tracking-widest">{tag}</Badge>
            ))}
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-heading text-[#083248] tracking-wider mb-2">{data.name}</h1>
              <div className="flex items-center text-[#EE5B2B] font-bold text-sm">
                <MapPin className="w-4 h-4 mr-1" /> {data.location}
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2 text-[#083248] font-bold">
              <Star className="w-5 h-5 fill-[#EE5B2B] text-[#EE5B2B]" />
              <span className="text-2xl">{data.rating}</span>
              <span className="text-sm font-medium">/ 5 (Reviews)</span>
            </div>
          </div>
        </div>

        {/* Gallery Carousel */}
        <div className="mb-12">
          <Carousel className="w-full">
            <CarouselContent>
              {images.slice(0, 10).map((img, i) => (
                <CarouselItem key={i}>
                  <div className="relative w-full aspect-video md:aspect-[21/9] border-4 border-[#083248] overflow-hidden">
                    <Image src={img} alt={`${data.name} image ${i}`} fill className="object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 border-2 border-[#083248] bg-white text-[#083248]" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 border-2 border-[#083248] bg-white text-[#083248]" />
            </div>
          </Carousel>
          
          {/* Thumbnails (Static fallback representation) */}
          <div className="hidden md:grid grid-cols-6 gap-2 mt-2">
            {images.slice(1, 7).map((img, i) => (
              <div key={i} className="relative aspect-video border-2 border-[#083248] cursor-pointer hover:opacity-80 transition-opacity">
                <Image src={img} alt="thumb" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12 text-[#083248]">
            
            {/* About */}
            <section>
              <h2 className="text-3xl font-heading tracking-wide mb-4">ABOUT THE HOSTEL</h2>
              <p className="font-sans leading-relaxed text-lg font-medium opacity-90">{data.description}</p>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-3xl font-heading tracking-wide mb-6">AMENITIES</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                {data.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center text-sm font-bold uppercase tracking-widest">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-[#EE5B2B]" />
                    {amenity}
                  </div>
                ))}
              </div>
            </section>

            {/* Room Types (Tabs) */}
            <section>
              <h2 className="text-3xl font-heading tracking-wide mb-6">ROOMS & PACKAGES</h2>
              <Tabs defaultValue={data.rooms[0].name} className="w-full">
                <TabsList className="bg-[#083248]/10 w-full justify-start rounded-none mb-6">
                  {data.rooms.map(room => (
                    <TabsTrigger key={room.name} value={room.name} className="font-bold uppercase tracking-widest text-xs rounded-none data-[state=active]:bg-[#083248] data-[state=active]:text-white">
                      {room.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {data.rooms.map(room => (
                  <TabsContent key={room.name} value={room.name}>
                    <div className="border-2 border-[#083248] p-6 bg-white">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-heading tracking-wide">{room.name}</h3>
                        <span className="font-bold text-lg">${room.price} / night</span>
                      </div>
                      <p className="font-medium text-sm opacity-80 mb-6">{room.desc}</p>
                      <Button className="bg-[#EE5B2B] text-white hover:bg-[#d64e22] font-bold uppercase tracking-widest w-full md:w-auto rounded-none">
                        Select Room
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-3xl font-heading tracking-wide mb-6">GUEST REVIEWS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-[#083248] p-6 bg-white relative">
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-[#083248]/10" />
                  <div className="flex text-[#EE5B2B] mb-2"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                  <p className="font-medium text-sm italic mb-4">"Best hostel experience ever! The parties are insane and the beds are surprisingly comfy. Highly recommend!"</p>
                  <p className="text-xs font-bold uppercase tracking-widest">- Sarah, UK</p>
                </div>
                <div className="border-2 border-[#083248] p-6 bg-white relative">
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-[#083248]/10" />
                  <div className="flex text-[#EE5B2B] mb-2"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                  <p className="font-medium text-sm italic mb-4">"Great vibes, met so many awesome people. The staff is super friendly and the location is perfect."</p>
                  <p className="text-xs font-bold uppercase tracking-widest">- Mark, Australia</p>
                </div>
              </div>
            </section>

            {/* FAQs (Accordion) */}
            <section>
              <h2 className="text-3xl font-heading tracking-wide mb-6">FREQUENTLY ASKED QUESTIONS</h2>

              <Accordion {...({ type: "single", collapsible: true, className: "w-full bg-white border-2 border-[#083248] px-4" } as any)}>
                {data.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="font-bold text-sm uppercase tracking-widest hover:no-underline hover:text-[#EE5B2B] text-left">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="font-medium text-sm opacity-90">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

          </div>

          {/* Booking CTA Sidebar (Desktop) */}
          <div className="hidden lg:block relative">
            <div className="sticky top-28 border-2 border-[#083248] p-6 bg-white shadow-[8px_8px_0px_0px_rgba(8,50,72,1)]">
              <h3 className="text-2xl font-heading tracking-wide mb-2 text-[#083248]">BOOK YOUR STAY</h3>
              <p className="font-bold text-2xl text-[#EE5B2B] mb-6">From ${data.price} <span className="text-sm text-[#083248]">/ night</span></p>
              
              <div className="space-y-4 mb-6">
                <div className="border-2 border-[#083248] p-3 text-sm font-bold flex justify-between cursor-pointer hover:bg-gray-50">
                  <span className="opacity-60 uppercase tracking-widest">Check-in</span>
                  <span>Select Date</span>
                </div>
                <div className="border-2 border-[#083248] p-3 text-sm font-bold flex justify-between cursor-pointer hover:bg-gray-50">
                  <span className="opacity-60 uppercase tracking-widest">Check-out</span>
                  <span>Select Date</span>
                </div>
                <div className="border-2 border-[#083248] p-3 text-sm font-bold flex justify-between cursor-pointer hover:bg-gray-50">
                  <span className="opacity-60 uppercase tracking-widest">Guests</span>
                  <span>1 Adult</span>
                </div>
              </div>

              <HotelBookingButton hotelId={resolvedParams.id} className="w-full bg-[#EE5B2B] text-white hover:bg-[#d64e22] font-bold uppercase tracking-widest py-6 rounded-none text-lg">
                Check Availability
              </HotelBookingButton>
              <p className="text-xs text-center font-bold uppercase tracking-widest opacity-60 mt-4 text-[#083248]">
                Best price guarantee direct
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-[#083248] z-50 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-60 text-[#083248]">Starting from</p>
          <p className="font-bold text-lg text-[#EE5B2B]">${data.price} <span className="text-sm text-[#083248]">/ night</span></p>
        </div>
        <HotelBookingButton hotelId={resolvedParams.id} className="bg-[#EE5B2B] text-white hover:bg-[#d64e22] font-bold uppercase tracking-widest rounded-none">
          Book Now
        </HotelBookingButton>
      </div>

    </div>
  );
}
