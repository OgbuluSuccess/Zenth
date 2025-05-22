import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/apiService';

const Rewards = () => {
  const { user } = useAuth();
  const [rewards, setRewards] = useState(null);
  const [availableRewards, setAvailableRewards] = useState([]);
  const [history, setHistory] = useState({ pointsHistory: [], redeemedRewards: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(null);
  const [redeemError, setRedeemError] = useState(null);

  // Fetch user rewards
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/rewards/me');
        setRewards(data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching rewards:', err);
        setError('Failed to load rewards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  // Fetch available rewards
  useEffect(() => {
    const fetchAvailableRewards = async () => {
      try {
        const { data } = await api.get('/rewards/available');
        setAvailableRewards(data.data.availableRewards);
      } catch (err) {
        console.error('Error fetching available rewards:', err);
      }
    };

    fetchAvailableRewards();
  }, [rewards]);

  // Fetch reward history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/rewards/history');
        setHistory(data.data);
      } catch (err) {
        console.error('Error fetching reward history:', err);
      }
    };

    fetchHistory();
  }, [rewards]);

  // Redeem a reward
  const handleRedeemReward = async (rewardName) => {
    try {
      setRedeemLoading(true);
      setRedeemError(null);
      setRedeemSuccess(null);

      const { data } = await api.post('/rewards/redeem', {
        rewardName
      });

      setRedeemSuccess(`Successfully redeemed: ${rewardName}`);
      
      // Refresh rewards data
      const rewardsResponse = await api.get('/rewards/me');
      setRewards(rewardsResponse.data.data);
      
      // Refresh history
      const historyResponse = await api.get('/rewards/history');
      setHistory(historyResponse.data.data);
    } catch (err) {
      console.error('Error redeeming reward:', err);
      setRedeemError(err.response?.data?.message || 'Failed to redeem reward. Please try again.');
    } finally {
      setRedeemLoading(false);
    }
  };

  // Helper function to get level color
  const getLevelColor = (level) => {
    switch (level) {
      case 'Bronze':
        return 'bg-amber-600';
      case 'Silver':
        return 'bg-gray-400';
      case 'Gold':
        return 'bg-yellow-500';
      case 'Platinum':
        return 'bg-blue-400';
      case 'Diamond':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
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
            <p className="mt-2 text-gray-600">Loading rewards...</p>
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
            Rewards & Loyalty Program
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Earn points, unlock rewards, and enjoy exclusive benefits
          </p>
        </div>

        {rewards && (
          <div className="mb-10">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Your Rewards Status
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Current level and points balance
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium text-white ${getLevelColor(rewards.level)}`}>
                    {rewards.level} Level
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Current Points</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className="text-2xl font-bold text-primary">{rewards.points}</span> points
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Total Earned</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {rewards.totalEarned} points
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Next Level</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {rewards.level === 'Bronze' && (
                        <div>
                          <span className="font-semibold">Silver</span> - Earn {500 - rewards.points} more points
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-gray-400 h-2.5 rounded-full" style={{ width: `${(rewards.points / 500) * 100}%` }}></div>
                          </div>
                        </div>
                      )}
                      {rewards.level === 'Silver' && (
                        <div>
                          <span className="font-semibold">Gold</span> - Earn {2000 - rewards.points} more points
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${((rewards.points - 500) / 1500) * 100}%` }}></div>
                          </div>
                        </div>
                      )}
                      {rewards.level === 'Gold' && (
                        <div>
                          <span className="font-semibold">Platinum</span> - Earn {5000 - rewards.points} more points
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${((rewards.points - 2000) / 3000) * 100}%` }}></div>
                          </div>
                        </div>
                      )}
                      {rewards.level === 'Platinum' && (
                        <div>
                          <span className="font-semibold">Diamond</span> - Earn {10000 - rewards.points} more points
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${((rewards.points - 5000) / 5000) * 100}%` }}></div>
                          </div>
                        </div>
                      )}
                      {rewards.level === 'Diamond' && (
                        <div>
                          <span className="font-semibold">Maximum level reached!</span> - Enjoy all the exclusive benefits
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Available Rewards */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rewards</h2>
          
          {redeemSuccess && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{redeemSuccess}</p>
                </div>
              </div>
            </div>
          )}
          
          {redeemError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{redeemError}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableRewards.map((reward, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {reward.name}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {reward.pointsCost} points
                          </div>
                        </dd>
                      </dl>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(reward.level)} text-white`}>
                        {reward.level}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">{reward.description}</p>
                  </div>
                  <div className="mt-5">
                    <button
                      onClick={() => handleRedeemReward(reward.name)}
                      disabled={rewards?.points < reward.pointsCost || redeemLoading}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${rewards?.points >= reward.pointsCost ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-300'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full justify-center`}
                    >
                      {redeemLoading ? 'Processing...' : `Redeem (${reward.pointsCost} points)`}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Points History */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Points History</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {history.pointsHistory && history.pointsHistory.length > 0 ? (
                      history.pointsHistory.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.action.charAt(0).toUpperCase() + item.action.slice(1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={item.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                              {item.amount > 0 ? '+' : ''}{item.amount}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No points history yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Redeemed Rewards */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Redeemed Rewards</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your Redeemed Rewards
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reward
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {history.redeemedRewards && history.redeemedRewards.length > 0 ? (
                      history.redeemedRewards.map((reward, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(reward.redeemedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reward.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {reward.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reward.pointsCost}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No redeemed rewards yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
