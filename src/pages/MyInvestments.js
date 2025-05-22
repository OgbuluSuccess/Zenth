import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart } from 'react-icons/fi';
import api from '../services/apiService';

const MyInvestments = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Function to fetch user investments
  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/investments/me');
      setInvestments(data.data.investments);
      setSummary(data.data.summary);
      setError(null);
    } catch (err) {
      console.error('Error fetching investments:', err);
      setError('Failed to load investments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch investments on component mount
  useEffect(() => {
    fetchInvestments();
  }, []);

  // View investment details
  const handleViewDetails = (investment) => {
    setSelectedInvestment(investment);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedInvestment(null);
  };

  // Complete investment (withdraw funds)
  const handleCompleteInvestment = async (investmentId) => {
    if (!window.confirm('Are you sure you want to withdraw this investment? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.patch(`/investments/${investmentId}/complete`);
      
      // Update investments list with status, end date, and current value
      setInvestments(investments.map(inv => {
        if (inv._id === investmentId) {
          return { 
            ...inv, 
            status: 'completed', 
            endDate: new Date(),
            currentValue: data.data.finalValue || inv.currentValue
          };
        }
        return inv;
      }));
      
      // Update summary data
      if (summary) {
        setSummary({
          ...summary,
          totalProfit: (summary.totalProfit || 0) + (data.data.profit || 0)
        });
      }
      
      // Show success message
      alert(`Investment successfully withdrawn. $${(data.data.profit || 0).toFixed(2)} profit added to your wallet.`);
      
      // Close modal if open
      if (showModal && selectedInvestment?._id === investmentId) {
        handleCloseModal();
      }
      
      // Refresh data to get updated wallet balance
      fetchInvestments();
    } catch (err) {
      console.error('Error completing investment:', err);
      alert(err.response?.data?.message || 'Failed to withdraw investment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Loading your investments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Investments
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Track and manage your investment portfolio
          </p>
        </div>

        {/* Investment Summary */}
        {summary && (
          <div className="mb-10">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Invested */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary rounded-md p-3">
                      <FiDollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Invested
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {formatCurrency(summary.totalInvested)}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Value */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <FiPieChart className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Current Value
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {formatCurrency(summary.totalCurrentValue)}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Profit */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${summary.totalProfit >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-md p-3`}>
                      {summary.totalProfit >= 0 ? (
                        <FiTrendingUp className="h-6 w-6 text-white" />
                      ) : (
                        <FiTrendingDown className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Profit
                        </dt>
                        <dd>
                          <div className={`text-lg font-medium ${summary.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(summary.totalProfit)}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profit Percentage */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${summary.totalProfitPercentage >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-md p-3`}>
                      {summary.totalProfitPercentage >= 0 ? (
                        <FiTrendingUp className="h-6 w-6 text-white" />
                      ) : (
                        <FiTrendingDown className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Profit Percentage
                        </dt>
                        <dd>
                          <div className={`text-lg font-medium ${summary.totalProfitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {summary.totalProfitPercentage.toFixed(2)}%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Investments Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your Investment Portfolio
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {investments.length} investments in total
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Investment Plan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Value
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit/Loss
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investments.length > 0 ? (
                    investments.map((investment) => (
                      <tr key={investment._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {investment.plan.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {investment.plan.riskLevel} Risk
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(investment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(investment.currentValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${investment.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(investment.profit)} ({investment.profitPercentage.toFixed(2)}%)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(investment.startDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {investment.endDate ? formatDate(investment.endDate) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(investment.status)}`}>
                            {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(investment)}
                            className="text-primary hover:text-primary-dark mr-3"
                          >
                            View
                          </button>
                          {investment.status === 'active' && (
                            <button
                              onClick={() => handleCompleteInvestment(investment._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Withdraw
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        You don't have any investments yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Details Modal */}
      {showModal && selectedInvestment && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Investment Details
                    </h3>
                    <div className="mt-4">
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Plan Name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {selectedInvestment.plan.name}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Risk Level</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {selectedInvestment.plan.riskLevel}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Amount Invested</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {formatCurrency(selectedInvestment.amount)}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Current Value</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {formatCurrency(selectedInvestment.currentValue)}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Profit/Loss</dt>
                        <dd className={`mt-1 text-sm ${selectedInvestment.profit >= 0 ? 'text-green-600' : 'text-red-600'} sm:mt-0 sm:col-span-2`}>
                          {formatCurrency(selectedInvestment.profit)} ({selectedInvestment.profitPercentage.toFixed(2)}%)
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {formatDate(selectedInvestment.startDate)}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedInvestment.status)}`}>
                            {selectedInvestment.status.charAt(0).toUpperCase() + selectedInvestment.status.slice(1)}
                          </span>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedInvestment.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => handleCompleteInvestment(selectedInvestment._id)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Withdraw Investment
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInvestments;
