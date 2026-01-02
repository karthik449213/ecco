const FAKE_LEADERBOARD = [
  { rank: 1, name: 'EcoWarrior', avatar: '🌍', points: 12450, streak: 89, change: '↑' },
  { rank: 2, name: 'GreenGuardian', avatar: '🌿', points: 11200, streak: 76, change: '↑' },
  { rank: 3, name: 'PlanetSaver', avatar: '♻️', points: 10890, streak: 65, change: '→' },
  { rank: 4, name: 'EcoNinja', avatar: '🥋', points: 9750, streak: 58, change: '↓' },
  { rank: 5, name: 'GreenHero', avatar: '💚', points: 8920, streak: 48, change: '↑' },
];

export const Leaderboard = ({ currentUserPoints, currentUserRank }) => {
  const getRankMedal = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
  };

  const getRankBgClass = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 border-2 border-yellow-400';
      case 2:
        return 'bg-gray-100 border-2 border-gray-400';
      case 3:
        return 'bg-orange-100 border-2 border-orange-400';
      default:
        return 'bg-blue-100 border-2 border-blue-300';
    }
  };

  const getChangeColor = (change) => {
    if (change === '↑') return 'text-green-600 bg-green-50';
    if (change === '↓') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <span className="text-2xl sm:text-3xl">🏆</span>
        <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold text-primary-800">Global Leaderboard</h3>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {FAKE_LEADERBOARD.map((user) => (
          <div
            key={user.rank}
            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-colors"
          >
            {/* Rank Badge */}
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${getRankBgClass(user.rank)}`}>
              {getRankMedal(user.rank)}
            </div>

            {/* User Info */}
            <div className="flex-1 flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4 min-w-0">
              <span className="text-lg sm:text-2xl flex-shrink-0">{user.avatar}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-800 text-sm sm:text-base truncate">{user.name}</p>
                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 flex-shrink-0">
                  🔥 <span className="hidden xs:inline">{user.streak}</span><span className="inline xs:hidden">{user.streak}</span>
                </p>
              </div>
            </div>

            {/* Points + Change */}
            <div className="flex items-center gap-1 sm:gap-3 ml-2 flex-shrink-0">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${getChangeColor(user.change)}`}>
                {user.change}
              </div>
              <p className="font-bold text-primary-700 text-right text-sm sm:text-base lg:w-28 w-20">
                {user.points.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Your Rank Section */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-xl sm:rounded-2xl border-2 border-green-300 mb-3 sm:mb-4">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600 font-semibold">Your Rank</p>
          <p className="text-2xl sm:text-3xl font-bold text-primary-700 mt-1 sm:mt-2">#{currentUserRank}</p>
        </div>
        <div className="text-center border-l-2 border-green-300">
          <p className="text-xs sm:text-sm text-gray-600 font-semibold">Your Points</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-700 mt-1 sm:mt-2">{currentUserPoints.toLocaleString()}</p>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-cyan-50 rounded-xl sm:rounded-2xl border-2 border-cyan-300">
        <span className="text-xl sm:text-2xl flex-shrink-0">💡</span>
        <p className="text-xs sm:text-sm text-cyan-900 font-semibold">
          Keep pushing! You're in the top {Math.floor(Math.random() * 20) + 1}% of eco warriors 🌱
        </p>
      </div>
    </div>
  );
};
