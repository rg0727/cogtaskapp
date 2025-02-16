"use client";
import type React from "react";
// import type { Metadata } from "next";
import { NeuralInterface } from "@/components/NeuralInterface";
import { CognitiveMetrics } from "@/components/CognitiveMetrics";
import { NeuralChallenge } from "@/components/NeuralChallenge";
import { usePathname } from "next/navigation";

// export const metadata: Metadata = {
//   title: "NeuroPeak: Cognitive Enhancement Game",
//   description: "A cutting-edge game to boost and monitor cognitive performance",
// };

const excludedRoutes = ["/activity/game/game1", "/activity/game/game2"];

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (excludedRoutes.includes(pathname)) {
    return <>{children}</>;
  }
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow flex items-stretch p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="w-full max-w-7xl mx-auto flex flex-col">
          <div className="bg-card rounded-lg shadow-2xl overflow-hidden flex-grow flex flex-col">
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex">
                <h2 className="text-2xl font-bold mb-4 text-card-foreground">
                  Neural Interface
                </h2>
                {children}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-grow">
                <div className="flex flex-col">
                  <NeuralInterface />
                </div>
                <div className="space-y-8 flex flex-col justify-between">
                  <CognitiveMetrics />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
