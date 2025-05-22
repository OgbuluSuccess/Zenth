import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/apiService';
import { FiSave, FiRefreshCw, FiInfo } from 'react-icons/fi';

const ReferralSettingsManager = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state
  const [pointsPerReferral, setPointsPerReferral] = useState(100);
  const [bonusPointsThreshold, setBonusPointsThreshold] = useState(5);
  const [bonusPoints, setBonusPoints] = useState(500);
  const [minimumInvestmentAmount, setMinimumInvestmentAmount] = useState(100);

  // Fetch current referral settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/referral-settings');
        setSettings(data.data);
        
        // Initialize form with current settings
        setPointsPerReferral(data.data.pointsPerReferral);
        setBonusPointsThreshold(data.data.bonusPointsThreshold);
        setBonusPoints(data.data.bonusPoints);
        setMinimumInvestmentAmount(data.data.minimumInvestmentAmount);
        
        // Fetch history
        const historyResponse = await api.get('/referral-settings/history');
        setHistory(historyResponse.data.data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching referral settings:', err);
        setError('Failed to load referral settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const { data } = await api.put('/referral-settings', {
        pointsPerReferral,
        bonusPointsThreshold,
        bonusPoints,
        minimumInvestmentAmount
      });
      
      setSettings(data.data);
      setSuccess('Referral settings updated successfully');
      
      // Refresh history
      const historyResponse = await api.get('/referral-settings/history');
      setHistory(historyResponse.data.data);
    } catch (err) {
      console.error('Error updating referral settings:', err);
      setError(err.response?.data?.message || 'Failed to update referral settings');
    } finally {
      setSaving(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Referral Settings</h1>
        <p className="text-gray-600">Configure the referral program settings</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pointsPerReferral">
                  Points Per Referral
                </label>
                <div className="flex items-center">
                  <input
                    id="pointsPerReferral"
                    type="number"
                    min="0"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={pointsPerReferral}
                    onChange={(e) => setPointsPerReferral(Number(e.target.value))}
                    required
                  />
                  <div className="ml-2 text-gray-500 flex items-center" title="Points awarded for each successful referral">
                    <FiInfo />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bonusPointsThreshold">
                  Bonus Points Threshold
                </label>
                <div className="flex items-center">
                  <input
                    id="bonusPointsThreshold"
                    type="number"
                    min="0"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={bonusPointsThreshold}
                    onChange={(e) => setBonusPointsThreshold(Number(e.target.value))}
                    required
                  />
                  <div className="ml-2 text-gray-500 flex items-center" title="Number of referrals needed to earn bonus points">
                    <FiInfo />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bonusPoints">
                  Bonus Points
                </label>
                <div className="flex items-center">
                  <input
                    id="bonusPoints"
                    type="number"
                    min="0"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={bonusPoints}
                    onChange={(e) => setBonusPoints(Number(e.target.value))}
                    required
                  />
                  <div className="ml-2 text-gray-500 flex items-center" title="Bonus points awarded when threshold is reached">
                    <FiInfo />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="minimumInvestmentAmount">
                  Minimum Investment Amount
                </label>
                <div className="flex items-center">
                  <input
                    id="minimumInvestmentAmount"
                    type="number"
                    min="0"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={minimumInvestmentAmount}
                    onChange={(e) => setMinimumInvestmentAmount(Number(e.target.value))}
                    required
                  />
                  <div className="ml-2 text-gray-500 flex items-center" title="Minimum investment amount for a referral to count">
                    <FiInfo />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <FiRefreshCw className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Settings History */}
        <div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Settings History</h2>
            {history.length > 0 ? (
              <div className="overflow-auto max-h-96">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item._id} className="border-t">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {item.pointsPerReferral}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No history available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSettingsManager;
