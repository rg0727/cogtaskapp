"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function NeuralConnections({ position }: { position: number }) {
  const neurons = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 700 - 350,
    y: Math.random() * 350 - 175,
  }));

  const connections = neurons.flatMap((neuron, i) =>
    neurons.slice(i + 1).map((otherNeuron, j) => ({
      id: `${i}-${j}`,
      x1: neuron.x,
      y1: neuron.y,
      x2: otherNeuron.x,
      y2: otherNeuron.y,
      opacity: Math.random() * 0.5 + 0.1,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-blue-500 dark:text-blue-400"
        viewBox="-350 -175 700 350"
        fill="none"
      >
        <title>Neural Network</title>
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
            r={2}
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

export default function BackgroundPaths({
  title = "Neural Network",
}: {
  title?: string;
}) {
  const words = title.split(" ");

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className="absolute inset-0">
        <NeuralConnections position={1} />
        <NeuralConnections position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <div className="inline-block group relative bg-gradient-to-b from-blue-400/10 to-purple-400/10 dark:from-blue-600/10 dark:to-purple-600/10 p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Button
              variant="ghost"
              className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:-translate-y-0.5 border border-blue-400/10 dark:border-blue-600/10 hover:shadow-md dark:hover:shadow-blue-800/50"
            >
              <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                Explore Brain Dynamics
              </span>
              <span className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
                →
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
