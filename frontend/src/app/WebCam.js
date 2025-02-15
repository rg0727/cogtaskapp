"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button, Card, Row } from 'antd';
import axios from 'axios';

const VideoCapture = () => {
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startCamera = async () => {
    try {
      // websocket.current = new WebSocket('http://localhost:8080/');
      // websocket.current.onopen = () => {
      //   console.log('connected');
      // };

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      mediaRecorderRef.current = new MediaRecorder(stream);

      

      mediaRecorderRef.current.ondataavailable = async(e) => {
        if (e.data.size > 0) {
          
          await axios.post(
            'http://localhost:8080/process_frame', 
            { image: e.data,},
            {
              headers:{
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*',
                // "Access-Control-Allow-Methods": 'PUT, GET, POST, DELETE, OPTIONS',
                // "Access-Control-Allow-Headers": 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
              },
            },
          )
          .then((response) => console.log(response.data))
          .catch((error) => console.error('Error sending frame to backend:', error));
        }
      };

      mediaRecorderRef.current.start(1000);
    } catch (error) {
      console.error('err', error);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      const tracks = mediaStreamRef.current.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      mediaStreamRef.current = null;
      videoRef.current.srcObject = null;
    }

    if (websocket.current) {
      websocket.current.close();
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card title="Stream">
      <video
        ref={videoRef}
        style={{ width: '100%', height: 'auto' }}
        autoPlay
        playsInline
        muted
      />
      <Row justify="center" style={{ marginTop: 'auto' }}>
        <Button
          type="primary"
          onClick={() => startCamera()}
          style={{ margin: '1rem' }}
        >
          Start
        </Button>
        <Button style={{ margin: '1rem' }}
          type="danger"
          onClick={() => stopCamera()}>
          End
        </Button>
      </Row>
    </Card>
  );
};

export default VideoCapture;
// import { useEffect, useRef } from 'react';
// import axios from 'axios';

// const VideoCapture = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const captureVideo = async () => {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');

//       // Access the webcam
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       video.srcObject = stream;
//       video.play();

//       // Capture frames and send to Flask backend
//       const captureFrame = async () => {
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);
//         const imageData = canvas.toDataURL('image/jpeg');
//         console.log(imageData, "imdata")

        
//           await axios.post(
//             'http://localhost:8080/process_frame', 
//             { image: imageData,},
//             {
//               headers:{
//                 "Content-Type": "application/json",
//                 "Access-Control-Allow-Origin": '*',
//                 // "Access-Control-Allow-Methods": 'PUT, GET, POST, DELETE, OPTIONS',
//                 // "Access-Control-Allow-Headers": 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
//               },
//             },
//           )
//           .then((response) => console.log(response.data))
//           .catch((error) => console.error('Error sending frame to backend:', error));
        

//         requestAnimationFrame(captureFrame);
//       };

//       captureFrame();
//     };

//     captureVideo();
//   }, []);

//   return (
//     <div>
//       <video ref={videoRef} width="640" height="480" style={{ display: 'none' }} />
//       <canvas ref={canvasRef} width="640" height="480" />
//     </div>
//   );
// };

// export default VideoCapture;