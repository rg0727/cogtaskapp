"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import VideoCapture from "@/components/VideoCapture";
import { Chat } from "@/components/Chat";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function Page() {
  const [isCaptured, setIsCaptured] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [similarityScore, setSimilarityScore] = useState<number>(0);
  const [status, setStatus] = useState("");
  const [fileLocation, setFileLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const socket = io("http://localhost:8080");

  useEffect(() => {
    socket.on("recording_status", (data) => {
      setStatus(data.status);
    });

    return () => {
      socket.off("recording_status");
    };
  }, [socket]);

  const handleCaptureClick = () => {
    setIsLoading(true);
    setIsCaptured(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowChat(true);
    }, 2000);
  };

  const handleCaptureComplete = (location: string) => {
    setFileLocation(location);
    console.log("Captured File Location:", location);
  };

  const updateSimilarityScore = (newScore: number) => {
    setSimilarityScore(newScore);
  };

  return (
    <div className="h-full bg-gradient-to-br from-white to-blue-200 flex-grow flex items-center justify-center">
      <main className="w-full max-w-6xl mx-auto px-4 py-8">
        <motion.div
          className="w-full"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-center mb-8"
            variants={fadeInUp}
          >
            Neural Interface
          </motion.h1>

          <motion.div
            className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden mb-8"
            variants={fadeInUp}
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-0">
                  Video Capture
                </h2>
                <AnimatePresence>
                  {!isCaptured && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Button
                        onClick={handleCaptureClick}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                      >
                        Capture
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <motion.div
                  className="bg-gray-100 rounded-xl overflow-hidden shadow-inner"
                  variants={fadeInUp}
                >
                  <VideoCapture
                    isCaptured={isCaptured}
                    onCaptureComplete={handleCaptureComplete}
                    game_id={1}
                  />
                </motion.div>
                <AnimatePresence>
                  {isCaptured && (
                    <motion.div
                      className="bg-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      {isLoading ? (
                        <motion.div
                          className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                      ) : (
                        <img
                          src={`/api/get-image?image=${encodeURIComponent(
                            fileLocation
                          )}`}
                          alt="Captured"
                          className="max-w-full max-h-full object-contain"
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {showChat && (
              <motion.div
                className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">
                    Chat Interface
                  </h2>
                  <Chat
                    apiCallResult={similarityScore}
                    onScoreUpdate={updateSimilarityScore}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
