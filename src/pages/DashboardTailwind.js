import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardTailwind = () => {
  const { user } = useAuth();
  
  // Sample user data - in a real app, this would come from your API
  const [userData, setUserData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    accountBalance: 418.43,
    totalInvestment: 3708.00,
    totalReturns: 0.00,
    portfolioValue: 3708.00,
    recentTransactions: [
      { id: 1, type: 'deposit', amount: 500, date: '2025-05-15', status: 'completed' },
      { id: 2, type: 'investment', amount: 1000, date: '2025-05-14', status: 'completed' },
      { id: 3, type: 'withdrawal', amount: 200, date: '2025-05-10', status: 'pending' }
    ],
    notifications: [
      { id: 1, message: 'Your deposit of $500 has been processed', date: '2025-05-19', read: false },
      { id: 2, message: 'New investment opportunity: Tech Growth Fund', date: '2025-05-18', read: true },
      { id: 3, message: 'Your monthly portfolio report is ready', date: '2025-05-17', read: true }
    ]
  });

  // Format number with commas and 2 decimal places
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [2500, 2700, 3000, 3200, 3500, 3708],
        borderColor: '#21d397',
        backgroundColor: 'rgba(33, 211, 151, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        },
        ticks: {
          callback: (value) => `$${value}`
        }
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name || userData.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Investment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {/* Current Balance Card */}
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4 bg-accent rounded-full p-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white text-sm font-medium mb-2">Current Balance</h3>
              <p className="text-white text-2xl font-bold mb-4">${formatNumber(userData.accountBalance)}</p>
              <button className="text-xs text-white bg-transparent hover:bg-white/20 border border-white/50 rounded-full px-4 py-1 transition-colors">
                Add
              </button>
            </div>
          </div>

          {/* Total Profit Card */}
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4 bg-accent rounded-full p-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-white text-sm font-medium mb-2">Total Profit</h3>
              <p className="text-white text-2xl font-bold mb-4">${formatNumber(userData.totalReturns)}</p>
              <button className="text-xs text-white bg-transparent hover:bg-white/20 border border-white/50 rounded-full px-4 py-1 transition-colors">
                Withdraw
              </button>
            </div>
          </div>

          {/* Total Plan Invest Card */}
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4 bg-accent rounded-full p-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-white text-sm font-medium mb-2">Total Plan Invest</h3>
              <p className="text-white text-2xl font-bold mb-4">${formatNumber(userData.totalInvestment)}</p>
              <button className="text-xs text-white bg-transparent hover:bg-white/20 border border-white/50 rounded-full px-4 py-1 transition-colors">
                View
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Portfolio Overview</h2>
                <select className="text-sm border-gray-300 rounded-md">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                  <option>All Time</option>
                </select>
              </div>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <button className="text-sm text-primary hover:text-primary-dark">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {userData.recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${transaction.type === 'deposit' ? 'bg-green-100 text-green-600' : transaction.type === 'withdrawal' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {transaction.type === 'deposit' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : transaction.type === 'withdrawal' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${transaction.type === 'deposit' ? 'text-green-600' : transaction.type === 'withdrawal' ? 'text-red-600' : 'text-blue-600'}`}>
                        {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                        ${formatNumber(transaction.amount)}
                      </p>
                      <p className={`text-xs ${transaction.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Investment Opportunities */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Investment Opportunities</h2>
              <button className="text-sm text-primary hover:text-primary-dark">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Investment Card 1 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3"></div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">Tech Growth Fund</h3>
                  <p className="text-sm text-gray-500 mb-3">High risk • 12% estimated return</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-medium text-gray-700">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <button className="w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-2 text-sm transition-colors">
                    Invest Now
                  </button>
                </div>
              </div>
              
              {/* Investment Card 2 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3"></div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">Sustainable Energy</h3>
                  <p className="text-sm text-gray-500 mb-3">Medium risk • 8% estimated return</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-medium text-gray-700">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <button className="w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-2 text-sm transition-colors">
                    Invest Now
                  </button>
                </div>
              </div>
              
              {/* Investment Card 3 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3"></div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">Global Index Fund</h3>
                  <p className="text-sm text-gray-500 mb-3">Low risk • 5% estimated return</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-medium text-gray-700">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <button className="w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-2 text-sm transition-colors">
                    Invest Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTailwind;
