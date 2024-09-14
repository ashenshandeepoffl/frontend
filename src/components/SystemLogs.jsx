import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch logs from the backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/logs');
        setLogs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };
    fetchLogs();
  }, []);

  // Handle clearing logs
  const handleClearLogs = async () => {
    try {
      await axios.post('http://localhost:5000/api/clear-logs');
      setLogs([]);
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-10">System Logs</h2>

      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length === 0 ? (
        <p>No logs available.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <button
            onClick={handleClearLogs}
            className="bg-red-500 text-white px-4 py-2 rounded-md mb-6"
          >
            Clear Logs
          </button>

          <ul className="list-disc pl-6">
            {logs.map((log, index) => (
              <li key={index} className="mb-2 text-sm text-gray-700">
                {log}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;
