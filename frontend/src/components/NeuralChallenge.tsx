"use client";

import type React from "react";
import { useState } from "react";

export function NeuralChallenge() {
  const [selectedChallenge, setSelectedChallenge] = useState("");

  const handleChallengeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedChallenge(event.target.value);
  };

  const handleInitiateChallenge = () => {
    if (selectedChallenge) {
      alert(`Initiating challenge: ${selectedChallenge}`);
      // Here you would typically start the selected challenge
    } else {
      alert("Please select a challenge first");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-card-foreground">
        Neural Challenge
      </h3>
      <select
        className="w-full bg-input text-input-foreground border border-input rounded-lg focus:ring-primary focus:border-primary block p-2.5"
        value={selectedChallenge}
        onChange={handleChallengeChange}
      >
        <option value="">Select your challenge</option>
        <option value="quantum-memory-maze">Quantum Memory Maze</option>
        <option value="synaptic-speed-test">Synaptic Speed Test</option>
        <option value="neural-pattern-recognition">
          Neural Pattern Recognition
        </option>
      </select>
      <button
        className="mt-4 w-full bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-all duration-200"
        onClick={handleInitiateChallenge}
      >
        Initiate Challenge
      </button>
    </div>
  );
}
