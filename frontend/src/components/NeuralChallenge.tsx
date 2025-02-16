"use client";

interface NeuralChallengeProps {
  irisData: {
    img: string; // or whatever img path?
    // Add other properties if needed
  } | null;
}
export function NeuralChallenge({ irisData }: NeuralChallengeProps) {
  if (!irisData) {
    return <div>Loading iris data...</div>;
  }

  return (
    <div>
      <img src={irisData.img} alt="Iris Analysis" />
      {/* Add other visualization components */}
    </div>
  );
}
