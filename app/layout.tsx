import Image from 'next/image';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Safe from Harm | Zakładanie kont",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <div className="navbar bg-primary flex flex-col md:flex-row md:px-24 gap-3 items-center text-center">
      <div>
        <Image
          src="/identifier-zhp-white.png"
          height={60}
          width={155}
          alt="Związek Harcerstwa Polskiego"
        />
      </div>

      <div className="text-xl font-medium">
        Safe from Harm - Zakładanie kont
      </div>

      <div className="font-light flex flex-1 justify-end">
        Zalogowano jako: Bartłomiej Mroziński (bartlomiej.mrozinski@zhp.net.pl)
      </div>
    </div>
  );
}