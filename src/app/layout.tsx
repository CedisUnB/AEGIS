import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Security App",
  description: "Plataforma de apoio ao aprendizado sobre segurança de software",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stored = (await cookies()).get("theme")?.value;
  // allowlist: qualquer valor diferente de light/dark é ignorado
  const theme = stored === "light" || stored === "dark" ? stored : undefined;

  return (
    <html lang="pt-BR" data-theme={theme} className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}