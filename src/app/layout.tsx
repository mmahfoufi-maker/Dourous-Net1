import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dourous-Net 📚 — Extranet Éducatif Algérien',
  description: 'Plateforme d\'accès aux ressources éducatives et de réservation de séances avec les professeurs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
