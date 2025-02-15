"use client";

import { useState, useEffect } from "react";

type Metric = {
  name: string;
  value: number;
};

export function CognitiveMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { name: "Focus", value: 0 },
    { name: "Memory", value: 0 },
    { name: "Reaction", value: 0 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prevMetrics) =>
        prevMetrics.map((metric) => ({
          ...metric,
          value: Math.floor(Math.random() * 100),
        }))
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-card-foreground">
        Cognitive Metrics
      </h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-foreground bg-primary">
                  {metric.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-card-foreground">
                  {metric.value}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-secondary">
              <div
                style={{ width: `${metric.value}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
