import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboardNew = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Dashboard data states
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalInvestments: 0,
    totalTransactions: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [investmentPerformance, setInvestmentPerformance] = useState([]);
  
  // Chart data states
  const [userChartData, setUserChartData] = useState({
    labels: [],
    datasets: []
  });
  const [investmentChartData, setInvestmentChartData] = useState({
    labels: [],
    datasets: []
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const apiBaseUrl = 'http://localhost:5000/api';
        const headers = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

        // Fetch all data in parallel for better performance
        // Using the correct API endpoints based on backend routes
        const [
          usersResponse,
          investmentStatsResponse,
          transactionStatsResponse,
          recentUsersResponse,
          recentTransactionsResponse,
          investmentPlansResponse
        ] = await Promise.all([
          axios.get(`${apiBaseUrl}/users/admin/all`, headers), // Correct admin endpoint for all users
          axios.get(`${apiBaseUrl}/investments/stats/admin`, headers), // Correct path based on investmentRoutes.js
          axios.get(`${apiBaseUrl}/transactions/admin/stats`, headers), // Correct path based on transactionRoutes.js
          axios.get(`${apiBaseUrl}/users/admin/all?limit=5&sort=-createdAt`, headers), // For recent users
          axios.get(`${apiBaseUrl}/transactions/admin/all?limit=5&sort=-createdAt`, headers), // For recent transactions
          axios.get(`${apiBaseUrl}/investment-plans`, headers)
        ]);
        
        // Process users data
        console.log('Users response:', usersResponse);
        
        // Ensure users is always an array before using array methods
        let users = [];
        if (usersResponse.data) {
          if (usersResponse.data.users && Array.isArray(usersResponse.data.users)) {
            // Extract from {success: true, count: X, users: [...]}
            users = usersResponse.data.users;
          } else if (Array.isArray(usersResponse.data.data)) {
            users = usersResponse.data.data;
          } else if (Array.isArray(usersResponse.data)) {
            users = usersResponse.data;
          } else {
            console.warn('Users data is not in expected format:', usersResponse.data);
          }
        }
        
        console.log('Processed users array:', users);
        const activeUsersCount = Array.isArray(users) ? users.filter(user => user.isActive).length : 0;
        
        // Process investment stats
        console.log('Investment stats response:', investmentStatsResponse);
        let investmentStats = {};
        if (investmentStatsResponse.data) {
          if (investmentStatsResponse.data.stats) {
            // Extract from {success: true, stats: {...}}
            investmentStats = investmentStatsResponse.data.stats;
          } else if (investmentStatsResponse.data.data) {
            investmentStats = investmentStatsResponse.data.data;
          } else {
            investmentStats = investmentStatsResponse.data;
          }
        }
        
        // Process transaction stats
        console.log('Transaction stats response:', transactionStatsResponse);
        let transactionStats = {};
        if (transactionStatsResponse.data) {
          if (transactionStatsResponse.data.stats) {
            // Extract from {success: true, stats: {...}}
            transactionStats = transactionStatsResponse.data.stats;
          } else if (transactionStatsResponse.data.data) {
            transactionStats = transactionStatsResponse.data.data;
          } else {
            transactionStats = transactionStatsResponse.data;
          }
        }
        
        // Set overall stats
        setStats({
          totalUsers: users.length,
          activeUsers: activeUsersCount,
          totalInvestments: investmentStats.totalInvestedAmount || 0, // Fixed property name to match API response
          totalTransactions: transactionStats.totalTransactions || transactionStats.total || 0 // Added fallback to 'total' property
        });
        
        // Process recent users
        console.log('Recent users response:', recentUsersResponse);
        let recentUsersData = [];
        if (recentUsersResponse.data) {
          if (recentUsersResponse.data.users && Array.isArray(recentUsersResponse.data.users)) {
            // Extract from {success: true, count: X, users: [...]}
            recentUsersData = recentUsersResponse.data.users;
          } else if (Array.isArray(recentUsersResponse.data.data)) {
            recentUsersData = recentUsersResponse.data.data;
          } else if (Array.isArray(recentUsersResponse.data)) {
            recentUsersData = recentUsersResponse.data;
          } else {
            console.warn('Recent users data is not in expected format:', recentUsersResponse.data);
          }
        }
        
        const formattedRecentUsers = Array.isArray(recentUsersData) ? recentUsersData.map(user => ({
          id: user._id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
          email: user.email,
          registrationDate: new Date(user.createdAt).toLocaleDateString(),
          status: user.isActive ? 'Active' : 'Inactive'
        })) : [];
        setRecentUsers(formattedRecentUsers);
        
        // Process recent transactions
        console.log('Recent transactions response:', recentTransactionsResponse);
        let recentTransactionsData = [];
        if (recentTransactionsResponse.data) {
          if (recentTransactionsResponse.data.transactions && Array.isArray(recentTransactionsResponse.data.transactions)) {
            // Extract from {success: true, count: X, transactions: [...]}
            recentTransactionsData = recentTransactionsResponse.data.transactions;
          } else if (Array.isArray(recentTransactionsResponse.data.data)) {
            recentTransactionsData = recentTransactionsResponse.data.data;
          } else if (Array.isArray(recentTransactionsResponse.data)) {
            recentTransactionsData = recentTransactionsResponse.data;
          } else {
            console.warn('Recent transactions data is not in expected format:', recentTransactionsResponse.data);
          }
        }
        
        const formattedRecentTransactions = Array.isArray(recentTransactionsData) ? recentTransactionsData.map(transaction => {
          const userName = transaction.user ? 
            `${transaction.user.firstName || ''} ${transaction.user.lastName || ''}`.trim() : 
            'Unknown User';
            
          return {
            id: transaction._id,
            user: userName || 'System Transaction',
            type: transaction.type,
            asset: transaction.asset || (transaction.plan ? transaction.plan.name : 'N/A'),
            amount: transaction.amount,
            date: new Date(transaction.createdAt).toLocaleDateString(),
            status: transaction.status
          };
        }) : [];
        setRecentTransactions(formattedRecentTransactions);
        
        // Generate system alerts based on real data
        const currentAlerts = [];
        const pendingTransactionsCount = recentTransactionsData.filter(t => t.status === 'Pending').length;
        if (pendingTransactionsCount > 0) {
          currentAlerts.push({
            id: Date.now() + Math.random(),
            message: `${pendingTransactionsCount} pending transaction(s) require attention.`,
            level: 'warning',
            timestamp: new Date().toLocaleString()
          });
        }
        
        const inactiveUsersCount = users.length - activeUsersCount;
        if (inactiveUsersCount > 0) {
          currentAlerts.push({
            id: Date.now() + Math.random(),
            message: `${inactiveUsersCount} user(s) are currently inactive.`,
            level: 'info',
            timestamp: new Date().toLocaleString()
          });
        }
        
        setAlerts(currentAlerts);
        
        // Process investment performance by plan type
        console.log('Investment plans response:', investmentPlansResponse);
        let plans = [];
        if (investmentPlansResponse.data) {
          if (investmentPlansResponse.data.plans && Array.isArray(investmentPlansResponse.data.plans)) {
            // Extract from {success: true, count: X, plans: [...]}
            plans = investmentPlansResponse.data.plans;
          } else if (Array.isArray(investmentPlansResponse.data.data)) {
            plans = investmentPlansResponse.data.data;
          } else if (Array.isArray(investmentPlansResponse.data)) {
            plans = investmentPlansResponse.data;
          } else {
            console.warn('Investment plans data is not in expected format:', investmentPlansResponse.data);
          }
        }
        
        const investmentsByType = {};
        
        if (Array.isArray(plans)) {
          plans.forEach(plan => {
            const planType = plan.category || (plan.assets && plan.assets.length > 0 ? plan.assets[0].name : 'Other');
            if (!investmentsByType[planType]) {
              investmentsByType[planType] = { totalInvestment: 0, returns: 0, count: 0 };
            }
            investmentsByType[planType].totalInvestment += plan.minimumInvestment || 0; // Or sum of actual investments in this plan
            let returnRate = 0;
            if (plan.expectedReturns && typeof plan.expectedReturns === 'string') {
              const matches = plan.expectedReturns.match(/\d+(\.\d+)?/g);
              if (matches && matches.length > 0) returnRate = parseFloat(matches[0]);
            }
            investmentsByType[planType].returns += returnRate;
            investmentsByType[planType].count += 1;
          });
        }
        
        const formattedPerformance = Object.entries(investmentsByType).map(([type, data]) => ({
          type,
          totalInvestment: data.totalInvestment,
          returns: data.count > 0 ? (data.returns / data.count).toFixed(2) : 0 // Average return rate
        }));
        setInvestmentPerformance(formattedPerformance);
        
        // Generate chart data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const userGrowthData = Array(12).fill(0);
        
        // Only process user data if users is an array
        if (Array.isArray(users)) {
          users.forEach(user => {
            if (user && user.createdAt) {
              const registrationMonth = new Date(user.createdAt).getMonth(); // 0-11 for Jan-Dec
              if (registrationMonth >= 0 && registrationMonth < 12) {
                userGrowthData[registrationMonth]++;
              }
            }
          });
          // Calculate cumulative data
          for (let i = 1; i < 12; i++) userGrowthData[i] += userGrowthData[i-1]; // Cumulative
        } else {
          console.warn('Cannot generate user growth chart: users is not an array');
        }

        setUserChartData({
          labels: months,
          datasets: [{
            label: 'Cumulative Users',
            data: userGrowthData,
            borderColor: '#21d397',
            backgroundColor: 'rgba(33, 211, 151, 0.1)',
            fill: true,
            tension: 0.4
          }]
        });
        
        // Process investment chart data (using investmentPerformance by plan type)
        const planTypes = formattedPerformance.map(p => p.type);
        const totalInvestmentsByPlan = formattedPerformance.map(p => p.totalInvestment);

        setInvestmentChartData({
          labels: planTypes,
          datasets: [
            {
              label: 'Total Investment by Plan Type',
              data: totalInvestmentsByPlan,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showToast(`Failed to load dashboard data: ${error.message}`, 'error');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [showToast]);

  // Chart options
  const userChartOptions = {
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
        }
      }
    }
  };

  const investmentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return formatCurrency(context.parsed.y);
          }
        }
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
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen content-container">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm mb-6 rounded-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome, {user?.name || 'Admin'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <i className="fa fa-search"></i>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 relative">
                  <i className="fa fa-bell"></i>
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">{alerts.length}</span>
                </button>
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* System Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <div className={`flex justify-between items-center p-3 rounded-lg ${
              alerts[0].level === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
              alerts[0].level === 'danger' ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              <div>
                <span className="font-semibold">Alert:</span> {alerts[0].message}
                <span className="ml-2 text-gray-500 text-sm">{alerts[0].timestamp}</span>
              </div>
              <button className={`px-3 py-1 text-sm rounded border ${
                alerts[0].level === 'warning' ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-100' :
                alerts[0].level === 'danger' ? 'border-red-300 text-red-700 hover:bg-red-100' :
                'border-blue-300 text-blue-700 hover:bg-blue-100'
              } transition-colors`}>
                View All Alerts
              </button>
            </div>
          </div>
        )}
        
        {/* Platform Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4 bg-orange-500 rounded-full p-2 text-white">
                <i className="fa fa-users"></i>
              </div>
              <h3 className="text-white text-sm font-medium mb-2">Total Users</h3>
              <p className="text-white text-2xl font-bold mb-4">{formatNumber(stats.totalUsers)}</p>
              <div className="flex items-center">
                {/* Placeholder for dynamic percentage change */}
              </div>
            </div>
          </div>
          
          {/* Active Users Card */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4 bg-orange-500 rounded-full p-2 text-white">
                <i className="fa fa-user-check"></i>
              </div>
              <h3 className="text-white text-sm font-medium mb-2">Active Users</h3>
              <p className="text-white text-2xl font-bold mb-4">{formatNumber(stats.activeUsers)}</p>
              <div className="flex items-center">
                {/* Placeholder for dynamic percentage change */}
              </div>
            </div>
          </div>
          
          {/* Total Investments Card */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4 bg-orange-500 rounded-full p-2 text-white">
                <i className="fa fa-money-bill-wave"></i>
              </div>
              <h3 className="text-white text-sm font-medium mb-2">Total Investments</h3>
              <p className="text-white text-2xl font-bold mb-4">{formatCurrency(stats.totalInvestments)}</p>
              <div className="flex items-center">
                {/* Placeholder for dynamic percentage change */}
              </div>
            </div>
          </div>
          
          {/* Total Transactions Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4 bg-orange-500 rounded-full p-2 text-white">
                <i className="fa fa-exchange-alt"></i>
              </div>
              <h3 className="text-white text-sm font-medium mb-2">Total Transactions</h3>
              <p className="text-white text-2xl font-bold mb-4">{formatNumber(stats.totalTransactions)}</p>
              <div className="flex items-center">
                {/* Placeholder for dynamic percentage change */}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">User Growth</h2>
            </div>
            <div className="p-6">
              <div className="h-80">
                <Line data={userChartData} options={userChartOptions} />
              </div>
            </div>
          </div>
          
          {/* Investment Volume Chart */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Investment Volume</h2>
            </div>
            <div className="p-6">
              <div className="h-80">
                <Bar data={investmentChartData} options={investmentChartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Investment Performance Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Investment Performance</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Investment</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investmentPerformance.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(item.totalInvestment)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.returns}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              item.returns > 15 ? 'bg-green-600' : 
                              item.returns > 8 ? 'bg-blue-600' : 
                              item.returns > 5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${Math.min(item.returns * 4, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Admin Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Management */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-700">Recent Users</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                    View All Users
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentUsers.slice(0, 3).map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                              user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Deactivate</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History (Placeholder or to be expanded) */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium text-gray-700">Latest Activity</h3>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                  View All Transactions
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTransactions.slice(0, 3).map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{transaction.user}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{transaction.type}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(transaction.amount)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div> {/* Close main content (w-full px-4 ...) */}
    </div> // Close component container (bg-gray-50 ...)
  );
};

export default AdminDashboardNew;

