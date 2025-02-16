"use client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import path from "path";

// import axios from 'axios';

// let socket;
// const fileName = "apple-clock.jpeg"
// api/backend/data
// expected output is ../../../../../api/backend/data/{fileName}

// const getFilePath = (file_location) => {
//   const relativePath = `../../../../api/backend/data/${file_location}`;
//   return path.resolve(__dirname, relativePath);
// };

// const filePath = getFilePath(file_location);

const VideoCapture = ({ isCaptured, onCaptureComplete, game_id }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let socket = useRef(null);
  const [latestFrame, setLatestFrame] = useState(null);
  const [showVideo, setShowVideo] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCapturedImage, setShowCapturedImage] = useState("");
  const [resultOutput, setResultOutput] = useState(""); //expect result from socket.

  socket = io("http://localhost:8080");

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  useEffect(() => {
    if (isCaptured) {
      sendFrame(); // should expect a socket response back in the form of text
    }
  }, [isCaptured]);

  const sendFrame = () => {
    return new Promise((resolve, reject) => {
      if (latestFrame) {
        setCapturedImage(latestFrame);
        setShowVideo(false);
        setShowCapturedImage(true);

        const data = {
          id: game_id, // Replace with your actual game_id
          image: latestFrame,
        };

        // Emit the frame data to the server
        socket.emit("frame", data, (response) => {
          if (response && response.success) {
            console.log("Frame sent successfully:", response);
            resolve(response); // Resolve the promise with the server's response
          } else {
            console.error(
              "Error sending frame:",
              response?.error || "Unknown error"
            );
            reject(response?.error || "Error sending frame"); // Reject the promise with an error
          }
        });
      } else {
        reject("No frame available to send.");
      }
    });
  };

  const getTextResult = () => {
    // socket.on("message", (data) => {
    //   console.log(data);
    //   setResultOutput(data);
    //   onTextUpdate(data);
    // });
    const data = "chair.jpg";
    console.log(data);
    setResultOutput(data);
    onCaptureComplete(data);
  };

  useEffect(() => {
    const captureVideo = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const sendInterval = 1; // Send rate: 10 FPS (100ms per frame)

      // Access the webcam
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.play();

      // Capture frames and send to Flask backend
      const captureFrame = async () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        setLatestFrame(canvas.toDataURL("image/jpeg"));

        requestAnimationFrame(captureFrame);
      };
      captureFrame();
    };
    captureVideo();
  }, []);

  return (
    <div>
      {showVideo && (
        <>
          <video
            ref={videoRef}
            width="640"
            height="480"
            style={{ display: "none" }}
          />
          <canvas ref={canvasRef} width="640" height="480" />
          {/*<button onClick={sendFrame}>SEND</button> // */}
        </>
      )}

      {/* {!showCapturedImage && <img src={latestFrame} />} */}
      {capturedImage && <img src={capturedImage} />}
    </div>
  );
};

export default VideoCapture;
