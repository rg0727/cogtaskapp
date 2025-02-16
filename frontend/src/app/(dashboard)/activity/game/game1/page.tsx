"use client";

import { useState, useEffect, SetStateAction } from 'react';
import io from 'socket.io-client';

export default function Page() {
  <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.min.js"></script>

  const [transcription, setTranscription] = useState("");
  const [status, setStatus] = useState("");
  const socket = io("http://localhost:3000");

  useEffect(() => {
    // Set up listeners for socket events
    socket.on('recording_status', (data: { status: SetStateAction<string>; }) => {
      setStatus(data.status);
    });

    socket.on('transcription', (data: { transcription: SetStateAction<string>; }) => {
      setTranscription(data.transcription);
    });

    // Clean up listeners when the component unmounts
    return () => {
      socket.off('recording_status');
      socket.off('transcription');
    };
  }, []);

  // Start recording when the button is clicked
  const startRecording = () => {
    socket.emit('start_recording');
  };

  // Stop recording when the button is clicked
  const stopRecording = () => {
    socket.emit('stop_recording');
  };

  // Transcribe the recorded audio when the button is clicked
  const transcribeAudio = () => {
    socket.emit('transcribe_audio');
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Game 2</h1>
      <p>Welcome to Game 2! Test your skills with this challenge.</p>

      <div className="mt-4">
        <button
          onClick={startRecording}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          className="px-4 py-2 bg-red-500 text-white rounded mr-2"
        >
          Stop Recording
        </button>
        <button
          onClick={transcribeAudio}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Transcribe Audio
        </button>
      </div>

      <div className="mt-4">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Transcription:</strong> {transcription}</p>
      </div>
    </div>
  );
}
