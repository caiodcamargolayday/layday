import { Metadata } from "next";
import { AnniversaryClient } from "./AnniversaryClient";

export const metadata: Metadata = {
  title: "11 Years of Lay Day | Bad Choices Make Good Stories",
  description:
    "Celebrate 11 years of Lay Day Hostel Bali. 11 Years. Countless Stories. Still sending since 2015. Hourly happy hours, Festival Passport challenges, Wheel of Regret, Live DJs, and exclusive anniversary perks.",
  openGraph: {
    title: "11 Years of Lay Day | Bad Choices Make Good Stories",
    description:
      "Celebrate 11 years of Lay Day Hostel Bali across Canggu & Gili T. Still sending since 2015.",
    images: [
      {
        url: "/anniversary_layday/LD-Anniversary-IGF.jpg",
        width: 1080,
        height: 1350,
        alt: "11 Years of Lay Day - Bad choices make good stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "11 Years of Lay Day | Bad Choices Make Good Stories",
    description:
      "Celebrate 11 years of Lay Day Hostel Bali. Still sending since 2015.",
    images: ["/anniversary_layday/LD-Anniversary-IGF.jpg"],
  },
};

export default function Page() {
  return <AnniversaryClient />;
}
