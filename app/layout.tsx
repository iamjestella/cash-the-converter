import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cash the Converter™ | AI Content Engine",
  description: "AI-powered marketing content generator for iBuildSkills.com and The Ink Riot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
