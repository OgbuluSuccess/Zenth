import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiUsers, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import api from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const MoneyTransferManager = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentTransfers, setRecentTransfers] = useState([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const { data } = await api.get('/users/admin/all');
        console.log('Users data received:', data);
        const usersWithProperIds = (data.users || []).map(user => ({
          ...user,
          id: user._id || user.id // Ensure we have id property that matches MongoDB's _id
        }));
        setUsers(usersWithProperIds);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUser || !amount) {
      setError('Please select a user and enter an amount');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Debug the selected user and request payload
      const userForTransfer = users.find(u => u.id === selectedUser);
      console.log('Selected user for transfer:', userForTransfer);
      console.log('Request payload:', {
        userId: selectedUser,
        amount: parseFloat(amount),
        description: description || 'Admin deposit'
      });
      
      const { data } = await api.post('/users/admin/send-money', {
        userId: selectedUser,
        amount: parseFloat(amount),
        description: description || 'Admin deposit'
      });
      console.log('Money transfer response:', data);
      setRecentTransfers(prev => [{
        id: Date.now().toString(),
        user: userForTransfer ? userForTransfer.name : 'User',
        amount: parseFloat(amount),
        description: description || 'Admin deposit',
        timestamp: new Date()
      }, ...prev.slice(0, 9)]); // Keep only the 10 most recent transfers
      
      setSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setSelectedUser('');
        setAmount('');
        setDescription('');
      }, 3000);
      
    } catch (err) {
      console.error('Error sending money:', err);
      setError(err.response?.data?.message || 'Failed to send money. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Money Transfer Manager</h1>
            <p className="text-gray-600">Send money to user accounts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transfer Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiDollarSign className="mr-2 text-blue-500" />
                Send Money to User
              </h2>
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <div className="flex">
                    <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                  <div className="flex">
                    <FiCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Money sent successfully!</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search">
                    Search Users
                  </label>
                  <input
                    type="text"
                    id="search"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user">
                    Select User
                  </label>
                  <select
                    id="user"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required
                  >
                    <option value="">Select a user</option>
                    {loadingUsers ? (
                      <option disabled>Loading users...</option>
                    ) : (
                      filteredUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                    Amount ($)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    id="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Reason for transfer"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiDollarSign className="mr-2" />
                        Send Money
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Recent Transfers */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiUsers className="mr-2 text-purple-500" />
                Recent Transfers
              </h2>
              
              {recentTransfers.length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                  No recent transfers
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransfers.map(transfer => (
                    <div key={transfer.id} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{transfer.user}</p>
                          <p className="text-sm text-gray-500">{transfer.description}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(transfer.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-green-600 font-bold">
                          +${transfer.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyTransferManager;
