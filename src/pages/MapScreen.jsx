import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const recyclingLocations = [
  { id: 1, name: 'NGO Recycling', lat: 37.7849, lng: -122.4194, type: 'Recycling Bins', icon: '🔴' },
  { id: 2, name: 'Government Dump Point', lat: 37.7829, lng: -122.4164, type: 'Recycling Bins', icon: '🔴' },
  { id: 3, name: 'NGO Recycling Center', lat: 37.7869, lng: -122.4224, type: 'Recycling Bins', icon: '🔴' },
  { id: 4, name: 'NGO Recycling Center', lat: 37.7809, lng: -122.4204, type: 'Recycling Bins', icon: '🔴' },
  { id: 5, name: 'Mcer Ullike', lat: 37.7789, lng: -122.4184, type: 'Community Gardens', icon: '🟢' },
  { id: 6, name: 'Sowrag Bsm', lat: 37.7799, lng: -122.4254, type: 'Donation Centers', icon: '🟡' },
  { id: 7, name: 'NGO Recycling Center', lat: 37.7819, lng: -122.4144, type: 'Recycling Bins', icon: '🔴' },
];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = { lat: 37.7829, lng: -122.4194 };

export const MapScreen = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [googleMap, setGoogleMap] = useState(null);
  const [activeCategory, setActiveCategory] = useState('bins');
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const markersRef = useRef([]);

  // Initialize map
  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.google || !window.google.maps) {
        console.log('[MapScreen] Waiting for Google Maps API...');
        setTimeout(initializeMap, 500);
        return;
      }

      console.log('[MapScreen] Initializing Google Maps...');
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: userLocation,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
      });

      setGoogleMap(map);
      console.log('[MapScreen] Google Maps initialized');
    };

    initializeMap();
  }, []);

  // Update map center when user location changes
  useEffect(() => {
    if (googleMap) {
      googleMap.setCenter(userLocation);
      console.log('[MapScreen] Map center updated:', userLocation);
    }
  }, [googleMap, userLocation]);

  // Add markers to map
  useEffect(() => {
    if (!googleMap) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // User location marker
    const userMarker = new window.google.maps.Marker({
      position: userLocation,
      map: googleMap,
      title: 'Your Location',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#3B82F6',
        fillOpacity: 0.8,
        strokeColor: '#1F2937',
        strokeWeight: 2,
      },
    });
    markersRef.current.push(userMarker);

    // Recycling location markers
    filteredLocations.forEach(location => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: googleMap,
        title: location.name,
        icon: {
          path: 'M12 0C6.48 0 2 4.48 2 10c0 5.85 8 14 10 14s10-8.15 10-14c0-5.52-4.48-10-10-10zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z',
          scale: 2,
          fillColor: '#10b981',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          anchor: new window.google.maps.Point(12, 24),
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="bg-white p-3 rounded">
            <p class="font-bold text-primary-800">${location.name}</p>
            <p class="text-sm text-gray-600">${location.type}</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        // Close all other info windows
        infoWindow.open(googleMap, marker);
      });

      markersRef.current.push(marker);
    });

    console.log('[MapScreen] Added', markersRef.current.length, 'markers');
  }, [googleMap, activeCategory]);

  // Get user location
  useEffect(() => {
    const getUserLocation = () => {
      setIsLoadingLocation(true);
      
      if (!navigator.geolocation) {
        console.warn('[MapScreen] Geolocation not supported');
        setLocationPermission('denied');
        setIsLoadingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          console.log('[MapScreen] Location obtained:', newLocation);
          setUserLocation(newLocation);
          setLocationPermission('granted');
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('[MapScreen] Geolocation error:', error);
          
          if (error.code === error.PERMISSION_DENIED) {
            setLocationPermission('denied');
          }
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    getUserLocation();
  }, []);

  const filteredLocations = recyclingLocations.filter(loc => {
    if (activeCategory === 'bins') return loc.type === 'Recycling Bins';
    if (activeCategory === 'gardens') return loc.type === 'Community Gardens';
    if (activeCategory === 'donations') return loc.type === 'Donation Centers';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md p-4 relative z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/home')}
            className="text-primary-700 font-semibold"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <span className="text-2xl font-bold text-primary-800">8,500</span>
              <span className="text-gray-600 text-sm ml-1">Eco-Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        {isLoadingLocation && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-[1000]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold">Getting your location...</p>
            </div>
          </div>
        )}

        {locationPermission === 'denied' && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg z-[1000]">
            <p className="text-sm font-semibold">📍 Location access denied - showing default area</p>
          </div>
        )}

        {!googleMap && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-[500]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold">Loading Google Maps...</p>
            </div>
          </div>
        )}

        <div 
          ref={mapRef} 
          style={{ width: '100%', height: '100%' }}
        ></div>

        {/* Category Buttons */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 bg-white rounded-full p-2 shadow-lg z-[500]">
          <button
            onClick={() => setActiveCategory('bins')}
            className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
              activeCategory === 'bins'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            🔵 Recycling Bins
          </button>
          <button
            onClick={() => setActiveCategory('gardens')}
            className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
              activeCategory === 'gardens'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            🌳 Community Gardens
          </button>
          <button
            onClick={() => setActiveCategory('donations')}
            className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
              activeCategory === 'donations'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            📦 Donation Centers
          </button>
        </div>
      </div>
    </div>
  );
};
