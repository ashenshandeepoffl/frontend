import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEdit, FaUpload } from 'react-icons/fa'; // Importing icons

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({
    name: '',
    type: '',
    category: '',
    file: null,
  });
  const [editingResource, setEditingResource] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch resources from the backend
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/resources');
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };
    fetchResources();
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    setNewResource({ ...newResource, file: e.target.files[0] });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource({ ...newResource, [name]: value });
  };

  // Handle resource submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', newResource.name);
    formData.append('type', newResource.type);
    formData.append('category', newResource.category);
    formData.append('file', newResource.file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload-resource', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResources([...resources, response.data]); // Update resource list
      setNewResource({ name: '', type: '', category: '', file: null }); // Reset form
    } catch (error) {
      console.error('Error uploading resource:', error);
    }
    setLoading(false);
  };

  // Handle resource deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/resources/${id}`);
      setResources(resources.filter((resource) => resource.id !== id));
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  // Handle resource disable/enable
  const toggleResource = async (id, isDisabled) => {
    try {
      await axios.put(`http://localhost:5000/api/resources/${id}`, {
        disabled: !isDisabled,
      });
      setResources(
        resources.map((resource) =>
          resource.id === id ? { ...resource, disabled: !isDisabled } : resource
        )
      );
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  // Handle editing resource
  const handleEdit = (resource) => {
    setEditingResource(resource);
  };

  // Handle update resource
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/resources/${editingResource.id}`, editingResource);
      setResources(
        resources.map((resource) =>
          resource.id === editingResource.id ? editingResource : resource
        )
      );
      setEditingResource(null); // Clear the editing state
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-10">Manage Resources</h2>

      {/* Form for adding resources */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-6">Upload New Resource</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={newResource.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={newResource.type}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Type</option>
              <option value="mp3">MP3</option>
              <option value="mp4">MP4</option>
              <option value="image">Image</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={newResource.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Category</option>
              <option value="happiness">Happiness</option>
              <option value="neutral">Neutral</option>
              <option value="sadness">Sadness</option>
              <option value="anger">Anger</option>
              <option value="surprise">Surprise</option>
              <option value="disgust">Disgust</option>
              <option value="fear">Fear</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">File</label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
          disabled={loading}
        >
          {loading ? 'Uploading...' : <FaUpload className="mr-2" />} Upload
        </button>
      </form>

      {/* Resources List */}
      <h3 className="text-2xl font-semibold mb-4">Uploaded Resources</h3>
      <table className="min-w-full bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-left text-sm">
            <th className="py-4 px-6">Name</th>
            <th className="py-4 px-6">Type</th>
            <th className="py-4 px-6">Category</th>
            <th className="py-4 px-6">Uploaded At</th>
            <th className="py-4 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id} className="border-b text-sm">
              <td className="py-4 px-6">{resource.name}</td>
              <td className="py-4 px-6">{resource.type}</td>
              <td className="py-4 px-6">{resource.category}</td>
              <td className="py-4 px-6">{new Date(resource.created_at).toLocaleString()}</td>
              <td className="py-4 px-6 flex space-x-4">
                <button
                  onClick={() => handleEdit(resource)}
                  className="text-blue-500 hover:underline"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="text-red-500 hover:underline"
                >
                  <FaTrashAlt /> Delete
                </button>
                <button
                  onClick={() => toggleResource(resource.id, resource.disabled)}
                  className={`${
                    resource.disabled ? 'text-gray-500' : 'text-green-500'
                  } hover:underline`}
                >
                  {resource.disabled ? 'Enable' : 'Disable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Editing Resource */}
      {editingResource && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Edit Resource</h3>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={editingResource.name}
              onChange={(e) =>
                setEditingResource({ ...editingResource, name: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Category</label>
            <select
              value={editingResource.category}
              onChange={(e) =>
                setEditingResource({ ...editingResource, category: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="happiness">Happiness</option>
              <option value="neutral">Neutral</option>
              <option value="sadness">Sadness</option>
              <option value="anger">Anger</option>
              <option value="surprise">Surprise</option>
              <option value="disgust">Disgust</option>
              <option value="fear">Fear</option>
            </select>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Update Resource
          </button>
          <button
            onClick={() => setEditingResource(null)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminResources;
