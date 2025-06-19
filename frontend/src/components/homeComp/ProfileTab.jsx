import React, { useState, useRef } from 'react';
import { User, LogOut, Upload } from 'lucide-react';

function ProfileTab({ currentUser, onLogout, onProfileUpdate }) {
  const [image, setImage] = useState(currentUser.image || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size (max 5MB)
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      setUploadError('Please upload an image file (max 5MB)');
      setIsUploading(false);
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'jd1booaw'); // Replace with your preset
    formData.append('cloud_name', 'drm99u4ud'); // Replace with your cloud name

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/drm99u4ud/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
      }

      const imageUrl = data.secure_url;

      const token = localStorage.getItem('token');
      const updateResponse = await fetch('http://localhost:3000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image: imageUrl }),
      });
      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(updateData.message || 'Failed to update profile picture');
      }

      setImage(imageUrl);
      setUploadSuccess('Profile picture updated successfully!');
      if (onProfileUpdate) {
        onProfileUpdate(updateData.user);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="h-auto bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <img
              src={image || null}
              alt={currentUser.name}
              className="w-full h-full rounded-full object-cover border-4 border-pink-100"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150?text=Profile';
              }}
            />
            <button
              onClick={triggerFileInput}
              disabled={isUploading}
              className={`absolute bottom-0 right-0 p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Change Profile Picture"
            >
              <Upload className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{currentUser.name}</h1>
          <p className="text-gray-600 text-lg">{currentUser.college}</p>
        </div>

        {/* Upload Feedback */}
        {uploadSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
            {uploadSuccess}
          </div>
        )}
        {uploadError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
            {uploadError}
          </div>
        )}

        {/* Profile Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900 text-base">{currentUser.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <p className="text-gray-900 text-base">{currentUser.age}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <p className="text-gray-900 text-base">{currentUser.bio || 'No bio added yet'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
            <div className="flex flex-wrap gap-2">
              {currentUser.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          className="w-full mt-8 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default ProfileTab;