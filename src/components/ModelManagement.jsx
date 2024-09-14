import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaUpload } from 'react-icons/fa'; // Importing icons

const AdminModels = () => {
  const [models, setModels] = useState([]);
  const [newModel, setNewModel] = useState({
    name: '',
    comments: '',
    file: null,
  });
  const [loading, setLoading] = useState(false);

  // Fetch models from the backend
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/models');
        setModels(response.data);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };
    fetchModels();
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    setNewModel({ ...newModel, file: e.target.files[0] });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModel({ ...newModel, [name]: value });
  };

  // Handle model submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', newModel.name);
    formData.append('comments', newModel.comments);
    formData.append('file', newModel.file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload-model', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setModels([...models, response.data]); // Update model list
      setNewModel({ name: '', comments: '', file: null }); // Reset form
    } catch (error) {
      console.error('Error uploading model:', error);
    }
    setLoading(false);
  };

  // Handle model disable/enable
  const toggleModel = async (id, isDisabled) => {
    try {
      await axios.put(`http://localhost:5000/api/models/${id}`, {
        disabled: !isDisabled,
      });
      setModels(
        models.map((model) =>
          model.id === id ? { ...model, disabled: !isDisabled } : model
        )
      );
    } catch (error) {
      console.error('Error updating model:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-10">Manage Pre-Trained Models</h2>

      {/* Form for uploading models */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-6">Upload New Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={newModel.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Comments</label>
            <textarea
              name="comments"
              value={newModel.comments}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">File</label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              accept=".h5"
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

      {/* Models List */}
      <h3 className="text-2xl font-semibold mb-4">Uploaded Models</h3>
      <table className="min-w-full bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-left text-sm">
            <th className="py-4 px-6">Name</th>
            <th className="py-4 px-6">Comments</th>
            <th className="py-4 px-6">Uploaded At</th>
            <th className="py-4 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr key={model.id} className="border-b text-sm">
              <td className="py-4 px-6">{model.name}</td>
              <td className="py-4 px-6">{model.comments}</td>
              <td className="py-4 px-6">{new Date(model.created_at).toLocaleString()}</td>
              <td className="py-4 px-6 flex space-x-4">
                <button
                  onClick={() => toggleModel(model.id, model.disabled)}
                  className={`${
                    model.disabled ? 'text-gray-500' : 'text-green-500'
                  } hover:underline`}
                >
                  {model.disabled ? 'Enable' : 'Disable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminModels;
