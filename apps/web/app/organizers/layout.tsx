import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizers",
  description: "Discover event organizers and communities on Wordpool.",
  openGraph: {
    title: "Organizers",
    description: "Discover event organizers and communities on Wordpool.",
  },
};

export default function OrganizersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
