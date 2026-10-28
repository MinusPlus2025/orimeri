import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elsewhere — a taste instrument",
  description:
    "Your taste stays the same. Your intent changes. A cultural place-discovery instrument for Tokyo, powered by Qloo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
