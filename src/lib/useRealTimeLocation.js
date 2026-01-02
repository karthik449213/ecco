import { useState, useEffect, useRef, useCallback } from 'react';

export const useRealTimeLocation = () => {
  const [location, setLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [permission, setPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);
  const isLockedRef = useRef(false);

  // Start continuous location watching
  const startLocating = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setPermission('denied');
      return;
    }

    setIsLocating(true);
    setError(null);
    isLockedRef.current = false;

    // Request location with high accuracy for demo visibility
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        
        console.log('[useRealTimeLocation] Location updated:', newLocation);
        setLocation(newLocation);
        setPermission('granted');
        setError(null);
      },
      (err) => {
        console.error('[useRealTimeLocation] Error:', err);
        
        if (err.code === 1) { // PERMISSION_DENIED
          setPermission('denied');
          setError('Location permission denied');
        } else if (err.code === 2) { // POSITION_UNAVAILABLE
          setError('Location unavailable');
        } else if (err.code === 3) { // TIMEOUT
          setError('Location timeout');
        } else {
          setError('Could not get location');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Always get fresh location
      }
    );

    watchIdRef.current = watchId;

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Stop watching location
  const stopLocating = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsLocating(false);
  }, []);

  // Lock current location (for capture)
  const lockLocation = useCallback(() => {
    isLockedRef.current = true;
    setIsLocating(false);
    return location;
  }, [location]);

  // Check if location is locked
  const isLocked = isLockedRef.current;

  return {
    location,
    isLocating,
    permission,
    error,
    startLocating,
    stopLocating,
    lockLocation,
    isLocked,
  };
};
