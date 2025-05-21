import React from 'react';
import DeleteAccount from '../components/DeleteAccount';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import app from '../lib/types/config';

const auth = getAuth(app);

export default function Settings() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Account Information</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Danger Zone</h2>
              <p className="text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <DeleteAccount />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 