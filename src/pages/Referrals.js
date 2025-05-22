import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiUserPlus, FiDollarSign, FiCopy, FiCheck } from 'react-icons/fi';
import api from '../services/apiService';

const Referrals = () => {
  const { user } = useAuth();
  const [referralInfo, setReferralInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch referral info
  useEffect(() => {
    const fetchReferralInfo = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/referrals/me');
        setReferralInfo(data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching referral info:', err);
        setError('Failed to load referral information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReferralInfo();
  }, []);

  // Copy referral link to clipboard
  const copyToClipboard = () => {
    if (!referralInfo?.referralLink) return;
    
    navigator.clipboard.writeText(referralInfo.referralLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Loading referral information...</p>
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
            Referral Program
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Invite friends and earn rewards together
          </p>
        </div>

        {referralInfo && (
          <div className="mb-10">
            {/* Referral Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary rounded-md p-3">
                      <FiUsers className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Referrals
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {referralInfo.totalReferrals}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <FiUserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Completed Referrals
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {referralInfo.completedReferrals}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                      <FiDollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Rewards Earned
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {referralInfo.totalRewardsEarned} points
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Your Referral Link
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Share this link with friends to earn rewards
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <input
                      type="text"
                      name="referral-link"
                      id="referral-link"
                      className="focus:ring-primary focus:border-primary block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                      value={referralInfo.referralLink}
                      readOnly
                    />
                  </div>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    {copied ? (
                      <>
                        <FiCheck className="h-5 w-5 text-green-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="h-5 w-5 text-gray-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Your referral code: <span className="font-medium text-gray-900">{referralInfo.referralCode}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  How It Works
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Learn how to earn rewards through referrals
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Step 1</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      Share your unique referral link with friends who might be interested in Zynith Investment Platform.
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Step 2</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      When they sign up using your referral link, they'll be connected to your account.
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Step 3</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      Once they make their first investment, the referral is completed.
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Step 4</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      You'll earn <span className="font-medium text-primary">500 reward points</span> and they'll receive <span className="font-medium text-primary">200 reward points</span> as a welcome bonus.
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Step 5</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      Redeem your points for exclusive rewards in the Rewards section.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Referral List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Your Referrals
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  List of people you've referred
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Joined
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reward
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {referralInfo.referrals && referralInfo.referrals.length > 0 ? (
                        referralInfo.referrals.map((referral, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-500 font-medium">
                                    {referral.referee.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {referral.referee.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {referral.referee.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(referral.referee.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${referral.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : referral.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {referral.status === 'rewarded' ? (
                                <span className="text-green-600 font-medium">{referral.referrerReward} points</span>
                              ) : (
                                <span className="text-gray-400">Pending</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            You haven't referred anyone yet. Share your referral link to get started!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Referrals;
