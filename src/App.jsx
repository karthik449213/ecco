import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { AuthScreen } from './pages/AuthScreen';
import { HomeScreen } from './pages/HomeScreen';
import { CameraScreen } from './pages/CameraScreen';
import { PreviewScreen } from './pages/PreviewScreen';
import { SuccessScreen } from './pages/SuccessScreen';
import { MapScreen } from './pages/MapScreen';
import { AchievementsScreen } from './pages/AchievementsScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/camera" element={<CameraScreen />} />
        <Route path="/preview" element={<PreviewScreen />} />
        <Route path="/success" element={<SuccessScreen />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/achievements" element={<AchievementsScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
