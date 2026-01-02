import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuth } from '../lib/mockAuth';
import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { StreakBadge } from '../components/StreakBadge';

export const HomeScreen = () => {
  const navigate = useNavigate();
  const [streak, setStreak] = useState(null);
  const [totalActions, setTotalActions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  const loadStats = useCallback(async () => {
    console.log('[HomeScreen] Loading user stats...');

    // Check if user is authenticated
    if (!mockAuth.isAuthenticated()) {
      console.warn('[HomeScreen] No authenticated user, redirecting to /auth');
      navigate('/auth');
      return;
    }

    const user = mockAuth.getCurrentUser();
    const stats = mockAuth.getUserStats();
    
    console.log('[HomeScreen] User:', user.email);
    setEmail(user.email);
    setStreak(stats.streak);
    setTotalActions(stats.totalActions);
  }, [navigate]);

  useEffect(() => {
    loadStats().finally(() => setLoading(false));
  }, [loadStats]);

  const handleSignOut = useCallback(async () => {
    try {
      console.log('[HomeScreen] Signing out...');
      mockAuth.logout();
      console.log('[HomeScreen] Logout successful');
      navigate('/welcome');
    } catch (err) {
      console.error('[HomeScreen] Logout failed:', err);
      navigate('/welcome');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-accent-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-gray-600 text-lg">Welcome back</h2>
            <h1 className="text-4xl font-bold text-primary-800">EcoSnap</h1>
            {email && <p className="text-gray-500 text-sm mt-1">{email}</p>}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-white rounded-lg shadow-sm text-primary-700 font-semibold hover:shadow-md transition-all"
            >
              Sign out
            </button>
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌿</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
            <span className="ml-4 text-gray-600">Loading your stats…</span>
          </div>
        ) : (
          <>
            <StreakBadge streak={streak ?? 0} />

            <div className="flex gap-4 mb-8">
              <InfoCard
                title="Current Streak"
                value={`${streak ?? 0} days`}
                subtitle="Keep it going"
                iconName="flame"
              />
              <InfoCard
                title="Eco Actions"
                value={`${totalActions ?? 0}`}
                subtitle="All-time"
                iconName="leaf"
              />
            </div>
          </>
        )}

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-6">
          <h3 className="text-2xl font-bold text-primary-800 mb-3">
            Snap Eco Action
          </h3>
          <p className="text-gray-600 mb-6">
            Capture a quick proof of your eco-friendly move and grow your streak.
          </p>
          <PrimaryButton
            label="Snap Eco Action"
            onClick={() => navigate('/camera')}
          />
        </div>

        {/* Map Card */}
        <button
          onClick={() => navigate('/map')}
          className="w-full bg-white rounded-3xl p-6 shadow-lg flex items-center justify-between hover:shadow-xl transition-all mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🗺️</span>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-bold text-primary-800">
                Find Recycling Centers
              </h4>
              <p className="text-gray-500 text-sm">
                Discover nearby eco-friendly locations
              </p>
            </div>
          </div>
          <span className="text-2xl text-gray-400">›</span>
        </button>

        {/* Achievements Card */}
        <button
          onClick={() => navigate('/achievements')}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 shadow-lg flex items-center justify-between hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">🏆</span>
            <div className="text-left text-white">
              <h4 className="text-lg font-bold">View Achievements</h4>
              <p className="text-sm opacity-90">Track your progress</p>
            </div>
          </div>
          <span className="text-2xl text-white">›</span>
        </button>
      </div>
    </div>
  );
};
