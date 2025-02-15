import type React from "react";
import Navbar from "@/components/navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard - My App",
  description: "Dashboard section of My App",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
