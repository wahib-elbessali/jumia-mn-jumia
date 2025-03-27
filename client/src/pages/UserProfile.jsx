import { useState, useEffect } from 'react';
import { fetchUserData, sendOtp, verifyOtp } from '../utils/api';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData();
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSendOtp = async () => {
    try {
      await sendOtp(user.email);
      setOtpSent(true);
      setMessage('OTP sent to your email.');
    } catch (err) {
      setMessage('Error sending OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp(user.email, otp);
      setMessage('Email verified successfully!');
      setUser((prev) => ({ ...prev, isEmailVerified: true }));
      setOtpSent(false);
    } catch (err) {
      setMessage('Invalid or expired OTP.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md text-center">
        <p className="text-gray-600 text-lg">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Profile Settings</h2>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-600 font-medium">Username:</span>
          <span className="text-gray-800 font-semibold">{user.username}</span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-600 font-medium">Email:</span>
          <span className="text-gray-800 font-semibold">{user.email}</span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-600 font-medium">Account Type:</span>
          <span className="text-indigo-600 font-semibold capitalize">{user.role}</span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-600 font-medium">Email Verification:</span>
          <span className={`font-semibold ${user.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
            {user.isEmailVerified ? 'Verified' : 'Not Verified'}
          </span>
        </div>
      </div>

      {!user.isEmailVerified && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <svg 
              className="h-5 w-5 text-yellow-600 mr-3" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-yellow-800 font-semibold">Email Verification Required</h3>
          </div>
          
          <div className="mt-3">
            {!otpSent ? (
              <button
                onClick={handleSendOtp}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Send Verification Code
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  maxLength="6"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <div className="flex items-center">
            <svg
              className={`h-5 w-5 mr-2 ${message.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;