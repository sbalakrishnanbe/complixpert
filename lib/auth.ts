"use client";

export interface User {
  id: string;
  email: string;
  name: string;
}

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'test@example.com') {
      throw new Error('User already exists');
    }
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    
    return user;
  },

  async signIn(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password !== 'password') {
      throw new Error('Invalid credentials');
    }
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    
    return user;
  },

  signOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userStr = localStorage.getItem('user');
    
    if (isAuthenticated === 'true' && userStr) {
      return JSON.parse(userStr);
    }
    
    return null;
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('isAuthenticated') === 'true';
  }
};