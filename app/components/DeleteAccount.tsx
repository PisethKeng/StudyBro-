import React, { useState } from 'react';
import { getAuth, deleteUser } from 'firebase/auth';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import app from '../lib/types/config';

const auth = getAuth(app);
const db = getFirestore(app);

export default function DeleteAccount() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const user = auth.currentUser;

      if (!user) {
        throw new Error('No user is currently signed in');
      }

      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', user.uid));

      // Delete user authentication
      await deleteUser(user);

      // Navigate to login page after successful deletion
      navigate('/auth/login');
    } catch (err: any) {
      console.error('Error deleting account:', err);
      setError(err.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors duration-200"
      >
        Delete Account
      </button>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
            </p>
            
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 