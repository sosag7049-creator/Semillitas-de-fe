import type { Metadata } from "next";
import "@fontsource-variable/nunito";
import "@fontsource-variable/fredoka";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  metadataBase: new URL("https://semillitasbiblicas.space"),
  title: {
    default: "Semillitas de Fe · Clases bíblicas para niños de 3 a 10 años",
    template: "%s · Semillitas de Fe",
  },
  description:
    "Lecciones, dinámicas, juegos y materiales bíblicos para maestros de niños y niñas de 3 a 10 años, basados en la Reina-Valera 1960.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Semillitas de Fe",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="flex min-h-dvh flex-col bg-cream-50 font-sans text-ink-900 antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
