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
    let attempts = 0;
    const maxAttempts = 20;
    
    const initializeMap = () => {
      if (!mapRef.current) {
        console.log('[MapScreen] Map ref not ready');
        return;
      }
      
      if (!window.google || !window.google.maps) {
        attempts++;
        if (attempts < maxAttempts) {
          console.log('[MapScreen] Waiting for Google Maps API...', attempts);
          setTimeout(initializeMap, 500);
        } else {
          console.error('[MapScreen] Google Maps API failed to load');
        }
        return;
      }

      console.log('[MapScreen] Initializing Google Maps...');
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 15,
          center: defaultCenter,
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: true,
          mapTypeId: 'roadmap',
          gestureHandling: 'greedy', // Enable dragging/panning
          scrollwheel: true,
          clickableIcons: true,
        });

        // Add click listener for map
        map.addListener('click', (e) => {
          console.log('[MapScreen] Map clicked at:', e.latLng);
        });

        // Add idle listener for smooth animation completion
        map.addListener('idle', () => {
          console.log('[MapScreen] Map animation complete');
        });

        // Add tilesloaded listener to verify tiles are rendering
        map.addListener('tilesloaded', () => {
          console.log('[MapScreen] ✅ Map tiles loaded successfully');
          console.log('[MapScreen] Map state:', {
            zoom: map.getZoom(),
            center: map.getCenter()?.toJSON(),
            mapType: map.getMapTypeId(),
            tileBounds: map.getBounds()?.toJSON()
          });
        });

        // Add drag listener
        map.addListener('dragstart', () => {
          console.log('[MapScreen] Map drag started');
        });

        map.addListener('drag', () => {
          console.log('[MapScreen] Map dragging...');
        });

        map.addListener('dragend', () => {
          console.log('[MapScreen] Map drag ended');
        });

        // Force initial tile load
        console.log('[MapScreen] Map DOM element ready, tiles should be loading...');
        console.log('[MapScreen] Map container:', {
          offsetWidth: mapRef.current?.offsetWidth,
          offsetHeight: mapRef.current?.offsetHeight
        });

        setGoogleMap(map);
        console.log('[MapScreen] Google Maps initialized successfully');
      } catch (error) {
        console.error('[MapScreen] Error initializing map:', error);
      }
    };

    initializeMap();
  }, []);

  // Update map center when user location changes
  useEffect(() => {
    if (googleMap) {
      // Smooth animation to new location (panTo instead of setCenter)
      googleMap.panTo(userLocation);
      console.log('[MapScreen] Animating map to user location:', userLocation);
    }
  }, [googleMap, userLocation]);

  // Add markers to map
  useEffect(() => {
    if (!googleMap) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker.setMap) {
        marker.setMap(null); // Old API
      } else if (marker.map !== undefined) {
        marker.map = null; // New API
      }
    });
    markersRef.current = [];

    // Check if AdvancedMarkerElement is available
    const hasAdvancedMarkerElement = 
      window.google?.maps?.marker?.AdvancedMarkerElement !== undefined;

    console.log('[MapScreen] Using', hasAdvancedMarkerElement ? 'AdvancedMarkerElement' : 'deprecated Marker API');

    // User location marker
    let userMarker;
    if (hasAdvancedMarkerElement) {
      // Use AdvancedMarkerElement
      const userMarkerElement = document.createElement('div');
      userMarkerElement.innerHTML = '📍';
      userMarkerElement.style.fontSize = '24px';
      userMarkerElement.style.cursor = 'pointer';
      
      userMarker = new window.google.maps.marker.AdvancedMarkerElement({
        position: userLocation,
        map: googleMap,
        title: 'Your Location',
        content: userMarkerElement,
      });
    } else {
      // Fallback to deprecated Marker API
      userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: googleMap,
        title: 'Your Location',
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3B82F6',
          fillOpacity: 0.8,
          strokeColor: '#1F2937',
          strokeWeight: 2,
        },
      });
    }
    markersRef.current.push(userMarker);

    // Add pulsing animation
    let pulseInterval = null;
    if (hasAdvancedMarkerElement && userMarker.content) {
      const userMarkerElement = userMarker.content;
      pulseInterval = setInterval(() => {
        if (userMarkerElement && userMarker.map) {
          userMarkerElement.style.fontSize = 
            userMarkerElement.style.fontSize === '24px' ? '28px' : '24px';
          userMarkerElement.style.filter = 
            userMarkerElement.style.filter === 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' 
              ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))' 
              : 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))';
        }
      }, 800);
    } else if (!hasAdvancedMarkerElement && userMarker.getVisible) {
      pulseInterval = setInterval(() => {
        if (userMarker && userMarker.getVisible?.()) {
          const currentIcon = userMarker.getIcon();
          const newScale = currentIcon.scale === 10 ? 12 : 10;
          userMarker.setIcon({
            ...currentIcon,
            scale: newScale,
          });
        }
      }, 800);
    }

    // Recycling location markers
    filteredLocations.forEach((location, index) => {
      setTimeout(() => {
        let marker;
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="bg-white p-3 rounded max-w-xs">
              <p class="font-bold text-primary-800 text-sm">${location.name}</p>
              <p class="text-xs text-gray-600">${location.type}</p>
            </div>
          `,
        });

        if (hasAdvancedMarkerElement) {
          // Use AdvancedMarkerElement
          const markerContent = document.createElement('div');
          markerContent.style.fontSize = '24px';
          markerContent.style.cursor = 'pointer';
          markerContent.style.textAlign = 'center';
          markerContent.innerHTML = location.icon;
          
          marker = new window.google.maps.marker.AdvancedMarkerElement({
            position: { lat: location.lat, lng: location.lng },
            map: googleMap,
            title: location.name,
            content: markerContent,
          });

          marker.addListener('click', () => {
            infoWindow.open(googleMap, marker);
          });

          markerContent.addEventListener('mouseover', () => {
            markerContent.style.fontSize = '28px';
            markerContent.style.filter = 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))';
          });

          markerContent.addEventListener('mouseout', () => {
            markerContent.style.fontSize = '24px';
            markerContent.style.filter = 'none';
          });
        } else {
          // Fallback to deprecated Marker API
          marker = new window.google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: googleMap,
            title: location.name,
            animation: window.google.maps.Animation.DROP,
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

          marker.addListener('click', () => {
            infoWindow.open(googleMap, marker);
          });

          marker.addListener('mouseover', () => {
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
          });

          marker.addListener('mouseout', () => {
            marker.setAnimation(null);
          });
        }

        markersRef.current.push(marker);
      }, index * 100);
    });

    console.log('[MapScreen] Added', markersRef.current.length, 'markers');

    // Cleanup
    return () => {
      if (pulseInterval) clearInterval(pulseInterval);
      markersRef.current.forEach(marker => {
        if (marker.setMap) {
          marker.setMap(null);
        } else if (marker.map !== undefined) {
          marker.map = null;
        }
      });
    };
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

      // Try high accuracy first
      console.log('[MapScreen] Attempting high-accuracy geolocation...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          console.log('[MapScreen] High-accuracy location obtained:', newLocation);
          setUserLocation(newLocation);
          setLocationPermission('granted');
          setIsLoadingLocation(false);
        },
        (error) => {
          console.warn('[MapScreen] High-accuracy geolocation failed:', error.message);
          
          // If permission denied, don't retry
          if (error.code === error.PERMISSION_DENIED) {
            console.error('[MapScreen] Location permission denied');
            setLocationPermission('denied');
            setIsLoadingLocation(false);
            return;
          }
          
          // If timeout or position unavailable, retry with lower accuracy
          if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
            console.log('[MapScreen] Retrying with network-based location...');
            
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const newLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                console.log('[MapScreen] Network-based location obtained:', newLocation);
                setUserLocation(newLocation);
                setLocationPermission('granted');
                setIsLoadingLocation(false);
              },
              (fallbackError) => {
                console.error('[MapScreen] Fallback geolocation also failed:', fallbackError);
                setLocationPermission('denied');
                setIsLoadingLocation(false);
              },
              {
                enableHighAccuracy: false, // Use network-based location (faster)
                timeout: 10000,
                maximumAge: 300000, // Accept cached location up to 5 minutes old
              }
            );
          } else {
            setIsLoadingLocation(false);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 30000, // Increased to 30 seconds for GPS
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
        <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4 z-[500]">
          <div className="flex flex-wrap gap-2 sm:gap-3 bg-white rounded-full p-2 shadow-lg justify-center">
            <button
              onClick={() => setActiveCategory('bins')}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all text-xs sm:text-base ${
                activeCategory === 'bins'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              🔵 <span className="hidden sm:inline">Recycling Bins</span><span className="sm:hidden">Bins</span>
            </button>
            <button
              onClick={() => setActiveCategory('gardens')}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all text-xs sm:text-base ${
                activeCategory === 'gardens'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              🌳 <span className="hidden sm:inline">Community Gardens</span><span className="sm:hidden">Gardens</span>
            </button>
            <button
              onClick={() => setActiveCategory('donations')}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all text-xs sm:text-base ${
                activeCategory === 'donations'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              📦 <span className="hidden sm:inline">Donation Centers</span><span className="sm:hidden">Donations</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
