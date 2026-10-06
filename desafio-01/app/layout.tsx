import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CheckSpeech AI | Fala que vira clareza",
  description: "APIs de transcrição, fala em tempo real, identificação de idiomas e análise de sentimento.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
