import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatNumber } from '../../utils/formatters';
import { FiArrowUp, FiArrowDown, FiPieChart, FiTrendingUp, FiDollarSign, 
         FiFilter, FiDownload, FiEdit, FiCheck, FiX, FiUser } from 'react-icons/fi';

const TransactionManager = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    userId: '',
    startDate: '',
    endDate: ''
  });
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    netFlow: 0
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });

      const response = await api.get('/transactions/admin/all', { params });
      console.log('Transactions response:', response.data);

      if (response.data && response.data.data) {
        setTransactions(response.data.data);
        setTotalPages(response.data.totalPages || 1);
      }
      
      // Fetch transaction stats
      const statsResponse = await api.get('/transactions/admin/stats', { params: {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      }});
      
      if (statsResponse.data && statsResponse.data.data) {
        setStats(statsResponse.data.data.summary);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for filter dropdown
  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      if (response.data && response.data.data) {
        setUsers(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when applying filters
    fetchTransactions();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: '',
      status: '',
      userId: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Update transaction status
  const updateTransactionStatus = async (id, status, adminNote) => {
    try {
      const response = await api.patch(`/transactions/admin/status/${id}`, {
        status,
        adminNote
      });
      
      if (response.data && response.data.success) {
        // Update the transaction in the list
        setTransactions(prev => 
          prev.map(t => t._id === id ? { ...t, status, adminNote } : t)
        );
        
        // Close edit mode
        setEditingTransaction(null);
        
        // Refresh transaction stats
        fetchTransactions();
      }
    } catch (err) {
      console.error('Error updating transaction status:', err);
      alert('Failed to update transaction status. Please try again.');
    }
  };

  // Export transactions as CSV
  const exportTransactions = () => {
    // Create CSV content
    const headers = ['Date', 'User', 'Type', 'Amount', 'Status', 'Reference', 'Description', 'Admin Note'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        new Date(t.createdAt).toLocaleDateString(),
        t.user?.name || t.user?.email || 'Unknown',
        t.type,
        t.amount,
        t.status,
        t.reference,
        `"${t.description?.replace(/"/g, '""') || ''}"`,,
        `"${t.adminNote?.replace(/"/g, '""') || ''}"`
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `admin_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, [currentPage]); // Refetch when page changes

  return (
    <div className="bg-gray-50 min-h-screen p-6 content-container">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
          <button 
            onClick={exportTransactions}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            <FiDownload className="mr-2" /> Export CSV
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Deposits</h3>
            <p className="text-2xl font-bold text-green-600">${formatNumber(stats.totalDeposits || 0)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Withdrawals</h3>
            <p className="text-2xl font-bold text-red-600">${formatNumber(stats.totalWithdrawals || 0)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Net Flow</h3>
            <p className={`text-2xl font-bold ${stats.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${formatNumber(stats.netFlow || 0)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiFilter className="mr-2" /> Filters
            </h2>
            <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Types</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="investment">Investment</option>
                  <option value="profit">Profit</option>
                  <option value="referral">Referral</option>
                  <option value="bonus">Bonus</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                <select
                  name="userId"
                  value={filters.userId}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Users</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-5 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchTransactions}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Reference</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                        <div className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <FiUser className="mr-2 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {transaction.user?.name || transaction.user?.email || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-2 ${
                            transaction.type === 'deposit' ? 'bg-green-100 text-green-600' : 
                            transaction.type === 'withdrawal' ? 'bg-red-100 text-red-600' : 
                            transaction.type === 'investment' ? 'bg-blue-100 text-blue-600' : 
                            transaction.type === 'profit' ? 'bg-purple-100 text-purple-600' : 
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {transaction.type === 'deposit' ? (
                              <FiArrowUp className="h-4 w-4" />
                            ) : transaction.type === 'withdrawal' ? (
                              <FiArrowDown className="h-4 w-4" />
                            ) : transaction.type === 'investment' ? (
                              <FiPieChart className="h-4 w-4" />
                            ) : transaction.type === 'profit' ? (
                              <FiTrendingUp className="h-4 w-4" />
                            ) : (
                              <FiDollarSign className="h-4 w-4" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {transaction.description}
                        {transaction.adminNote && (
                          <div className="text-xs text-gray-400 mt-1">
                            Admin note: {transaction.adminNote}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`text-sm font-medium ${
                          transaction.type === 'deposit' || transaction.type === 'profit' ? 'text-green-600' : 
                          transaction.type === 'withdrawal' ? 'text-red-600' : 
                          'text-blue-600'
                        }`}>
                          {(transaction.type === 'deposit' || transaction.type === 'profit') ? '+' : 
                           transaction.type === 'withdrawal' ? '-' : ''}
                          ${formatNumber(transaction.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {editingTransaction === transaction._id ? (
                          <select
                            className="rounded-md border border-gray-300 px-2 py-1 text-xs"
                            defaultValue={transaction.status}
                            onChange={(e) => {
                              const adminNote = prompt('Enter admin note for this status change:', transaction.adminNote || '');
                              if (adminNote !== null) { // Only update if not cancelled
                                updateTransactionStatus(transaction._id, e.target.value, adminNote);
                              }
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            transaction.status === 'failed' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {transaction.reference}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {editingTransaction === transaction._id ? (
                          <button
                            onClick={() => setEditingTransaction(null)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingTransaction(transaction._id)}
                            className="p-1 text-primary hover:text-primary-dark"
                          >
                            <FiEdit className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && transactions.length > 0 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {[...Array(totalPages).keys()].map(page => {
                const pageNumber = page + 1;
                // Only show a few pages around the current page
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNumber
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } border border-gray-300`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  // Show ellipsis
                  return <span key={pageNumber}>...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionManager;
