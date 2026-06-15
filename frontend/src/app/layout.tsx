import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/navbar.component';

export const metadata: Metadata = {
  title: 'Vansh Soni — Portfolio',
  description: 'Full-stack developer portfolio — Projects, Blog, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
