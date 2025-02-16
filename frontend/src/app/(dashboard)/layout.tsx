import type React from "react";
import Navbar from "@/components/navbar";
import NeuralBackgroundLayout from "@/components/NeuralBackgroundLayout";

export const metadata = {
  title: "My App",
  description: "An app with a custom navbar",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NeuralBackgroundLayout>
      <Navbar />
      <main>{children}</main>
    </NeuralBackgroundLayout>
  );
}
