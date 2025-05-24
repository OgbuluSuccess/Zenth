import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import InvestmentCard from '../components/InvestmentCard'; // Import the reusable InvestmentCard
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiAward, FiPieChart, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import api from '../services/api';
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

const DashboardNew = () => {
  const { user, updateUser } = useAuth();
  const [investmentPlans, setInvestmentPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [planError, setPlanError] = useState(null);
  
  // State for real-time data
  const [portfolioData, setPortfolioData] = useState(null);
  const [rewardsData, setRewardsData] = useState(null);
  const [referralsData, setReferralsData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0); // Track wallet balance directly
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState(null);
  
  // App color scheme - keeping this for reference
  const appColors = {
    primary: '#192a56',
    primaryGradient: 'linear-gradient(to right, #192a56, #1c2e59)',
    secondary: '#21d397',
    secondaryGradient: 'linear-gradient(to right, #21d397 0%, #7450fe 100%)',
    textLight: '#ffffff',
    textDark: '#333333',
    accent: '#f7913a',  // Orange accent color from the reference image
    chartColors: {
      bitcoin: '#F7931A',
      ethereum: '#627EEA',
      xrp: '#23292F',
      ltc: '#345D9D',
      zec: '#ECB244'
    }
  };

  // Sample user data - in a real app, this would come from your API
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
    wallet: {
      balance: 0,
      currency: 'USD'
    },
    portfolio: {
      totalInvested: 0,
      totalProfit: 0,
      activeInvestments: 0
    },
    rewards: {
      points: 0,
      level: 'Bronze'
    },
    referrals: {
      count: 0,
      earnings: 0
    },
    recentTransactions: []
  });

  // Market data
  const [marketData, setMarketData] = useState({
    buyPrice: 45678.90,
    sellPrice: 45123.45,
    volume: 2345678,
    change: 2.34,
    marketCap: 876543210,
    supply: 18700000
  });

  // Format number with commas and 2 decimal places
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Helper function to get wallet balance from user object
  const getWalletBalance = (user) => {
    if (!user) return 0;
    
    // Log the user object to see its structure
    console.log('Getting wallet balance from user:', user);
    
    // Check different possible locations for the wallet balance
    if (user.wallet && typeof user.wallet.balance === 'number') {
      return user.wallet.balance;
    }
    
    if (user.walletBalance && typeof user.walletBalance === 'number') {
      return user.walletBalance;
    }
    
    if (user.balance && typeof user.balance === 'number') {
      return user.balance;
    }
    
    // If we have transactions, we might be able to calculate the balance
    if (Array.isArray(user.transactions) && user.transactions.length > 0) {
      // Calculate balance from transactions
      return user.transactions.reduce((total, tx) => {
        if (tx.type === 'deposit' || tx.type === 'credit') {
          return total + (parseFloat(tx.amount) || 0);
        } else if (tx.type === 'withdrawal' || tx.type === 'debit') {
          return total - (parseFloat(tx.amount) || 0);
        }
        return total;
      }, 0);
    }
    
    return 0;
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

  // Crypto data
  const cryptoData = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 45678.90, change: 2.34, volume: 32456789, marketCap: 876543210000, icon: 'bitcoin' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3245.67, change: -1.23, volume: 12345678, marketCap: 387654321000, icon: 'ethereum' },
    { id: 3, name: 'Ripple', symbol: 'XRP', price: 0.78, change: 0.45, volume: 9876543, marketCap: 34567890000, icon: 'xrp' },
    { id: 4, name: 'Litecoin', symbol: 'LTC', price: 156.78, change: -0.67, volume: 5678901, marketCap: 10987654321, icon: 'ltc' },
    { id: 5, name: 'Zcash', symbol: 'ZEC', price: 134.56, change: 1.89, volume: 3456789, marketCap: 1567890123, icon: 'zec' }
  ];

    useEffect(() => {
    const fetchInvestmentPlans = async () => {
      try {
        setLoadingPlans(true);
        // Using our apiService with authentication token
        const response = await api.get('/investment-plans'); 
        // Make sure we're setting an array to investmentPlans
        if (response.data && Array.isArray(response.data)) {
          setInvestmentPlans(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setInvestmentPlans(response.data.data);
        } else {
          console.error('Investment plans response is not in expected format:', response.data);
          setInvestmentPlans([]);
          setPlanError('Received invalid data format from server');
        }
        setPlanError(null);
      } catch (error) {
        console.error("Error fetching investment plans:", error);
        setPlanError(error.response?.data?.message || error.message || 'Failed to load investment plans.');
      } finally {
        setLoadingPlans(false);
      }
    };

    const fetchDashboardData = async () => {
      try {
        setLoadingData(true);
        
        // Fetch wallet data directly from the wallet endpoint
        try {
          const walletResponse = await api.get('/users/wallet');
          console.log('Wallet response:', walletResponse.data);
          
          console.log('Full wallet response:', walletResponse.data);
          
          if (walletResponse.data && walletResponse.data.data) {
            // The wallet data is in the data property
            const walletData = walletResponse.data.data;
            console.log('Wallet data found:', walletData);
            
            if (typeof walletData.balance === 'number') {
              setWalletBalance(walletData.balance);
              console.log('Set wallet balance to:', walletData.balance);
              
              // Also update the user object with the wallet data
              updateUser({
                wallet: walletData
              });
            }
          } else if (walletResponse.data && walletResponse.data.wallet) {
            // Create a wallet object to update the user data
            const walletData = {
              wallet: walletResponse.data.wallet
            };
            updateUser(walletData);
            
            // Set the wallet balance directly in state
            if (typeof walletResponse.data.wallet.balance === 'number') {
              setWalletBalance(walletResponse.data.wallet.balance);
              console.log('Set wallet balance to:', walletResponse.data.wallet.balance);
            }
            console.log('Updated wallet data:', walletData);
          } else if (walletResponse.data && typeof walletResponse.data.balance === 'number') {
            // Some APIs return the balance directly
            setWalletBalance(walletResponse.data.balance);
            console.log('Set wallet balance directly to:', walletResponse.data.balance);
          }
        } catch (walletError) {
          console.error('Error fetching wallet:', walletError);
        }
        
        // We've successfully fetched wallet data, no need for additional user data fetching
        // The user's basic info is already available in the AuthContext
        console.log('Current user data from context:', user);
        
        // Fetch portfolio data (investments)
        const investmentsResponse = await api.get('/investments/me');
        setPortfolioData(investmentsResponse.data.data);
        
        // Fetch rewards data
        const rewardsResponse = await api.get('/rewards/me');
        setRewardsData(rewardsResponse.data.data);
        
        // Fetch referrals data
        const referralsResponse = await api.get('/referrals/me');
        setReferralsData(referralsResponse.data.data);
        
        // Fetch recent transactions
        try {
          const transactionsResponse = await api.get('/transactions/me', {
            params: { limit: 5 } // Only get the 5 most recent transactions
          });
          console.log('Transactions response:', transactionsResponse.data);
          
          if (transactionsResponse.data && transactionsResponse.data.data) {
            // Update the userData state with the transactions
            setUserData(prevData => ({
              ...prevData,
              recentTransactions: transactionsResponse.data.data
            }));
          }
        } catch (transactionsError) {
          console.error('Error fetching transactions:', transactionsError);
        }
        
        setDataError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDataError('Failed to load some dashboard data. Please refresh the page.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchInvestmentPlans();
    fetchDashboardData();
    
    // Set up interval for real-time updates (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="bg-gray-50 min-h-screen content-container">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm mb-6 rounded-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name || userData.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ease-in-out"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <i className="fa fa-search"></i>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors duration-300">
                  <i className="fa fa-envelope"></i>
                </button>
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors duration-300">
                  <i className="fa fa-bell"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="w-full py-6">
        {/* Quick Links */}
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/my-investments" className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.03] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">My Investments</h3>
                <p className="text-sm text-gray-500">Manage your investment portfolio</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                <FiPieChart className="h-6 w-6 text-blue-600" />
              </div>
            </Link>
            
            <Link to="/rewards" className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.03] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Rewards</h3>
                <p className="text-sm text-gray-500">View and redeem your rewards</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors duration-300">
                <FiAward className="h-6 w-6 text-purple-600" />
              </div>
            </Link>
            
            <Link to="/referrals" className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.03] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Referrals</h3>
                <p className="text-sm text-gray-500">Invite friends and earn rewards</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors duration-300">
                <FiUsers className="h-6 w-6 text-green-600" />
              </div>
            </Link>
          </div>
        </div>
        
        {/* Investment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {/* Current Balance Card */}
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4 bg-accent rounded-full p-2 text-white">
                <FiDollarSign className="h-5 w-5" />
              </div>
              <h3 className="text-white text-sm font-medium mb-2">Current Balance</h3>
              <p className="text-white text-2xl font-bold mb-4">
                {loadingData ? (
                  <span className="text-white/70">Loading...</span>
                ) : (
                  `$${formatNumber(walletBalance)}`
                )}
              </p>
              {/* Debug info - remove after testing */}
              <div className="hidden">
                {/* {console.log('Current wallet balance state:', walletBalance)} */}
              </div>
              <Link to="/deposit" className="text-xs text-white bg-white/10 hover:bg-white/25 border border-white/30 rounded-full px-4 py-1.5 font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50">
                Add
              </Link>
            </div>
          </div>

          {/* Total Profit Card */}
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4 bg-accent rounded-full p-2 text-white">
                {loadingData ? (
                  <div className="h-5 w-5 bg-white/30 rounded-full animate-pulse"></div>
                ) : (
                  portfolioData?.summary?.totalProfit >= 0 ? (
                    <FiTrendingUp className="h-5 w-5" />
                  ) : (
                    <FiTrendingDown className="h-5 w-5" />
                  )
                )}
              </div>
              <h3 className="text-white text-sm font-medium mb-2">Total Profit</h3>
              <p className="text-white text-2xl font-bold mb-4">
                {loadingData ? (
                  <span className="text-white/70">Loading...</span>
                ) : (
                  `$${formatNumber(portfolioData?.summary?.totalProfit || 0)}`
                )}
              </p>
              <Link to="/my-investments" className="text-xs text-white bg-white/10 hover:bg-white/25 border border-white/30 rounded-full px-4 py-1.5 font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50">
                View Details
              </Link>
            </div>
          </div>

          {/* Total Invested Card */}
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4 bg-accent rounded-full p-2 text-white">
                <FiPieChart className="h-5 w-5" />
              </div>
              <h3 className="text-white text-sm font-medium mb-2">Total Invested</h3>
              <p className="text-white text-2xl font-bold mb-4">
                {loadingData ? (
                  <span className="text-white/70">Loading...</span>
                ) : (
                  `$${formatNumber(portfolioData?.summary?.totalInvested || 0)}`
                )}
              </p>
              <Link to="/my-investments" className="text-xs text-white bg-white/10 hover:bg-white/25 border border-white/30 rounded-full px-4 py-1.5 font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50">
                View
              </Link>
            </div>
          </div>
          
          {/* Rewards Card */}
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute top-4 right-4 bg-accent rounded-full p-2 text-white">
                <FiAward className="h-5 w-5" />
              </div>
              <h3 className="text-white text-sm font-medium mb-2">Reward Points</h3>
              <p className="text-white text-2xl font-bold mb-4">
                {loadingData ? (
                  <span className="text-white/70">Loading...</span>
                ) : (
                  `${rewardsData?.points || 0} pts`
                )}
              </p>
              <Link to="/rewards" className="text-xs text-white bg-white/10 hover:bg-white/25 border border-white/30 rounded-full px-4 py-1.5 font-medium transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50">
                Redeem
              </Link>
            </div>
          </div>
        </div>

        {/* Portfolio Overview & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Portfolio Overview</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100 hover:text-primary hover:border-primary/50 transition-all duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-primary/50">1M</button>
                  <button className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100 hover:text-primary hover:border-primary/50 transition-all duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-primary/50">3M</button>
                  <button className="px-3 py-1 text-sm bg-primary text-white rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ring-offset-1">6M</button>
                  <button className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100 hover:text-primary hover:border-primary/50 transition-all duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-primary/50">1Y</button>
                </div>
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
                <Link to="/transactions" className="text-sm text-primary hover:text-primary-dark font-medium transition-colors duration-200">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {loadingData ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading transactions...</p>
                  </div>
                ) : userData.recentTransactions.length > 0 ? (
                  userData.recentTransactions.map(transaction => (
                    <div key={transaction._id} className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${
                          transaction.type === 'deposit' ? 'bg-green-50 text-green-600' : 
                          transaction.type === 'withdrawal' ? 'bg-red-50 text-red-600' : 
                          transaction.type === 'investment' ? 'bg-blue-50 text-blue-600' : 
                          transaction.type === 'profit' ? 'bg-purple-50 text-purple-600' : 
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
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </p>
                          <p className="text-xs text-gray-500">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          transaction.type === 'deposit' || transaction.type === 'profit' ? 'text-green-600' : 
                          transaction.type === 'withdrawal' ? 'text-red-600' : 
                          'text-blue-600'
                        }`}>
                          {(transaction.type === 'deposit' || transaction.type === 'profit') ? '+' : 
                           transaction.type === 'withdrawal' ? '-' : ''}
                          ${formatNumber(transaction.amount)}
                        </p>
                        <p className={`text-xs ${
                          transaction.status === 'completed' ? 'text-green-600' : 
                          transaction.status === 'pending' ? 'text-yellow-600' : 
                          transaction.status === 'failed' ? 'text-red-600' : 
                          'text-gray-500'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No transactions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

       

        {/* Investment Opportunities */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Investment Opportunities</h2>
              <Link to="/investments" className="text-sm text-primary hover:text-primary-dark font-medium transition-colors duration-200">
                View All
              </Link>
            </div>
            {/* Dynamic Investment Plans Section */}
            {loadingPlans ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-3 text-gray-500">Loading investment plans...</p>
              </div>
            ) : planError ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6 rounded-md shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">{planError}</p>
                  </div>
                </div>
              </div>
            ) : !Array.isArray(investmentPlans) ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Error loading investment plans. Please refresh the page.</p>
              </div>
            ) : investmentPlans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No investment plans available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investmentPlans.slice(0, 3).map(plan => (
                  <InvestmentCard
                    key={plan._id}
                    id={plan._id}
                    title={plan.name}
                    description={plan.description}
                    riskLevel={plan.riskLevel}
                    assetType={plan.assets && plan.assets.length > 0 ? plan.assets[0].name : 'Various'}
                    expectedReturns={plan.expectedReturns}
                    duration={plan.duration}
                    minimumInvestment={plan.minimumInvestment}
                    onLearnMore={() => window.location.href = `/investments?plan=${plan._id}`}
                  />
                ))}
              </div>
            )}
            {/* End of Dynamic Investment Plans Section */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNew;
