"use client";

interface NeuralChallengeProps {
  imageUrl: string | null;
}

export function NeuralChallenge({ imageUrl }: NeuralChallengeProps) {
  if (!imageUrl) {
    return <div>Loading iris data...</div>;
  }
  const fullUrl = `../../public/${imageUrl}`;
  return (
    <div>
      <img src={fullUrl} alt="Iris Analysis" />
    </div>
  );
}
