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
      try {
        console.log('[CameraScreen] Requesting camera access...');
        
        // Try with environment camera first (mobile), then fallback to any camera
        let mediaStream;
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
        } catch (envError) {
          console.log('[CameraScreen] Environment camera failed, trying any camera...');
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
        }
        
        console.log('[CameraScreen] Camera access granted');
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          // Ensure video element is ready
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(err => console.error('[CameraScreen] Play error:', err));
          };
        }
        setHasPermission(true);
      } catch (err) {
        console.error('[CameraScreen] Camera error:', err);
        console.error('[CameraScreen] Error name:', err.name);
        console.error('[CameraScreen] Error message:', err.message);
        setHasPermission(false);
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
    if (!videoRef.current || isCapturing) return;
    
    try {
      setIsCapturing(true);
      console.log('[CameraScreen] Capturing photo...');

      // Lock location when capturing
      const capturedLocation = lockLocation();
      console.log('[CameraScreen] Location locked:', capturedLocation);

      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      if (canvas.width === 0 || canvas.height === 0) {
        console.error('[CameraScreen] Video dimensions not available');
        setIsCapturing(false);
        alert('Camera not ready. Please wait a moment and try again.');
        return;
      }

      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('[CameraScreen] Failed to create blob');
          setIsCapturing(false);
          return;
        }
        
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        const photoUrl = URL.createObjectURL(blob);
        console.log('[CameraScreen] Photo captured successfully, navigating to preview');
        navigate('/preview', { 
          state: { 
            photoUrl, 
            photoFile: file,
            location: capturedLocation 
          } 
        });
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('[CameraScreen] Capture error:', error);
      setIsCapturing(false);
      alert('Failed to capture photo. Please try again.');
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
      />

      {/* Overlay Top */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-6 py-3 rounded-2xl">
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
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleCapture}
          disabled={isCapturing}
          className="w-20 h-20 bg-white bg-opacity-90 rounded-full border-4 border-accent-50 flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
        >
          {isCapturing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
          ) : (
            <span className="text-3xl">📷</span>
          )}
        </button>
      </div>
    </div>
  );
};
