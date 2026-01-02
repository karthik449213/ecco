import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuth } from '../lib/mockAuth';
import { useRealTimeLocation } from '../lib/useRealTimeLocation';
import { LocationIndicator } from '../components/LocationIndicator';

export const CameraScreen = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const { location, isLocating, permission, error, startLocating, stopLocating, lockLocation, isLocked } = useRealTimeLocation();

  useEffect(() => {
    const ensureSession = async () => {
      console.log('[CameraScreen] Checking session...');
      
      if (!mockAuth.isAuthenticated()) {
        console.warn('[CameraScreen] No authenticated user, redirecting to /auth');
        navigate('/auth');
      } else {
        console.log('[CameraScreen] User authenticated');
      }
    };
    ensureSession();
  }, [navigate]);

  // Start location tracking when component mounts
  useEffect(() => {
    startLocating();
    return () => stopLocating();
  }, [startLocating, stopLocating]);

  useEffect(() => {
    const startCamera = async () => {
      setIsCameraReady(false);
      try {
        console.log('[CameraScreen] Requesting camera access...');
        
        // Try multiple camera options with priority
        let mediaStream;
        const cameraOptions = [
          // Try back camera (environment) first
          { video: { facingMode: { exact: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
          // Try any back camera
          { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
          // Try front camera (user)
          { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
          // Try any available camera
          { video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
          // Last resort - basic video
          { video: true, audio: false }
        ];

        for (let i = 0; i < cameraOptions.length; i++) {
          try {
            console.log(`[CameraScreen] Trying camera option ${i + 1}...`);
            mediaStream = await navigator.mediaDevices.getUserMedia(cameraOptions[i]);
            console.log(`[CameraScreen] Camera option ${i + 1} successful`);
            break;
          } catch (err) {
            console.log(`[CameraScreen] Camera option ${i + 1} failed:`, err.message);
            if (i === cameraOptions.length - 1) throw err;
          }
        }
        
        if (!mediaStream) {
          throw new Error('No camera available');
        }

        console.log('[CameraScreen] Camera access granted, tracks:', mediaStream.getTracks().length);
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          
          // Wait for video to be ready
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Video load timeout'));
            }, 15000);
            
            const onLoadedMetadata = () => {
              console.log('[CameraScreen] Video metadata loaded:', {
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight,
                readyState: videoRef.current.readyState
              });
              
              // Try to play
              videoRef.current.play()
                .then(() => {
                  console.log('[CameraScreen] Video playing successfully');
                  clearTimeout(timeout);
                  setIsCameraReady(true);
                  resolve();
                })
                .catch(playErr => {
                  console.error('[CameraScreen] Play failed:', playErr);
                  // Try user interaction workaround
                  clearTimeout(timeout);
                  setIsCameraReady(true);
                  resolve();
                });
            };
            
            videoRef.current.onloadedmetadata = onLoadedMetadata;
            videoRef.current.onerror = (err) => {
              console.error('[CameraScreen] Video error:', err);
              clearTimeout(timeout);
              reject(err);
            };

            // If metadata already loaded
            if (videoRef.current.readyState >= 2) {
              onLoadedMetadata();
            }
          });
        }
        
        setHasPermission(true);
      } catch (err) {
        console.error('[CameraScreen] Camera error:', err);
        console.error('[CameraScreen] Error name:', err.name);
        console.error('[CameraScreen] Error message:', err.message);
        setHasPermission(false);
        setIsCameraReady(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        console.log('[CameraScreen] Stopping camera stream');
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || isCapturing || !isCameraReady) {
      if (!isCameraReady) {
        alert('Camera is still loading. Please wait a moment.');
      }
      return;
    }
    
    try {
      setIsCapturing(true);
      console.log('[CameraScreen] Starting capture...');

      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      console.log('[CameraScreen] Video dimensions:', { videoWidth, videoHeight, readyState: video.readyState });

      if (videoWidth === 0 || videoHeight === 0) {
        throw new Error('Video dimensions not available');
      }

      // Lock location when capturing
      const capturedLocation = lockLocation();
      console.log('[CameraScreen] Location locked:', capturedLocation);

      // Create canvas and capture frame
      const canvas = document.createElement('canvas');
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }
      
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      console.log('[CameraScreen] Frame drawn to canvas');

      // Convert to blob and navigate
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('[CameraScreen] Failed to create blob');
          setIsCapturing(false);
          alert('Failed to process image. Please try again.');
          return;
        }
        
        console.log('[CameraScreen] Blob created:', blob.size, 'bytes');
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        const photoUrl = URL.createObjectURL(blob);
        
        console.log('[CameraScreen] Navigating to preview with photo');
        navigate('/preview', { 
          state: { 
            photoUrl, 
            photoFile: file,
            location: capturedLocation 
          } 
        });
      }, 'image/jpeg', 0.9);
      
    } catch (error) {
      console.error('[CameraScreen] Capture error:', error);
      setIsCapturing(false);
      alert(`Failed to capture photo: ${error.message}. Please try again.`);
    }
  };

  if (hasPermission === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-white text-lg mb-6">
            We need camera access to snap eco actions.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Allow Camera
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-screen object-cover"
        style={{ transform: 'scaleX(1)' }}
      />

      {/* Camera Loading Overlay */}
      {!isCameraReady && hasPermission && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Initializing camera...</p>
          </div>
        </div>
      )}

      {/* Overlay Top */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-6 py-3 rounded-2xl z-10">
        <p className="text-white font-bold text-center">
          Capture your eco action
        </p>
        <p className="text-gray-200 text-sm text-center mt-1">
          Keep it steady and clear
        </p>
      </div>

      {/* Location Indicator */}
      <div className="absolute top-24 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:w-96 z-50">
        <LocationIndicator 
          isLocating={isLocating}
          location={location}
          permission={permission}
          error={error}
          isLocked={isLocked}
        />
      </div>

      {/* Capture Button */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={handleCapture}
          disabled={isCapturing || !isCameraReady}
          className="w-20 h-20 bg-white bg-opacity-90 rounded-full border-4 border-accent-50 flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCapturing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
          ) : (
            <span className="text-3xl">📷</span>
          )}
        </button>
        {!isCameraReady && (
          <p className="text-white text-xs text-center mt-2 bg-black bg-opacity-50 px-3 py-1 rounded-full">
            Loading camera...
          </p>
        )}
      </div>
    </div>
  );
};
