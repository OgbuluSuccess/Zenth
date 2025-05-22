import React, { useState, useEffect } from 'react';
import config from '../../config';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { getToken } from '../../services/authService'; // Import getToken function

const UserManagement = () => {
  const { user } = useAuth(); // Get user from context
  const token = getToken(); // Get token directly from authService
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For main page errors
  const [modalError, setModalError] = useState(null); // For modal errors
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUserData, setEditingUserData] = useState(null);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true,
  });

  useEffect(() => {
    // Debug token and user role
    console.log('Token available:', !!token);
    console.log('Current user role:', user?.role);
    
    const fetchUsers = async () => {
      setLoading(true); // Set loading true when we begin fetching
      setError(null);
      try {
        // Make the API request with the correct base URL
        console.log('Making API request to http://localhost:5000/api/users/admin/all');
        const response = await axios.get(`${config.apiUrl}/users/admin/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Log the full response for debugging
        console.log('API Response:', response);
        console.log('API Response Status:', response.status);
        console.log('API Response Data:', response.data);
        
        // Check if response.data.data exists, otherwise try response.data
        if (response.data && response.data.success && Array.isArray(response.data.users)) {
          console.log('Setting users from response.data.users, count:', response.data.users.length);
          setUsers(response.data.users);
        } else if (response.data && response.data.success && response.data.count === 0) {
          console.log('API returned success but zero users');
          setUsers([]); 
        } else {
          console.error('Unexpected response format or error in response:', response.data);
          setError(response.data?.message || 'Unexpected API response format. Check console for details.');
          setUsers([]);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response,
          request: err.request
        });
        
        if (err.response) {
          // The request was made and the server responded with a status code outside of 2xx range
          setError(`Server error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
        } else if (err.request) {
          // The request was made but no response was received
          setError('No response received from server. Please check if the server is running.');
        } else {
          // Something happened in setting up the request
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false); // Ensure loading is set to false after try/catch
      }
    };

    if (token) {
      fetchUsers();
    } else {
      // If no token, not an error, but we shouldn't be loading.
      // Could also set an error message here if a token is expected but missing.
      setLoading(false);
      // setError('Authentication token not found. Cannot fetch users.'); // Optional: inform user
    }
  }, [token, user?.role]);

  // Function is now used in openEditUserModal
  // eslint-disable-next-line no-unused-vars
  const handleEditUser = (userId) => {
    const userToEdit = users.find(u => u._id === userId);
    if (userToEdit) {
      openEditUserModal(userToEdit);
    } else {
      console.error('User not found:', userId);
    }
  };

  const handleDeleteUser = async (userId) => {
    console.log('Attempting to delete user:', userId);
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await axios.delete(`${config.apiUrl}/users/admin/delete/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.success) {
          console.log('User deleted successfully:', userId);
          // Refetch users to update the list
          setLoading(true);
          const fetchResponse = await axios.get(`${config.apiUrl}/users/admin/all`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (fetchResponse.data && fetchResponse.data.success && Array.isArray(fetchResponse.data.users)) {
            setUsers(fetchResponse.data.users);
          }
          setLoading(false);
          alert('User deleted successfully!');
        } else {
          console.error('API responded failure on delete:', response.data);
          alert(response.data?.message || 'Failed to delete user. API returned unsuccessful status.');
        }
      } catch (err) {
        console.error('Caught error during user delete API call:', err);
        if (err.response && err.response.data && err.response.data.message) {
          alert(`Error: ${err.response.data.message}`);
        } else {
          alert('An unexpected error occurred while deleting the user. Please try again.');
        }
      }
    }
  };
  
  const toggleUserStatus = async (userId, currentStatus) => {
    console.log(`Attempting to toggle status for user: ${userId}, current status: ${currentStatus}`);
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        const response = await axios.patch(`${config.apiUrl}/users/admin/toggle-active/${userId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.success) {
          console.log('User status toggled successfully:', response.data.user);
          // Refetch users to update the list and reflect the change
          setLoading(true);
          const fetchResponse = await axios.get(`${config.apiUrl}/users/admin/all`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (fetchResponse.data && fetchResponse.data.success && Array.isArray(fetchResponse.data.users)) {
            setUsers(fetchResponse.data.users);
          }
          setLoading(false);
          alert(`User ${action}d successfully!`);
        } else {
          console.error('API responded failure on status toggle:', response.data);
          alert(response.data?.message || `Failed to ${action} user. API returned unsuccessful status.`);
        }
      } catch (err) {
        console.error('Caught error during user status toggle API call:', err);
        if (err.response && err.response.data && err.response.data.message) {
          alert(`Error: ${err.response.data.message}`);
        } else {
          alert(`An unexpected error occurred while trying to ${action} the user. Please try again.`);
        }
      }
    }
  };

  const openAddUserModal = () => {
    setNewUserData({ name: '', email: '', password: '', role: 'user', isActive: true }); // Reset form
    setModalError(null); // Clear modal error when opening
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const openEditUserModal = (user) => {
    // Ensure all expected fields are present, especially isActive
    setEditingUserData({ 
      _id: user._id,
      name: user.name || '', 
      email: user.email || '', 
      role: user.role || 'user', 
      isActive: typeof user.isActive === 'boolean' ? user.isActive : true 
    });
    setModalError(null); // Clear previous modal errors
    setIsEditUserModalOpen(true);
  };

  const closeEditUserModal = () => {
    setIsEditUserModalOpen(false);
    setEditingUserData(null); // Clear editing data on close
  };

  const handleNewUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddNewUser = async (e) => {
    e.preventDefault();
    setModalError(null); // Clear previous modal errors
    try {
      console.log('Submitting new user:', newUserData);
      const response = await axios.post(`${config.apiUrl}/users/admin/create`, newUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        console.log('User created successfully:', response.data.user);
        // Add the new user to the local state or refetch all users
        // For simplicity, refetching all users:
        // Need to make fetchUsers accessible or define it outside useEffect if called from here
        // A common pattern is to pass a callback to the modal to refresh data on the parent
        // For now, we'll just update the users array directly if the new user is returned in response
        // setUsers(prevUsers => [...prevUsers, response.data.user]); 
        // OR, more robustly, trigger a full refetch:
        setLoading(true); // Show loading state while refetching
        const fetchResponse = await axios.get(`${config.apiUrl}/users/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (fetchResponse.data && fetchResponse.data.success && Array.isArray(fetchResponse.data.users)) {
          setUsers(fetchResponse.data.users);
        }
        setLoading(false);

        closeAddUserModal();
        // Optionally, show a success message (e.g., toast)
        alert('User created successfully!'); 
      } else {
        setModalError(response.data?.message || 'Failed to create user. Unknown error.');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setModalError(err.response.data.message);
      } else {
        setModalError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUserData || !editingUserData._id) {
      setModalError('No user data available for update. Cannot submit.');
      return;
    }
    setModalError(null); // Clear previous modal errors

    const { _id, name, email, role, isActive } = editingUserData;
    const updatePayload = { name, email, role, isActive };

    try {
      console.log(`Attempting to update user: ${_id} with payload:`, updatePayload);
      const response = await axios.put(`${config.apiUrl}/users/admin/update/${_id}`, updatePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        console.log('User updated successfully via API:', response.data.user);
        setLoading(true);
        const fetchResponse = await axios.get(`${config.apiUrl}/users/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (fetchResponse.data && fetchResponse.data.success && Array.isArray(fetchResponse.data.users)) {
          console.log('Refetched users successfully.');
          setUsers(fetchResponse.data.users);
        } else {
          console.error('Failed to refetch users or unexpected format after update.');
          setError('Could not refresh user list after update. Please refresh manually.');
        }
        setLoading(false);
        closeEditUserModal();
        alert('User updated successfully!');
      } else {
        console.error('API responded failure on update:', response.data);
        setModalError(response.data?.message || 'Failed to update user. API returned unsuccessful status.');
      }
    } catch (err) {
      console.error('Caught error during user update API call:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setModalError(err.response.data.message);
      } else if (err.request) {
        setModalError('No response from server during update. Please check network.');
      } else {
        setModalError('An unexpected error occurred while updating the user. Please try again.');
      }
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <p className="text-xl text-gray-500">Loading users...</p>
          {/* You can add a spinner here */}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="bg-white shadow-sm mb-6 rounded-lg">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
              <p className="text-sm text-gray-500">View and manage platform users.</p>
            </div>
            <button 
              onClick={openAddUserModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add New User
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal 
        isOpen={isAddUserModalOpen} 
        onClose={closeAddUserModal} 
        userData={newUserData} 
        onChange={handleNewUserChange} 
        onSubmit={handleAddNewUser} 
        modalError={modalError} 
      />

      {/* Edit User Modal */}
      <EditUserModal 
        isOpen={isEditUserModalOpen} 
        onClose={closeEditUserModal} 
        userData={editingUserData} 
        onChange={handleEditUserChange} 
        onSubmit={handleUpdateUser} 
        modalError={modalError} 
      />

      {/* Main Content Area */}
      <div className="w-full px-6 pb-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
            <p><span className="font-semibold">Error:</span> {error}</p>
            <p className="text-sm">Please check the console for more details and verify your API endpoint and permissions.</p>
          </div>
        )}

        {(!loading && users.length === 0 && !error) && (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-500 text-lg mb-4">No users found.</p>
            <p className="text-gray-500 mb-4">
              This could be because:
              <ul className="list-disc list-inside mt-2 text-left max-w-md mx-auto">
                <li>There are no users in the database yet</li>
                <li>The API endpoint for fetching users is not correctly configured</li>
                <li>Your user account doesn't have admin privileges</li>
              </ul>
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Current user role: {user?.role || 'Unknown'}</p>
              <p className="text-sm text-gray-500 mb-4">Token available: {token ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}

        {users.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status (Active)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{u.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{u.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' || u.role === 'superadmin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button onClick={() => toggleUserStatus(u._id, u.isActive)} className={`text-xs ${u.isActive === false ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'}`} title={u.isActive === false ? 'Activate User' : 'Deactivate User'}>
                            {u.isActive === false ? <i className="fas fa-toggle-on"></i> : <i className="fas fa-toggle-off"></i>}
                            <span className="sr-only">{u.isActive === false ? 'Activate' : 'Deactivate'}</span>
                          </button>
                          {/* Edit Button (Corrected) */}
                          <button 
                            onClick={() => openEditUserModal(u)} 
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 border border-blue-500 rounded hover:bg-blue-100 transition-colors text-xs"
                            title="Edit User"
                          >
                            Edit
                          </button>
                          {/* Delete Button (Re-added) */}
                          <button 
                            onClick={() => handleDeleteUser(u._id)} 
                            className="text-red-600 hover:text-red-900 px-2 py-1 border border-red-500 rounded hover:bg-red-100 transition-colors text-xs"
                            title="Delete User"
                          >
                            Delete
                          </button>
                        </div>{/* This closes the flex div from line 303 */}
                      </td>{/* This closes the actions td from line 302 */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const AddUserModal = ({ isOpen, onClose, userData, onChange, onSubmit, modalError }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New User</h3>
        {modalError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
            <p>{modalError}</p>
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" id="name" value={userData.name} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" value={userData.email} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" id="password" value={userData.password} onChange={onChange} required minLength="6" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select name="role" id="role" value={userData.role} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              {/* <option value="superadmin">Super Admin</option> */}{/* Superadmin creation might be restricted */}
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" name="isActive" checked={userData.isActive} onChange={onChange} className="form-checkbox h-5 w-5 text-blue-600" />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
          <div className="flex items-center justify-end mt-6">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditUserModal = ({ isOpen, onClose, userData, onChange, onSubmit, modalError }) => {
  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit User</h3>
        {modalError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
            <p>{modalError}</p>
          </div>
        )}
        {/* Modal-specific error display can be added here if needed */}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" id="edit-name" value={userData.name} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="edit-email" value={userData.email} onChange={onChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">Role</label>
            <select name="role" id="edit-role" value={userData.role} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              {/* <option value="superadmin">Super Admin</option> */}
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" name="isActive" checked={userData.isActive} onChange={onChange} className="form-checkbox h-5 w-5 text-blue-600" />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
          <div className="flex items-center justify-end mt-6">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
