import type React from "react";
import Navbar from "@/components/navbar";
import { Inter } from "next/font/google";
import NeuralBackgroundLayout from "@/components/NeuralBackgroundLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My App",
  description: "An app with a custom navbar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <NeuralBackgroundLayout>
          <Navbar />
          <main>{children}</main>
        </NeuralBackgroundLayout>
      </body>
    </html>
  );
}
