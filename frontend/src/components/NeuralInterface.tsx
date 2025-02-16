"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function NeuralInterface() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 3000); // Simulate initialization for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="bg-accent rounded-lg overflow-hidden flex-grow flex flex-col">
      {isInitializing ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary opacity-20 absolute"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 border-4 border-primary rounded-full animate-ping mb-4"></div>
            <p className="text-lg font-semibold text-accent-foreground">
              Initializing Neural Link...
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center bg-accent-foreground/10 p-4">
          <div className="text-center mb-4">
            <p className="text-lg font-semibold text-accent-foreground mb-2">
              Neural Link {isActive ? "Active" : "Inactive"}
            </p>
            {isActive ? (
              <div className="w-64 h-48 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <p className="text-sm text-accent-foreground/70">
                  Camera feed placeholder
                </p>
                {/* Add your actual camera feed here */}
              </div>
            ) : (
              <p className="text-sm text-accent-foreground/70 mb-4">
                Camera feed disabled
              </p>
            )}
          </div>
          <Button
            onClick={handleToggle}
            variant={isActive ? "destructive" : "default"}
          >
            {isActive ? "Deactivate" : "Activate"} Neural Link
          </Button>
        </div>
      )}
    </div>
  );
}
