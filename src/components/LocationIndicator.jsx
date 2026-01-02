import './LocationIndicator.css';

export const LocationIndicator = ({ 
  isLocating = false, 
  location = null, 
  permission = 'prompt',
  error = null,
  isLocked = false 
}) => {
  if (permission === 'denied') {
    return (
      <div className="location-indicator denied">
        <div className="location-icon">📍</div>
        <div className="location-content">
          <p className="location-status">Location Denied</p>
          <p className="location-coords">Enable location in settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`location-indicator ${isLocating ? 'locating' : ''} ${isLocked ? 'locked' : ''}`}>
      {/* Animated pulsing rings (only while locating) */}
      {isLocating && (
        <>
          <div className="location-pulse pulse-1"></div>
          <div className="location-pulse pulse-2"></div>
          <div className="location-pulse pulse-3"></div>
        </>
      )}

      {/* GPS Icon */}
      <div className={`location-icon ${isLocating ? 'gps-scanning' : ''} ${isLocked ? 'locked' : ''}`}>
        {isLocating ? '📡' : isLocked ? '🔒' : '📍'}
      </div>

      {/* Location Content */}
      <div className="location-content">
        <p className="location-status">
          {isLocating 
            ? 'Locating...' 
            : isLocked 
            ? 'Location Locked'
            : 'Location Ready'}
        </p>
        <p className="location-coords">
          {isLocating 
            ? 'Acquiring GPS...'
            : location 
            ? `${location.lat.toFixed(4)}°, ${location.lng.toFixed(4)}°`
            : 'Awaiting location'}
        </p>
        {error && <p className="location-error">{error}</p>}
      </div>

      {/* Accuracy indicator */}
      {location && location.accuracy && (
        <div className="location-accuracy">
          <span className={`accuracy-badge ${location.accuracy < 20 ? 'high' : location.accuracy < 50 ? 'medium' : 'low'}`}>
            ±{location.accuracy.toFixed(0)}m
          </span>
        </div>
      )}
    </div>
  );
};
