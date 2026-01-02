import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';

export const SuccessScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { streak } = location.state || { streak: 1 };

  useEffect(() => {
    // Celebrate animation or confetti could go here
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex flex-col items-center justify-center px-6">
      <div className="text-center mb-12">
        <div className="text-9xl mb-6 animate-bounce">🎉</div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Awesome!
        </h1>
        <p className="text-white text-xl mb-8">
          Your eco action has been logged successfully
        </p>

        <div className="bg-white bg-opacity-20 rounded-3xl p-8 backdrop-blur-sm">
          <div className="text-6xl mb-4">🔥</div>
          <div className="text-6xl font-bold text-white mb-2">{streak}</div>
          <div className="text-white text-2xl font-semibold">Day Streak</div>
          <p className="text-white text-sm mt-3 opacity-90">
            Keep the momentum going!
          </p>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        <PrimaryButton
          label="Back to Home"
          onClick={() => navigate('/home')}
          className="bg-white text-green-600 hover:bg-gray-100"
        />
        <button
          onClick={() => navigate('/camera')}
          className="w-full bg-white bg-opacity-20 text-white font-semibold py-4 px-6 rounded-2xl backdrop-blur-sm hover:bg-opacity-30 transition-all"
        >
          Snap Another
        </button>
      </div>
    </div>
  );
};
