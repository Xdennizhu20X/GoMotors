import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontHeading = localFont({
  src: "../app/fonts/recharge-bd.ttf",
  variable: "--font-heading",
  display: "swap",
});

export const fontDisplay = localFont({
  src: "../app/fonts/TitlingGothicFBWide-Bold.otf",
  variable: "--font-display",
  display: "swap",
  weight: "400 900",
});
