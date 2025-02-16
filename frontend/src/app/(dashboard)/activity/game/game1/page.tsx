"use client";

import { useState, useEffect, useRef } from "react";
import { NeuralInterface } from "@/components/NeuralInterface";
import { NeuralChallenge } from "@/components/NeuralChallenge";
import { Button } from "@/components/ui/button";
import { Chat } from "@/components/Chat";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";

import VideoCapture from "@/components/VideoCapture.js";

interface IrisData {
  img: string;
  // Add other properties if needed
}

export default function Page() {
  const [isCaptured, setIsCaptured] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [apiResult, setApiResult] = useState("Initial state...");
  const [isLoading, setIsLoading] = useState(false);
  const [irisData, setIrisData] = useState<IrisData | null>(null);
  const [transcription, setTranscription] = useState("");
  const [status, setStatus] = useState("");
  const socket = useRef(io("http://localhost:8080"));

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
    socket.current.on("recording_status", (data) => {
      setStatus(data.status);
      setApiResult(data.status); // Update API result for chat
    });

    socket.current.on("transcription", (data) => {
      setTranscription(data.transcription);
      setApiResult(data.transcription); // Update API result for chat
    });

    return () => {
      socket.current.off("recording_status");
      socket.current.off("transcription");
    };
  }, []);

  const handleCapture = async () => {
    setIsCaptured(true);
    setIsLoading(true);

    // Fetch iris data before starting video capture
    await fetchIrisData();
    socket.current.emit("start_recording");

    // Start video capture and frame sending
    startVideoCapture();
  };

  const startVideoCapture = () => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (context) {
      // Access webcam and start capturing frames
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.play();

          // Set canvas size to match video
          video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Call captureFrame once the video starts
            captureFrame(video, canvas, context);
          };
        })
        .catch((error) => {
          console.error("Error accessing webcam:", error);
        });
    }
  };

  const captureFrame = async (video: HTMLVideoElement, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    // Capture frame and send it via socket
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const latestFrame = canvas.toDataURL("image/jpeg");
    
    // Send frame data to the server
    socket.current.send(latestFrame);
    console.log("Frame sent");

    // Keep capturing frames
    requestAnimationFrame(() => captureFrame(video, canvas, context));
  };

  const handleStopRecording = () => {
    socket.current.emit("stop_recording");
    setShowChat(true);
  };

  const handleTranscribe = () => {
    socket.current.emit("transcribe_audio");
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-grow">
                <div className="flex flex-col">
                  <VideoCapture />
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
                  <Chat apiCallResult={apiResult} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
