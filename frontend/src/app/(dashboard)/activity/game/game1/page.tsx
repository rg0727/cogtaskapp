"use client";

import { useState, useEffect } from "react";
import { NeuralInterface } from "@/components/NeuralInterface";
import { NeuralChallenge } from "@/components/NeuralChallenge";
import { Button } from "@/components/ui/button";
import { Chat } from "@/components/Chat";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import path from "path";

import VideoCapture from "@/components/VideoCapture";

export default function Page() {
  const [isCaptured, setIsCaptured] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [apiResult, setApiResult] = useState("Initial state...");
  const [similarityScore, setSimilarityScore] = useState<number>(0); // used for chat component
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState(""); // also used for chat component
  const [status, setStatus] = useState("");
  const [fileLocation, setFileLocation] = useState("");
  const socket = io("http://localhost:8080");

  // const adjustedFilePath = path.join(
  //   __dirname,
  //   "../../../../../../../api/backend/data",
  //   fileLocation
  // );

  // Get the similarity score from the chat component
  const updateSimilarityScore = (newScore: number) => {
    setSimilarityScore(newScore);
  };

  useEffect(() => {
    socket.on("recording_status", (data) => {
      setStatus(data.status);
      setApiResult(data.status); // Update API result for chat
    });

    // socket.on("transcription", (data) => {
    //   setTranscription(data.transcription);
    //   setApiResult(data.transcription); // Update API result for chat
    // });

    return () => {
      socket.off("recording_status");
      // socket.off("transcription");
    };
  }, []);
  const handleCaptureClick = () => {
    setIsCaptured(true); // Trigger capture in VideoCapture
    setTimeout(() => setShowChat(true), 1000);
  };

  const handleCaptureComplete = (location: string) => {
    setFileLocation(location); // Receive file location from VideoCapture
    // setIsCaptured(false); // Reset trigger
    console.log("Captured File Location:", location);
  };

  const displayCapturedStatus = () => {
    console.log(isCaptured);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow flex items-stretch p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="w-full max-w-7xl mx-auto flex flex-col">
          <div className="bg-card rounded-lg shadow-2xl overflow-hidden flex-grow flex flex-col">
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-card-foreground">
                  Neural Interface
                </h2>
                <Button onClick={displayCapturedStatus}>Status?</Button>
                <AnimatePresence>
                  {!isCaptured && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Button onClick={handleCaptureClick}>Capture</Button>
                      {/* upon capture click, save image from camera (opencv) and send to iris*/}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-grow">
                <div className="flex flex-col">
                  {/* I want to pass the handleCapture state to be passed into video capture when the state is changed. When handleCapture is true, it should pass that state into videoCapture */}
                  <VideoCapture
                    isCaptured={isCaptured}
                    onCaptureComplete={handleCaptureComplete}
                  />
                </div>
                <AnimatePresence>
                  {isCaptured && (
                    <motion.div
                      className="flex flex-col"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <NeuralChallenge imageUrl={fileLocation} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {showChat && (
              <motion.div
                className="mt-8 bg-card rounded-lg shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4 text-card-foreground">
                    Chat
                  </h2>
                  <Chat
                    apiCallResult={similarityScore}
                    onScoreUpdate={updateSimilarityScore}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
