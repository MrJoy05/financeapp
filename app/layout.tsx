import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nimbus — Finanzas personales",
  description: "Resumen financiero personal con tipo de cambio USD/MXN.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Script id="nimbus-theme-init" strategy="beforeInteractive">
          {`(function(){try{var k='nimbus.theme';var raw=localStorage.getItem(k);var sys=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=raw==='dark'||(raw!=='light'&&(!raw||raw==='system')&&sys);document.documentElement.classList.toggle('dark',!!dark)}catch(e){}})();`}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
