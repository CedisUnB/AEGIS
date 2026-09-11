import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Security App",
  description: "Plataforma de apoio ao aprendizado sobre segurança de software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}