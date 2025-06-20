import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import assets from '../chat-app-assets/chat-app-assets/assets';
import { AuthContext } from '../../context/AuthContext';

function ProfilePage() {
  const { authUser, updateProfile, checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || '');
  const [bio, setBio] = useState(authUser?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);

    try {
      if (!selectImg) {
        await updateProfile({ fullName: name.trim(), bio });
        await checkAuth();
        toast.success("Profile updated");
        navigate('/');
        return;
      }

      const reader = new FileReader();

      reader.onload = async () => {
        const base64Image = reader.result;
        await updateProfile({ profilePic: base64Image, fullName: name.trim(), bio });
        await checkAuth();
        toast.success("Profile updated");
        navigate('/');
      };

      reader.onerror = () => {
        toast.error("Failed to read image file");
        setLoading(false);
      };

      reader.readAsDataURL(selectImg);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const displayImage = selectImg
    ? URL.createObjectURL(selectImg)
    : authUser?.profilePic || assets.avatar_icon;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${assets.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Blur overlay */}
      <div className="absolute inset-0 z-0 backdrop-blur-lg bg-black/10"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full p-4 text-white">
        <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl p-8 max-w-2xl w-full flex flex-col md:flex-row gap-8">
          {/* Left: Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
            <h3 className="text-xl font-semibold">Profile Details</h3>

            <label htmlFor="avatar" className="flex flex-col items-center gap-2 cursor-pointer">
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={(e) => setSelectedImg(e.target.files[0])}
                hidden
              />
              <img
                src={displayImage}
                alt="Avatar"
                className="h-24 w-24 rounded-full object-cover border-2 border-white shadow-md"
              />
              <span className="text-sm text-white/70">Upload Profile Image</span>
            </label>

            <input
              type="text"
              required
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 rounded-md bg-white/20 placeholder-white/60 text-white outline-none"
            />

            <textarea
              placeholder="Write profile bio..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="p-2 h-24 rounded-md bg-white/20 placeholder-white/60 text-white outline-none resize-none"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className={`py-2 px-4 bg-purple-600 hover:bg-purple-700 transition rounded-md font-medium ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
          </form>

          {/* Right: Profile Preview */}
          <div className="flex justify-center items-center flex-1">
            <img
              src={displayImage}
              alt="Profile Preview"
              className="h-48 w-48 md:h-64 md:w-64 object-contain rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
