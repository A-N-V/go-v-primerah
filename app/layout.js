import { Unbounded, Golos_Text, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], weight: ["500", "700"], variable: "--f-unbounded" });
const golos = Golos_Text({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], variable: "--f-golos" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], weight: ["400", "600"], variable: "--f-mono" });

export const metadata = {
  title: { default: "Go в примерах", template: "%s — Go в примерах" },
  description: "Go на 85 коротких рабочих программах с пояснениями на русском.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbf8" },
    { media: "(prefers-color-scheme: dark)", color: "#101517" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ru"
      className={`${unbounded.variable} ${golos.variable} ${mono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: расширения (ColorZilla, Grammarly и т.п.) дописывают атрибуты в <body> */}
      <body className="min-h-dvh" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <SiteHeader />
            <main className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 sm:pt-12">{children}</main>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
