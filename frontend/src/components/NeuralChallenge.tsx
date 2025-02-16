"use client";

interface NeuralChallengeProps {
  imageUrl: string | null;
}

export function NeuralChallenge({ imageUrl }: NeuralChallengeProps) {
  if (!imageUrl) {
    return <div>Loading iris data...</div>;
  }
  const fullUrl = `./././././api/backend/data/${imageUrl}`;
  return (
    <div>
      <img src={fullUrl} alt="Iris Analysis" />
      {/* Add other visualization components */}
    </div>
  );
}
