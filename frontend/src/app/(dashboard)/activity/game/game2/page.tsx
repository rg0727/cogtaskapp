"use client";

import { useState } from "react";
import VideoCapture from "@/components/VideoCapture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const [isCaptured, setIsCaptured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("Here is your feedback");

  const handleCaptureComplete = (feedbackText: string) => {
    setFeedback(feedbackText);
    console.log("Received feedback:", feedbackText);
  };

  const handleCaptureClick = () => {
    console.log("captureClicked!");
    setIsLoading(true);
    setIsCaptured(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Game 2</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <p className="mb-4">
              Welcome to Game 2! Test your skills with this challenge.
            </p>
            <div className="flex-grow rounded-lg">
              <VideoCapture
                game_id={2}
                isCaptured={isCaptured}
                onCaptureComplete={handleCaptureComplete}
              />
            </div>
          </CardContent>
        </Card>

        {isCaptured && (
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4">Suggestions</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {feedback}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Button
        onClick={handleCaptureClick}
        className="mt-6"
        disabled={isLoading || isCaptured}
      >
        {isLoading ? "Capturing..." : "Capture"}
      </Button>
    </div>
  );
}
