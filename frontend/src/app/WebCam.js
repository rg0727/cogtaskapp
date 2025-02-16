"use client";
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const VideoCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let socket = useRef(null);
  let latestFrame = useRef(null);

  useEffect(() => {
    const captureVideo = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const sendInterval = 1; // Send rate: 10 FPS (100ms per frame)

      socket = io('http://localhost:8080');

      socket.on('connect', () => {
        console.log('Connected to server');
      });

      // Access the webcam
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.play();

      // Capture frames and send to Flask backend
      const captureFrame = async () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        latestFrame = canvas.toDataURL('image/jpeg');
        console.log("imdata")

        // socket.send(imageData)
        requestAnimationFrame(captureFrame);
      };

      const sendFrame = () => {
        if (latestFrame) {
          socket.send(latestFrame); // Send the latest frame
          console.log("Frame sent");
        }
      };

      captureFrame();
      setInterval(sendFrame, sendInterval);
    };

    captureVideo();
  }, []);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" style={{ display: 'none' }} />
      <canvas ref={canvasRef} width="640" height="480" />
    </div>
  );
};

export default VideoCapture;