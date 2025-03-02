"use client";

import { useState, useEffect, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import io from "socket.io-client";

interface ChatProps {
  apiCallResult: number;
  onScoreUpdate: (score: number) => void;
}
export function Chat({ apiCallResult, onScoreUpdate }: ChatProps) {
  // {score, transcription}
  const [isRecording, setIsRecording] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [hasRecorded, setHasRecorded] = useState(false);
  const [audioResponse, setAudioResponse] = useState("");
  const [similarityScore, setSimilarityScore] = useState(0);
  const socket = io("http://localhost:8080");

  const handleStartRecording = () => {
    socket.emit("start_recording");
  };

  const handleStopRecording = () => {
    socket.emit("stop_recording");
    setShowAnalysis(true);
    setHasRecorded(true);
    handleTranscribe();
    setAudioResponse(transcription);
    console.log(transcription);
    console.log(audioResponse); // debug line
  };

  const handleTranscribe = () => {
    socket.emit("transcribe_audio");
  };

  const toggleRecording = () => {
    if (!isRecording) {
      handleStartRecording();
    } else {
      handleStopRecording();
      getAudioSimiliarityScore();
    }

    setIsRecording(!isRecording);
  };

  const getAudioSimiliarityScore = () => {
    // Simulating API call for AudioResponse
    const simulatedResponse =
      "This is a simulated audio response from the backend.";
    setAudioResponse(simulatedResponse);

    // Simulating similarity score calculation
    const score = Math.floor(Math.random() * 41) + 60; // Random score between 60 and 100
    setSimilarityScore(score);
    onScoreUpdate(score);
  };

  useEffect(() => {
    // Simulating API call result update
    console.log("API Call Result:", apiCallResult);
  }, [apiCallResult]);

  useEffect(() => {
    socket.on(
      "transcription",
      (data: { score: number; transcription: string }) => {
        const { score, transcription } = data;
        console.log("Transcription received:", data.transcription);
        setSimilarityScore(score);
        setTranscription(transcription);
      }
    );

    return () => {
      socket.off("transcription"); // Clean up event listener when component unmounts
    };
  }, []);

  const toggleView = () => {
    setShowAnalysis(!showAnalysis);
  };

  return (
    <div className="flex flex-col h-full bg-muted rounded-lg overflow-hidden">
      <div className="p-4 bg-card flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4 text-card-foreground">
          {showAnalysis ? "Audio Analysis" : "Voice Chat"}
        </h2>
        {hasRecorded && (
          <Button onClick={toggleView} variant="outline" size="sm">
            {showAnalysis ? (
              <Mic className="w-4 h-4 mr-2" />
            ) : (
              <BarChart2 className="w-4 h-4 mr-2" />
            )}
            {showAnalysis ? "Back to Chat" : "View Analysis"}
          </Button>
        )}
      </div>
      <AnimatePresence mode="wait">
        {showAnalysis ? (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow p-4 overflow-auto"
          >
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Similarity Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="font-semibold mb-2">Similarity Score</p>
                  <div className="flex items-center">
                    <Progress value={similarityScore} className="w-full mr-4" />
                    <span className="text-2xl font-bold">
                      {similarityScore}%
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold mb-2">Audio Response:</p>
                    <div className="bg-muted p-2 rounded-md">
                      {transcription}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow p-4"
          >
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg text-center leading-relaxed font-bold">
                What are the similiarities between the two images?
              </p>
              <div className="flex flex-col items-center">
                <Button
                  onClick={toggleRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isRecording ? (
                    <Square className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </Button>
                <AnimatePresence>
                  {isRecording && (
                    <motion.div
                      className="flex justify-center items-center h-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="w-1 h-8 bg-blue-500 mx-1"
                        animate={{
                          height: [8, 32, 16, 32, 8],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="w-1 h-8 bg-blue-500 mx-1"
                        animate={{
                          height: [16, 8, 32, 16, 32],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="w-1 h-8 bg-blue-500 mx-1"
                        animate={{
                          height: [32, 16, 8, 32, 16],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
