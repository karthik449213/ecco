import { useNavigate } from 'react-router-dom';

const achievements = [
  {
    id: 1,
    title: 'First Step',
    description: 'Logged your first eco action',
    icon: '🌱',
    unlocked: true,
    progress: 100,
  },
  {
    id: 2,
    title: '7 Day Streak',
    description: 'Maintained a 7-day streak',
    icon: '🔥',
    unlocked: false,
    progress: 42,
  },
  {
    id: 3,
    title: 'Eco Warrior',
    description: 'Completed 50 eco actions',
    icon: '⚔️',
    unlocked: false,
    progress: 20,
  },
  {
    id: 4,
    title: 'Tree Hugger',
    description: 'Planted or saved 10 trees',
    icon: '🌳',
    unlocked: false,
    progress: 30,
  },
  {
    id: 5,
    title: 'Recycling Master',
    description: 'Recycled 100 items',
    icon: '♻️',
    unlocked: false,
    progress: 15,
  },
  {
    id: 6,
    title: 'Community Leader',
    description: 'Inspired 5 friends to join',
    icon: '👥',
    unlocked: false,
    progress: 0,
  },
];

export const AchievementsScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-accent-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/home')}
            className="text-primary-700 font-semibold mr-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-primary-800">Achievements</h1>
        </div>

        {/* Stats Summary */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm opacity-90">Total Achievements</p>
              <p className="text-4xl font-bold">1 / 6</p>
            </div>
            <span className="text-6xl">🏆</span>
          </div>
        </div>

        {/* Achievement List */}
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-2xl p-6 shadow-md ${
                achievement.unlocked ? 'border-2 border-yellow-400' : 'opacity-75'
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <span className={`text-5xl ${!achievement.unlocked && 'grayscale'}`}>
                  {achievement.icon}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary-800">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <span className="text-2xl">✅</span>
                )}
              </div>

              {/* Progress Bar */}
              {!achievement.unlocked && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
