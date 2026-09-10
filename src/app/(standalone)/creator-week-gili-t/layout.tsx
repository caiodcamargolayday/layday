import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gili Creator Week 🌴 | Lay Day Gili T",
  description:
    "Join a curated group of creators for a content-focused stay at Lay Day Gili T. Free dorm, food & drinks, pro photographer, organized activities — limited spots.",
  openGraph: {
    title: "Gili Creator Week 🌴 | Lay Day Gili T",
    description:
      "Think girls trip, cocktails, snorkelling, social vibes, new friends, and a full content experience — captured professionally.",
    images: ["/layday_gilit/hero_gilit_oficial.jpeg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
