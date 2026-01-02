export const StreakBadge = ({ streak }) => {
  return (
    <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-8 shadow-xl mb-6">
      <div className="flex items-center justify-center mb-4">
        <span className="text-6xl">🔥</span>
      </div>
      <div className="text-center">
        <div className="text-white text-5xl font-bold mb-2">{streak}</div>
        <div className="text-white text-lg font-semibold">Day Streak</div>
        <div className="text-orange-100 text-sm mt-2">Keep the momentum going!</div>
      </div>
    </div>
  );
};
