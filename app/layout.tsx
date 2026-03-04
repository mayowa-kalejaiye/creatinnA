import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreatINN Academy | Physical Creative Institution in Lagos",
  description: "A capacity-building creative academy in Lagos that moves people from learning to earning to positioning. Physical campus with in-person training and online options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
