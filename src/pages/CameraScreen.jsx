import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuth } from '../lib/mockAuth';

export const CameraScreen = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);

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

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error('Camera error:', err);
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || isCapturing) return;
    setIsCapturing(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      const photoUrl = URL.createObjectURL(blob);
      navigate('/preview', { state: { photoUrl, photoFile: file } });
      setIsCapturing(false);
    }, 'image/jpeg', 0.7);
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
    <div className="min-h-screen bg-black relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
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
