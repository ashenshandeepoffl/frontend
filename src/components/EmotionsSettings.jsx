import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminEmotionSettings = () => {
  const [emotionSettings, setEmotionSettings] = useState([]);
  const [resources, setResources] = useState([]);
  const [newSetting, setNewSetting] = useState({
    emotion: '',
    music_resource_ids: [],
    mp4_resource_ids: [],
    color_resource_ids: [],
    wallpaper_command: '',
    music_command: '',
    comments: ''
  });

  // Fetch resources and emotion settings with JWT token
  useEffect(() => {
    const fetchResources = async () => {
      const token = localStorage.getItem('access_token'); // Get JWT token from localStorage
      try {
        const res = await axios.get('http://localhost:5000/api/resources', {
          headers: {
            Authorization: `Bearer ${token}` // Add Authorization header with token
          }
        });
        setResources(res.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    const fetchEmotionSettings = async () => {
      const token = localStorage.getItem('access_token'); // Get JWT token from localStorage
      try {
        const res = await axios.get('http://localhost:5000/api/emotion-settings', {
          headers: {
            Authorization: `Bearer ${token}` // Add Authorization header with token
          }
        });
        setEmotionSettings(res.data);
      } catch (error) {
        console.error('Error fetching emotion settings:', error);
      }
    };

    fetchResources();
    fetchEmotionSettings();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSetting({
      ...newSetting,
      [name]: value
    });
  };

  // Handle multiple selection change
  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedOptions = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setNewSetting({
      ...newSetting,
      [name]: selectedOptions
    });
  };

  // Handle form submission (add or update emotion setting)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token'); // Get JWT token from localStorage
    try {
      await axios.post(
        'http://localhost:5000/api/emotion-settings',
        newSetting,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header with token
            'Content-Type': 'application/json'
          }
        }
      );
      const updatedSettings = await axios.get('http://localhost:5000/api/emotion-settings', {
        headers: {
          Authorization: `Bearer ${token}` // Add Authorization header with token
        }
      });
      setEmotionSettings(updatedSettings.data);
      setNewSetting({
        emotion: '',
        music_resource_ids: [],
        mp4_resource_ids: [],
        color_resource_ids: [],
        wallpaper_command: '',
        music_command: '',
        comments: ''
      });
    } catch (error) {
      console.error('Error saving emotion setting:', error);
    }
  };

  // Handle delete emotion setting
  const handleDelete = async (id) => {
    const token = localStorage.getItem('access_token'); // Get JWT token from localStorage
    try {
      await axios.delete(`http://localhost:5000/api/emotion-settings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Add Authorization header with token
        }
      });
      const updatedSettings = await axios.get('http://localhost:5000/api/emotion-settings', {
        headers: {
          Authorization: `Bearer ${token}` // Add Authorization header with token
        }
      });
      setEmotionSettings(updatedSettings.data);
    } catch (error) {
      console.error('Error deleting emotion setting:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-10">Manage Emotion Settings</h2>

      {/* Form for adding new emotion settings */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-6">Add New Emotion Setting</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Emotion</label>
            <select
              name="emotion"
              value={newSetting.emotion}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Emotion</option>
              <option value="happiness">Happiness</option>
              <option value="neutral">Neutral</option>
              <option value="sadness">Sadness</option>
              <option value="anger">Anger</option>
              <option value="surprise">Surprise</option>
              <option value="disgust">Disgust</option>
              <option value="fear">Fear</option>
            </select>
          </div>

          {/* Music Selection */}
          <div>
            <label className="block text-gray-700 mb-1">Music (MP3)</label>
            <select
              name="music_resource_ids"
              multiple
              value={newSetting.music_resource_ids}
              onChange={handleMultiSelectChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {resources
                .filter((resource) => resource.type === 'mp3')
                .map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name}
                  </option>
                ))}
            </select>
          </div>

          {/* MP4 (Video) Selection */}
          <div>
            <label className="block text-gray-700 mb-1">Videos (MP4)</label>
            <select
              name="mp4_resource_ids"
              multiple
              value={newSetting.mp4_resource_ids}
              onChange={handleMultiSelectChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {resources
                .filter((resource) => resource.type === 'mp4')
                .map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Image (Color) Selection */}
          <div>
            <label className="block text-gray-700 mb-1">Colors (Images)</label>
            <select
              name="color_resource_ids"
              multiple
              value={newSetting.color_resource_ids}
              onChange={handleMultiSelectChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {resources
                .filter((resource) => resource.type === 'image')
                .map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Wallpaper Command */}
          <div>
            <label className="block text-gray-700 mb-1">Wallpaper Change Command</label>
            <input
              type="text"
              name="wallpaper_command"
              value={newSetting.wallpaper_command}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Music Command */}
          <div>
            <label className="block text-gray-700 mb-1">Music Playing Command</label>
            <input
              type="text"
              name="music_command"
              value={newSetting.music_command}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Comments */}
          <div>
            <label className="block text-gray-700 mb-1">Comments</label>
            <textarea
              name="comments"
              value={newSetting.comments}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
        </div>

        <button type="submit" className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md">
          Add Emotion Setting
        </button>
      </form>

      {/* Emotion Settings List */}
      <h3 className="text-2xl font-semibold mb-4">Existing Emotion Settings</h3>
      <table className="min-w-full bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-left text-sm">
            <th className="py-4 px-6">Emotion</th>
            <th className="py-4 px-6">Music</th>
            <th className="py-4 px-6">Videos</th>
            <th className="py-4 px-6">Colors</th>
            <th className="py-4 px-6">Wallpaper Command</th>
            <th className="py-4 px-6">Music Command</th>
            <th className="py-4 px-6">Comments</th>
            <th className="py-4 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {emotionSettings.map((setting) => (
            <tr key={setting.id} className="border-b text-sm">
              <td className="py-4 px-6">{setting.emotion}</td>
              <td className="py-4 px-6">{setting.music_resource_ids.join(', ')}</td>
              <td className="py-4 px-6">{setting.mp4_resource_ids.join(', ')}</td>
              <td className="py-4 px-6">{setting.color_resource_ids.join(', ')}</td>
              <td className="py-4 px-6">{setting.wallpaper_command}</td>
              <td className="py-4 px-6">{setting.music_command}</td>
              <td className="py-4 px-6">{setting.comments}</td>
              <td className="py-4 px-6">
                <button onClick={() => handleDelete(setting.id)} className="text-red-500">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEmotionSettings;
