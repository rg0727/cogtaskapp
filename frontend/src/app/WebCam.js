"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button, Card, Row } from 'antd';

const Webcam = () => {
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const websocket = useRef(null);

  const startCamera = async () => {
    try {
      websocket.current = new WebSocket('http://localhost:8080');
      websocket.current.onopen = () => {
        console.log('connected');
      };

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mediaStreamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          websocket.current.send(e.data);
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
          Comenzar Sesión
        </Button>
        <Button style={{ margin: '1rem' }}
          type="danger"
          onClick={() => stopCamera()}>
          Terminar Sesión
        </Button>
      </Row>
    </Card>
  );
};

export default Webcam;