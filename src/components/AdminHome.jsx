import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import axios from 'axios';
import AdminResourceManagement from './AdminResourceManagement';
import ModelManagement from './ModelManagement';
import EmotionsSettings from './EmotionsSettings';
import SystemLogs from './SystemLogs';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newMessages, setNewMessages] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminName, setAdminName] = useState('Admin'); // Placeholder for admin name
  const navigate = useNavigate();

  // Fetch unread messages for notifications
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('http://localhost:5000/api/unread-messages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
        setNewMessages(response.data.length);
      } catch (error) {
        console.error('Error fetching notifications', error);
      }
    };
    fetchUnreadMessages();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

   // Function to handle logout
   const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  // Mark notifications as read and go to contact messages page
  const handleNotificationClick = (messageId) => {
    const token = localStorage.getItem('access_token');
    axios.post(`http://localhost:5000/api/mark-message-read/${messageId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setNotifications(notifications.filter((msg) => msg.id !== messageId));
        setNewMessages(newMessages - 1);
        navigate('/contact-messages');  // Redirect to Contact Messages page
      })
      .catch((error) => console.error('Error marking message as read', error));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/admin-home" className="text-xl font-semibold">Admin Dashboard</Link>
          <div className="flex items-center">
            <button onClick={toggleDarkMode} className="text-gray-600 dark:text-gray-300 mx-4">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-gray-600 dark:text-gray-300 mx-4"
              >
                Notifications {newMessages > 0 && <span className="text-red-500">({newMessages})</span>}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10">
                  {notifications.length > 0 ? (
                    notifications.map((message) => (
                      <div
                        key={message.id}
                        className="px-4 py-2 border-b cursor-pointer"
                        onClick={() => handleNotificationClick(message.id)}
                      >
                        <p className="font-bold">{message.name}</p>
                        <p>{message.message.slice(0, 30)}...</p>
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-2">No new messages</p>
                  )}
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="text-red-500 mx-4">Logout</button>
          </div>
        </div>
      </nav>

      {/* Welcome Message */}
      <div className="bg-blue-500 text-white text-center py-6">
        <h1 className="text-3xl font-bold">Welcome, {adminName}!</h1>
        <p className="mt-2">Manage the dashboard and stay on top of resources, models, and settings.</p>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto py-6">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeTab === 'logs' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}
          >
            System Logs
          </button>
          <button
            onClick={() => setActiveTab('EmotionsSettings')}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeTab === 'EmotionsSettings' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}
          >
            Emotions Settings
          </button>
          <button
            onClick={() => setActiveTab('contactMessages')}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeTab === 'contactMessages' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}
          >
            User Messages
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeTab === 'resources' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}
          >
            Resources
          </button>
          <button
            onClick={() => setActiveTab('Model')}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeTab === 'Model' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}
          >
            Model
          </button>
          
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'contactMessages' && <ContactMessages />}
      {activeTab === 'resources' && <AdminResourceManagement />}
      {activeTab === 'Model' && <ModelManagement />}
      {activeTab === 'EmotionsSettings' && <EmotionsSettings />}
      {activeTab === 'logs' && <SystemLogs />}
    </div>
  );
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    total_users: 0,
    active_sessions: 0,
    system_uptime: '0 week 0 day 0 hour 0 minute',
    errors_logged: 0,
  });
  
  const [startTime, setStartTime] = useState(null);

  // Function to calculate uptime based on the start time
  const calculateUptime = (startTime) => {
    const currentTime = new Date().getTime() / 1000; // Current time in seconds
    const uptimeSeconds = currentTime - startTime;

    const weeks = Math.floor(uptimeSeconds / (7 * 24 * 60 * 60));
    const days = Math.floor((uptimeSeconds % (7 * 24 * 60 * 60)) / (24 * 60 * 60));
    const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);

    return `${weeks} week ${days} day ${hours} hour ${minutes} minute`;
  };

  // Fetch analytics data and start time from the backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Assuming you're using JWT tokens
        const response = await axios.get('http://localhost:5000/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set metrics
        setMetrics(response.data);
        setStartTime(response.data.start_time); // Assuming the backend provides start_time
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  // Update system uptime every 60 seconds (live updating)
  useEffect(() => {
    if (startTime) {
      const intervalId = setInterval(() => {
        setMetrics((prevMetrics) => ({
          ...prevMetrics,
          system_uptime: calculateUptime(startTime),
        }));
      }, 10000); // Update uptime every minute

      return () => clearInterval(intervalId); // Clear interval on component unmount
    }
  }, [startTime]);

  const dashboardAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 200,
  });

  return (
    <animated.div style={dashboardAnimation} className="container mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-10">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold">Total Users</h3>
          <p className="text-3xl text-blue-500 font-bold">{metrics.total_users}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold">Active Sessions</h3>
          <p className="text-3xl text-blue-500 font-bold">{metrics.active_sessions}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold">System Uptime</h3>
          <p className="text-3xl text-blue-500 font-bold">{metrics.system_uptime}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold">Errors Logged</h3>
          <p className="text-3xl text-blue-500 font-bold">{metrics.errors_logged}</p>
        </div>
      </div>
    </animated.div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);  // Initialize filtered users
      } catch (error) {
        setError('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  // Handle search query
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
      )
    );
  };

  // Handle edit click - open the edit form
  const handleEditClick = (user) => {
    setEditingUser(user);
    setNewUsername(user.username);
    setNewEmail(user.email);
    setNewRole(user.userRole);
  };

  // Handle update user
  const handleUpdateUser = async (userId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(
        `http://localhost:5000/api/profile/update/${userId}`,
        { username: newUsername, email: newEmail, role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(user => (user.id === userId ? { ...user, username: newUsername, email: newEmail, userRole: newRole } : user)));
      setFilteredUsers(filteredUsers.map(user => (user.id === userId ? { ...user, username: newUsername, email: newEmail, userRole: newRole } : user)));
      setEditingUser(null);  // Close the editing form
    } catch (error) {
      setError('Failed to update user');
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://localhost:5000/api/delete-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-10">User Management</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by username or email"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Users Table */}
      <table className="min-w-full bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-left text-sm">
            <th className="py-4 px-6">ID</th>
            <th className="py-4 px-6">Username</th>
            <th className="py-4 px-6">Email</th>
            <th className="py-4 px-6">Role</th>
            <th className="py-4 px-6">Created At</th>
            <th className="py-4 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b text-sm">
              <td className="py-4 px-6">{user.id}</td>
              <td className="py-4 px-6">{user.username}</td>
              <td className="py-4 px-6">{user.email}</td>
              <td className="py-4 px-6">{user.userRole}</td>
              <td className="py-4 px-6">{user.created_at}</td>
              <td className="py-4 px-6">
                <button onClick={() => handleEditClick(user)} className="text-blue-500 mr-4">Edit</button>
                <button onClick={() => handleDeleteUser(user.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form (Popup or inline editing) */}
      {editingUser && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Edit User</h3>
          <div className="mb-4">
            <label className="block mb-1">Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            onClick={() => handleUpdateUser(editingUser.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Update
          </button>
          <button
            onClick={() => setEditingUser(null)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
  
    // In ContactMessages component
useEffect(() => {
  const fetchMessages = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:5000/api/contact-messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Messages fetched:', response.data); // Log the response
      setMessages(response.data);
      setFilteredMessages(response.data); // Initialize filtered messages
    } catch (error) {
      console.error('Error fetching messages', error);
    }
  };
  fetchMessages();
}, []);

  
    // Handle status update
    const updateStatus = async (messageId, newStatus) => {
      const token = localStorage.getItem('access_token');
      try {
        await axios.post(
          `http://localhost:5000/api/update-message-status/${messageId}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, status: newStatus } : msg)));
        setFilteredMessages(filteredMessages.map((msg) => (msg.id === messageId ? { ...msg, status: newStatus } : msg)));
      } catch (error) {
        console.error('Error updating message status', error);
      }
    };
  
    // Handle message deletion
    const deleteMessage = async (messageId) => {
      const token = localStorage.getItem('access_token');
      try {
        await axios.delete(`http://localhost:5000/api/delete-message/${messageId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(messages.filter((msg) => msg.id !== messageId));
        setFilteredMessages(filteredMessages.filter((msg) => msg.id !== messageId));
      } catch (error) {
        console.error('Error deleting message', error);
      }
    };
  
    // Handle search
    const handleSearch = (event) => {
      setSearchQuery(event.target.value);
      if (event.target.value === '') {
        setFilteredMessages(messages);
      } else {
        const query = event.target.value.toLowerCase();
        setFilteredMessages(
          messages.filter(
            (msg) =>
              msg.name.toLowerCase().includes(query) || msg.email.toLowerCase().includes(query)
          )
        );
      }
    };
  
    // Open modal to view message details
    const viewMessage = (message) => {
      setSelectedMessage(message);
      setShowModal(true);
    };
  
    // Close modal
    const closeModal = () => {
      setShowModal(false);
      setSelectedMessage(null);
    };
  
    return (
      <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold text-center mb-10">Contact Us Messages</h2>
  
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by name or email"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
  
        {/* Messages Table */}
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-left text-sm">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Message</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Created At</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((msg) => (
              <tr key={msg.id} className="border-b text-sm">
                <td className="py-4 px-6">{msg.id}</td>
                <td className="py-4 px-6">{msg.name}</td>
                <td className="py-4 px-6">{msg.email}</td>
                <td className="py-4 px-6">{msg.message.slice(0, 30)}...</td>
  
                {/* Status Dropdown */}
                <td className="py-4 px-6">
                  <select
                    value={msg.status || 'Unread'}
                    onChange={(e) => updateStatus(msg.id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Unread">Unread</option>
                    <option value="Read">Read</option>
                    <option value="Replied">Replied</option>
                  </select>
                </td>
  
                <td className="py-4 px-6">{msg.created_at}</td>
                <td className="py-4 px-6 flex space-x-2">
                  <button
                    onClick={() => viewMessage(msg)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {/* Modal for viewing the full message */}
        {showModal && selectedMessage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">Message from {selectedMessage.name}</h3>
              <p className="mb-4"><strong>Email:</strong> {selectedMessage.email}</p>
              <p className="mb-4"><strong>Message:</strong> {selectedMessage.message}</p>
              <button onClick={closeModal} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

export default Admin;
