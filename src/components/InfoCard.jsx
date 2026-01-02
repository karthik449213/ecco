export const InfoCard = ({ title, value, subtitle, iconName }) => {
  const getIcon = () => {
    switch (iconName) {
      case 'flame':
        return '🔥';
      case 'leaf':
        return '🍃';
      default:
        return '📊';
    }
  };

  return (
    <div className="flex-1 bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center mb-2">
        <span className="text-3xl mr-2">{getIcon()}</span>
        <span className="text-gray-600 text-sm font-medium">{title}</span>
      </div>
      <div className="text-3xl font-bold text-primary-800 mb-1">{value}</div>
      <div className="text-gray-500 text-xs">{subtitle}</div>
    </div>
  );
};
