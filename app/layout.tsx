import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Providers from "./providers";
import ProgressBar from "./components/ProgressBar";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "eGharBari - Find Your Dream Property in Nepal",
  description: "Your trusted partner in finding the perfect property in Nepal. Discover homes, apartments, land, and commercial spaces across Nepal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} antialiased`}
      >
        <Providers>
          <ProgressBar />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
