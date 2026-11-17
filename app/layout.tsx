import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: { default: "Groundwork: AI for grades 9-12", template: "%s | Groundwork" },
  description:
    "Five interactive units on how AI works, for high school students. Run each model in the browser, then check your understanding.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link href="/" className="brand">
              Groundwork <small>AI course, grades 9-12</small>
            </Link>
            <SiteNav />
          </div>
        </header>
        <main>
          <div className="wrap">{children}</div>
        </main>
        <footer className="site-footer">
          <div className="wrap">
            <span>Progress is saved in this browser only. No account, no tracking.</span>
            <span>
              <Link href="/sources">Sources and credits</Link>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
