"use client";

import { useState, useEffect } from "react";
import { NeuralInterface } from "@/components/NeuralInterface";
import { NeuralChallenge } from "@/components/NeuralChallenge";
import { Button } from "@/components/ui/button";
import { Chat } from "@/components/Chat";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";

interface IrisData {
  img: string;
  // Add other properties if needed
}

export default function Page() {
  const [isCaptured, setIsCaptured] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [apiResult, setApiResult] = useState("Initial state...");
  const [similarityScore, setSimilarityScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [irisData, setIrisData] = useState<IrisData | null>(null);
  const [transcription, setTranscription] = useState("");
  const [status, setStatus] = useState("");
  const socket = io("http://localhost:8080");

  const fetchIrisData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/iris");
      const data = await response.json();

      if (data.success) {
        setIrisData(data);
        setApiResult("Iris data captured successfully"); // DUMMY API RETURN DATA... REPLACE WITH ACTUAL DATA
        setShowChat(true);
      } else {
        throw new Error("Failed to fetch iris data");
      }
    } catch (error) {
      console.error("Error fetching iris data:", error);
      setApiResult("Error: Failed to process iris data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    socket.on("recording_status", (data) => {
      setStatus(data.status);
      setApiResult(data.status); // Update API result for chat
    });

    socket.on("transcription", (data) => {
      setTranscription(data.transcription);
      setApiResult(data.transcription); // Update API result for chat
    });

    return () => {
      socket.off("recording_status");
      socket.off("transcription");
    };
  }, []);

  const handleCapture = async () => {
    setIsCaptured(true);
    setIsLoading(true);
    await fetchIrisData();
  };

  // Meant for the Chat Component
  const handleStartRecording = () => {
    socket.emit("start_recording");
  };

  // Meant for the Chat Component
  const handleStopRecording = () => {
    socket.emit("stop_recording");
    setShowChat(true);
  };

  // Meant for Chat Component
  const handleTranscribe = () => {
    socket.emit("transcribe_audio"); // string
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
                <AnimatePresence>
                  {!isCaptured && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Button onClick={handleCapture}>Capture</Button>
                      {/* upon capture click, save image from camera (opencv) and send to iris*/}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-grow">
                <div className="flex flex-col">
                  <NeuralInterface />
                </div>
                <AnimatePresence>
                  {isCaptured && (
                    <motion.div
                      className="flex flex-col"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <NeuralChallenge irisData={irisData} />
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
                  <Chat apiCallResult={similarityScore} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
