import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PLAN B – Pathfinder Session',
  description:
    'Build your backup plan in just 1 session. Practical career guidance for UPSC aspirants. Only ₹199.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={dmSans.variable}>
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
