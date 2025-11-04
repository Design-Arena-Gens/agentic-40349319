import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GOST 19.701-90 Flowcharts',
  description: 'Function-level flowcharts per GOST 19.701-90 (ISO 5807-85)'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
