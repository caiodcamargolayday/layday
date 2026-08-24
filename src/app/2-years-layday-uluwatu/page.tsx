import { Metadata } from "next";
import { AnniversaryUluwatuClient } from "./AnniversaryUluwatuClient";

export const metadata: Metadata = {
  title: "2 Years of Lay Day Uluwatu | Bad Choices Make Good Stories",
  description:
    "Celebrate 2 years of Lay Day Hostel Uluwatu. 2 Years. Countless Stories. Still sending since 2024. Hourly flash happy hours, Festival Passport dares, Wheel of Regret, live DJs, and free welcome shot on RSVP.",
  openGraph: {
    title: "2 Years of Lay Day Uluwatu | Bad Choices Make Good Stories",
    description:
      "Celebrate 2 years of Lay Day Hostel Uluwatu. 04.09.26 • Save The Date. Bad choices make good stories.",
    images: [
      {
        url: "/anniversary_layday_uluwatu/IMG_7040.JPEG",
        width: 1080,
        height: 1920,
        alt: "2 Years of Lay Day Uluwatu - Bad choices make good stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2 Years of Lay Day Uluwatu | Bad Choices Make Good Stories",
    description:
      "Celebrate 2 years of Lay Day Hostel Uluwatu. Still sending since 2024. 04.09.26.",
    images: ["/anniversary_layday_uluwatu/IMG_7040.JPEG"],
  },
};

export default function Page() {
  return <AnniversaryUluwatuClient />;
}
