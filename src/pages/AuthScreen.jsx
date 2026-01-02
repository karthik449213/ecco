import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuth } from '../lib/mockAuth';
import { PrimaryButton } from '../components/PrimaryButton';

export const AuthScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      alert('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = mockAuth.login(email.trim(), password.trim());
    
    if (result.success) {
      console.log('[AuthScreen] Login successful');
      navigate('/home');
    } else {
      alert(result.error);
    }
    
    setIsLoading(false);
  };

  const quickLogin = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-accent-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-primary-800 text-center mb-2">
          EcoSnap
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign in to track your eco actions
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          <PrimaryButton
            label={isLoading ? 'Signing in...' : 'Sign In'}
            onClick={handleLogin}
            disabled={isLoading}
          />
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="w-full text-sm text-primary-600 font-semibold hover:text-primary-700"
          >
            {showCredentials ? '▼' : '▶'} View Demo Accounts
          </button>
          
          {showCredentials && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-500 mb-3">Click any user to auto-fill credentials:</p>
              
              {mockAuth.users.map((user, index) => (
                <button
                  key={user.id}
                  onClick={() => quickLogin(user.email, user.password)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-primary-600 font-semibold">🔥 {user.streak} days</p>
                      <p className="text-xs text-gray-500">{user.totalActions} actions</p>
                    </div>
                  </div>
                </button>
              ))}
              
              <p className="text-xs text-gray-400 mt-3 text-center">
                Password for all: <span className="font-mono font-semibold">password123</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
