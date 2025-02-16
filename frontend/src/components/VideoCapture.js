"use client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const VideoCapture = ({ isCaptured, onCaptureComplete, game_id }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const socket = useRef(null);
  const [latestFrame, setLatestFrame] = useState(null);
  const [showVideo, setShowVideo] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCapturedImage, setShowCapturedImage] = useState(false);
  const [resultOutput, setTaskMessage] = useState("");

  useEffect(() => {
    socket.current = io("http://localhost:8080");

    socket.current.on("connect", () => {
      console.log("Connected to server");
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (isCaptured) {
      console.log("True!");
      // Call sendFrame and handle the Promise
      sendFrame()
        .then((message) => {
          console.log("Received message:", message);
          setTaskMessage(message);
          if (onCaptureComplete) {
            onCaptureComplete(message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setTaskMessage("Error processing image");
        });
    }
  }, [isCaptured]);

  const sendFrame = () => {
    if (latestFrame) {
      const data = {
        id: 2,
        image: latestFrame,
      };

      return new Promise((resolve, reject) => {
        console.log("Sending frame to server...");

        // Remove the response callback from emit
        socket.current.emit("message", data);

        // Set up a one-time listener for the response
        socket.current.once("task", (response) => {
          console.log("Received response:", response);

          if (response && response.status === "success") {
            console.log("Success:", response.message);
            resolve(response.message);
          } else {
            console.error("Error:", response?.message || "Unknown error");
            reject(new Error(response?.message || "Error processing frame"));
          }
        });

        // Add timeout
        setTimeout(() => {
          reject(new Error("Server response timeout"));
        }, 10000); // 10 second timeout
      });
    }
  };

  // Usage with async/await and error handling
  const handleCapture = async () => {
    try {
      setCapturedImage(latestFrame);
      setShowVideo(false);
      setShowCapturedImage(true);

      const result = await sendFrame();
      console.log("Frame processed successfully:", result);
      if (onCaptureComplete) {
        onCaptureComplete(result);
      }
    } catch (error) {
      console.error("Error processing frame:", error);
      // Handle error (show error message to user, etc.)
    }
  };

  const getTextResult = () => {
    const data = "boba.png";
    console.log(data);
    setResultOutput(data);
    onCaptureComplete(data);
  };

  useEffect(() => {
    const captureVideo = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        video.srcObject = stream;
        await video.play();

        const captureFrame = () => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          setLatestFrame(canvas.toDataURL("image/jpeg"));
          requestAnimationFrame(captureFrame);
        };
        captureFrame();
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };
    captureVideo();
  }, []);

  return (
    <div className="h-full flex items-center justify-center">
      {showVideo && (
        <>
          <video
            ref={videoRef}
            width="640"
            height="480"
            style={{ display: "none" }}
          />
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            className="max-w-full h-auto"
          />
        </>
      )}
      {showCapturedImage && capturedImage && (
        <img
          src={capturedImage || "/placeholder.svg"}
          alt="Captured frame"
          className="max-w-full h-auto"
        />
      )}
    </div>
  );
};

export default VideoCapture;
