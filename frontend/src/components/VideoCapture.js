"use client";
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
// import axios from 'axios';

// let socket;

const VideoCapture = ( game_id ) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let socket = useRef(null);
  const [latestFrame, setLatestFrame]= useState(null);
  const [showVideo, setShowVideo] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCapturedImage, setShowCapturedImage] = useState('');
  const [resultOutput, setResultOutput] = useState('');

  socket = io('http://localhost:8080');

  socket.on('connect', () => {
    console.log('Connected to server');
  });


  const sendFrame = () => {
    if (latestFrame) {
      // latestFrame = frame;
      setCapturedImage(latestFrame);
      setShowVideo(false);
      setShowCapturedImage(true);

      let data = {
        "id":game_id, 
        "image":latestFrame
      }
      socket.send(data); // Send the latest frame
      console.log("Frame sent");
    }
  };

  useEffect(() => {
    const captureVideo = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const sendInterval = 1; // Send rate: 10 FPS (100ms per frame)

      
      // Access the webcam
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.play();

      // Capture frames and send to Flask backend
      const captureFrame = async () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        setLatestFrame(canvas.toDataURL('image/jpeg'));

        requestAnimationFrame(captureFrame);
      };
      captureFrame();
    };
    captureVideo();
  }, []);

  return (
    <div>
      {showVideo &&
        <>
          <video ref={videoRef} width="640" height="480" style={{ display: 'none' }} />
          <canvas ref={canvasRef} width="640" height="480" />
          <button onClick={sendFrame}>woohoo</button>
        </>
      }
      {capturedImage && 
        <img src={capturedImage}/>
      }
    </div>
  );
};

export default VideoCapture;