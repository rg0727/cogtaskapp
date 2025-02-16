"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";

export default function BrainNeuralNetwork() {
  const [neurons, setNeurons] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [connections, setConnections] = useState<
    {
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      opacity: number;
    }[]
  >([]);

  useEffect(() => {
    const generatedNeurons = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 160 - 80,
    }));

    const generatedConnections = generatedNeurons.flatMap((neuron, i) =>
      generatedNeurons
        .slice(i + 1)
        .filter(() => Math.random() > 0.7)
        .map((otherNeuron, j) => ({
          id: `${i}-${j}`,
          x1: neuron.x,
          y1: neuron.y,
          x2: otherNeuron.x,
          y2: otherNeuron.y,
          opacity: Math.random() * 0.2 + 0.1,
        }))
    );

    setNeurons(generatedNeurons);
    setConnections(generatedConnections);
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-blue-900/40 dark:text-blue-400/40"
        viewBox="-100 -80 200 160"
        fill="none"
      >
        <title>Brain Neural Network</title>
        {connections.map((connection) => (
          <motion.line
            key={connection.id}
            x1={connection.x1}
            y1={connection.y1}
            x2={connection.x2}
            y2={connection.y2}
            stroke="currentColor"
            strokeWidth={0.5}
            strokeOpacity={connection.opacity}
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, connection.opacity, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
        {neurons.map((neuron) => (
          <motion.circle
            key={neuron.id}
            cx={neuron.x}
            cy={neuron.y}
            r={1.5}
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
