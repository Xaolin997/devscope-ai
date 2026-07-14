import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevScope",
  description: "Gestão inteligente de projetos de software"
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}