import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';

export const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A7D7C5] via-[#C5F0E3] to-[#E0F7FA] flex flex-col">
      <div className="flex-1 flex flex-col justify-between px-6 py-12">
        {/* Hero Text */}
        <div className="text-center mt-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-4">
            Snap. Drop.<br />Save the Planet.
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Turn real-world eco actions into streaks
          </p>
        </div>

        {/* Illustration Section */}
        <div className="flex justify-center items-center gap-8 my-12">
          {/* Person 1 - Recycling */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-4xl">♻️</span>
            </div>
            <div className="w-16 h-24 bg-green-400 rounded-t-full"></div>
          </div>

          {/* Person 2 - Reusable Cup */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-4xl">☕</span>
            </div>
            <div className="w-16 h-24 bg-green-400 rounded-t-full"></div>
          </div>

          {/* Person 3 - Planting */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-4xl">🌱</span>
            </div>
            <div className="w-16 h-24 bg-green-400 rounded-t-full"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <PrimaryButton
            label="Get Started"
            onClick={() => navigate('/auth')}
          />
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-white text-primary-700 font-semibold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
