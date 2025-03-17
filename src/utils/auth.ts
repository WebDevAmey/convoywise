
// Mock authentication functions - in a real app, these would connect to a real auth service
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'investor' | 'startup' | 'admin';
  avatar?: string;
}

let currentUser: User | null = null;

export const loginUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      // This is just for demo purposes
      if (email && password) {
        // Create mock user based on email
        const user: User = {
          id: '1',
          name: email.split('@')[0],
          email,
          role: 'investor',
          avatar: '/placeholder.svg'
        };
        
        // Set current user
        currentUser = user;
        
        // Store in localStorage for persistence
        localStorage.setItem('fundforge_user', JSON.stringify(user));
        
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
};

export const registerUser = (
  name: string, 
  email: string, 
  password: string, 
  role: 'investor' | 'startup'
): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      if (name && email && password) {
        // Create user
        const user: User = {
          id: Math.random().toString(36).substring(2, 11),
          name,
          email,
          role,
          avatar: '/placeholder.svg'
        };
        
        // Set current user
        currentUser = user;
        
        // Store in localStorage for persistence
        localStorage.setItem('fundforge_user', JSON.stringify(user));
        
        resolve(user);
      } else {
        reject(new Error('Invalid registration data'));
      }
    }, 800);
  });
};

export const logoutUser = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = null;
      localStorage.removeItem('fundforge_user');
      resolve();
    }, 300);
  });
};

export const getCurrentUser = (): User | null => {
  if (currentUser) return currentUser;
  
  // Check localStorage
  const storedUser = localStorage.getItem('fundforge_user');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  
  return null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
