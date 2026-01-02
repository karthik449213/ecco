// Mock authentication service for development
export const mockAuth = {
  // Dummy users database
  users: [
    {
      id: 'user-001',
      email: 'alice@ecosnap.com',
      password: 'password123',
      username: 'Alice Green',
      streak: 15,
      totalActions: 47,
      achievements: 3,
    },
    {
      id: 'user-002',
      email: 'bob@ecosnap.com',
      password: 'password123',
      username: 'Bob Eco',
      streak: 8,
      totalActions: 32,
      achievements: 2,
    },
    {
      id: 'user-003',
      email: 'carol@ecosnap.com',
      password: 'password123',
      username: 'Carol Nature',
      streak: 23,
      totalActions: 89,
      achievements: 5,
    },
    {
      id: 'user-004',
      email: 'david@ecosnap.com',
      password: 'password123',
      username: 'David Earth',
      streak: 5,
      totalActions: 18,
      achievements: 1,
    },
    {
      id: 'user-005',
      email: 'emma@ecosnap.com',
      password: 'password123',
      username: 'Emma Planet',
      streak: 42,
      totalActions: 156,
      achievements: 7,
    },
  ],

  // Authenticate user with email and password
  login(email, password) {
    const user = this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const session = {
      access_token: `token-${user.id}`,
      refresh_token: `refresh-${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          username: user.username,
        },
      },
    };

    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_session', JSON.stringify(session));
    console.log('[MockAuth] Login successful:', user.email);

    return { success: true, user, session };
  },

  // Check if user is logged in
  isAuthenticated() {
    return !!localStorage.getItem('auth_user');
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  },

  // Get current session
  getSession() {
    const session = localStorage.getItem('auth_session');
    return session ? JSON.parse(session) : null;
  },

  // Logout
  logout() {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_session');
    console.log('[MockAuth] Logged out');
  },

  // Get user stats
  getUserStats() {
    const user = this.getCurrentUser();
    if (!user) {
      return { streak: 0, totalActions: 0, achievements: 0 };
    }
    return {
      streak: user.streak,
      totalActions: user.totalActions,
      achievements: user.achievements,
    };
  },

  // Update user streak (simulate action)
  incrementStreak() {
    const user = this.getCurrentUser();
    if (user) {
      user.streak += 1;
      user.totalActions += 1;
      localStorage.setItem('auth_user', JSON.stringify(user));
      console.log('[MockAuth] Streak incremented:', user.streak);
      return user.streak;
    }
    return 0;
  },
};
