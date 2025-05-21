import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../lib/types/config';
import Footer from './footer';

export default function Authnav() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // Redirect to login if user is not authenticated
        navigate('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return null; // Don't render anything while checking auth state
  }

  return (
    <>
        <header className="flex justify-between items-center p-6 bg-blue-600 text-white shadow">
          <h1 className="text-2xl font-bold">StudyMate Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </header>
      {/* Footer */}
    </>
  );
}
