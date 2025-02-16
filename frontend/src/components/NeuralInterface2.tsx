import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

export function NeuralInterface2() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [frame, setFrame] = useState('');
  const [isActive, setIsActive] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const frameCountRef = useRef(0);

  useEffect(() => {
    const newSocket = io("http://localhost:7070");
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsActive(true);
      newSocket.emit('start_game');
    });

    newSocket.on('frame', (frameData) => {
      frameCountRef.current += 1;
      console.log(`Received frame ${frameCountRef.current}, data length: ${frameData.length}`);
      
      if (frameData.length > 0) {
        // Ensure the data is properly formatted
        const base64Data = frameData.startsWith('data:image') ? frameData : `data:image/jpeg;base64,${frameData}`;
        setFrame(base64Data);
        
        // Debug: log the first few characters of the base64 string
        console.log(`Frame data starts with: ${base64Data.substring(0, 50)}...`);
        
        // Attempt to load the image
        const img = new Image();
        img.onload = () => console.log(`Frame ${frameCountRef.current} loaded successfully`);
        img.onerror = (e) => console.error(`Failed to load frame ${frameCountRef.current}`, e);
        img.src = base64Data;
      } else {
        console.error('Received empty frame data');
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsActive(false);
    });

    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (socketRef.current) {
        socketRef.current.emit('stop_game');
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleToggle = () => {
    if (isActive) {
      socketRef.current?.emit('stop_game');
      setIsActive(false);
    } else {
      socketRef.current?.emit('start_game');
      setIsActive(true);
    }
  };

  return (
    <div className="bg-accent rounded-lg overflow-hidden flex-grow flex flex-col">
      {isInitializing ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary opacity-20 absolute"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-32 h-32 border-4 border-primary rounded-full animate-ping mb-6"></div>
            <p className="text-2xl font-semibold text-accent-foreground">
              Initializing Neural Link...
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center bg-accent-foreground/10 p-6">
          <p className="text-2xl font-semibold text-accent-foreground mb-4">
            Neural Link {isActive ? 'Active' : 'Inactive'}
          </p>
          <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden shadow-lg mb-4">
            {isActive && frame ? (
              <img 
                src={frame} 
                alt="Hand Tracking" 
                className="w-full h-full object-contain" 
                onError={(e) => {
                  console.error('Image failed to load', e);
                  // Optionally, set a placeholder or error image
                  // e.currentTarget.src = 'path/to/error/image.png';
                }}
              />
            ) : (
              <p className="text-lg text-accent-foreground/70">
                {isActive ? 'Waiting for camera feed...' : 'Neural Link Inactive'}
              </p>
            )}
          </div>
          <button 
            onClick={handleToggle}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            {isActive ? 'Deactivate' : 'Activate'} Neural Link
          </button>
        </div>
      )}
    </div>
  );
}