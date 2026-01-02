import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logEcoAction } from '../lib/ecoActions';
import { mockAuth } from '../lib/mockAuth';
import { PrimaryButton } from '../components/PrimaryButton';

export const PreviewScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { photoUrl, photoFile } = location.state || {};
  const [uploading, setUploading] = useState(false);

  const handleConfirm = async () => {
    if (!photoFile) {
      alert('No photo to upload');
      return;
    }

    setUploading(true);
    try {
      console.log('[PreviewScreen] Simulating upload...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Increment streak
      const newStreak = mockAuth.incrementStreak();
      console.log('[PreviewScreen] Upload successful, new streak:', newStreak);
      
      navigate('/success', { state: { streak: newStreak } });
    } catch (err) {
      console.error('[PreviewScreen] Upload failed:', err);
      alert(err?.message || 'Failed to upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRetake = () => {
    navigate('/camera');
  };

  if (!photoUrl) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">No photo available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <img
          src={photoUrl}
          alt="Preview"
          className="max-w-full max-h-full rounded-2xl shadow-2xl"
        />
      </div>

      <div className="p-6 bg-white rounded-t-3xl">
        <h2 className="text-2xl font-bold text-primary-800 mb-2">
          Looking good!
        </h2>
        <p className="text-gray-600 mb-6">
          Confirm your eco action or retake the photo.
        </p>

        <div className="space-y-3">
          <PrimaryButton
            label={uploading ? 'Uploading...' : 'Confirm & Upload'}
            onClick={handleConfirm}
            disabled={uploading}
          />
          <button
            onClick={handleRetake}
            disabled={uploading}
            className="w-full bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-300 transition-all disabled:opacity-50"
          >
            Retake Photo
          </button>
        </div>
      </div>
    </div>
  );
};
