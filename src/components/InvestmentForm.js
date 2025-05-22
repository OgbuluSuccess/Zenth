import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/apiService';
import { FiDollarSign, FiTrendingUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const InvestmentForm = ({ planId, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userWallet, setUserWallet] = useState(null);

  // Fetch plan details and user wallet
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use Promise.all to fetch data in parallel
        const [planResponse, userResponse] = await Promise.all([
          api.get(`/investment-plans/${planId}`),
          api.get('/users/wallet')
        ]);
        
        // Log the response for debugging
        console.log('Plan ID:', planId);
        console.log('Plan Response:', planResponse);
        
        // Check the structure of the response and handle accordingly
        setPlan(planResponse.data.data || planResponse.data);
        setUserWallet(userResponse.data.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load investment plan details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchData();
    } else {
      setLoading(false); // Set loading to false if no planId is provided
    }
  }, [planId]);

  // Calculate potential returns based on investment amount, duration, and expected returns
  const calculatePotentialReturns = (amount) => {
    if (!plan || !amount) return { monthly: 0, total: 0 };
    
    // Extract the percentage from the expected returns string
    const expectedReturnsStr = plan.expectedReturns;
    let expectedReturnsPercent = 0;
    
    // Try to parse the expected returns
    if (expectedReturnsStr) {
      // Extract numbers from the string (e.g., '5-10% annually' -> [5, 10])
      const numbers = expectedReturnsStr.match(/\d+(\.\d+)?/g);
      if (numbers && numbers.length > 0) {
        // If there's a range, take the average
        if (numbers.length > 1) {
          expectedReturnsPercent = (parseFloat(numbers[0]) + parseFloat(numbers[1])) / 2;
        } else {
          expectedReturnsPercent = parseFloat(numbers[0]);
        }
      }
    }
    
    // Calculate returns based on duration (convert annual rate to the investment period)
    const durationInYears = plan.duration / 365;
    const totalReturn = (amount * expectedReturnsPercent * durationInYears) / 100;
    const monthlyReturn = totalReturn / (plan.duration / 30); // Approximate monthly return
    
    return {
      monthly: monthlyReturn,
      total: totalReturn,
      percentage: expectedReturnsPercent * durationInYears
    };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid investment amount');
      showToast('Please enter a valid investment amount', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Show toast that investment is being processed
      showToast('Processing your investment...', 'info');
      
      // Create investment
      const response = await api.post('/investments', {
        planId,
        amount: parseFloat(amount)
      });
      
      setSuccess(true);
      
      // Show success toast
      showToast(`Successfully invested $${parseFloat(amount).toLocaleString()} in ${plan.name}!`, 'success');
      
      // Call the onSuccess callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(response.data.data);
      } else {
        // Navigate to my investments page after a delay
        setTimeout(() => {
          navigate('/my-investments');
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating investment:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create investment. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-lg">
        <div className="flex flex-col justify-center items-center h-60">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600 text-lg">Loading investment details...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-8 bg-white rounded-lg">
        <div className="text-center">
          <div className="bg-green-100 rounded-full p-3 inline-block mb-4">
            <FiCheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Investment Created Successfully!</h3>
          <p className="text-gray-600 text-lg mb-6">
            Your investment has been created and is now active. You can track its progress in your investments dashboard.
          </p>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => navigate('/my-investments')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              View My Investments
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!plan && !loading) {
    return (
      <div className="p-8 bg-white rounded-lg">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 inline-block mb-4">
            <FiAlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Investment Plan Not Found</h3>
          <p className="text-gray-600 text-lg mb-6">
            The investment plan you're looking for could not be found. Please try again.
          </p>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onCancel || (() => window.location.reload())}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Invest in {plan.name}</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
          <div className="flex">
            <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-blue-100 pb-2">Plan Details</h3>
        <div className="grid grid-cols-2 gap-6 text-base">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="text-gray-500 mb-1">Expected Returns</div>
            <div className="text-xl font-bold text-blue-600">{plan.expectedReturns}%</div>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="text-gray-500 mb-1">Duration</div>
            <div className="text-xl font-bold text-blue-600">{plan.duration} days</div>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="text-gray-500 mb-1">Risk Level</div>
            <div className="text-xl font-bold text-blue-600">{plan.riskLevel}</div>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <div className="text-gray-500 mb-1">Minimum Investment</div>
            <div className="text-xl font-bold text-blue-600">${plan.minimumInvestment}</div>
          </div>
        </div>
      </div>
      
      {userWallet && (
        <div className="mb-8 p-5 bg-green-50 border border-green-100 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-green-100 pb-2 flex items-center">
            <FiDollarSign className="text-green-500 mr-2 h-5 w-5" />
            Your Wallet
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 text-lg">Available Balance:</span>
            <span className="text-2xl font-bold text-green-600">${userWallet.balance.toFixed(2)}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-6">
          <label className="block text-gray-700 text-lg font-semibold mb-3" htmlFor="amount">
            How much would you like to invest?
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <span className="text-gray-500 text-xl font-bold">$</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-14 pr-12 py-4 text-xl font-semibold border-gray-300 rounded-lg shadow-sm"
              placeholder="0.00"
              min={plan.minimumInvestment}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="mt-3 flex items-center text-sm text-gray-600">
            <FiAlertCircle className="text-blue-500 mr-2 h-4 w-4" />
            <span>Minimum investment: <span className="font-semibold">${plan.minimumInvestment}</span></span>
          </div>
        </div>
        
        {parseFloat(amount) > 0 && (
          <div className="mb-8 p-5 bg-green-50 border border-green-100 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-green-100 pb-2 flex items-center">
              <FiTrendingUp className="text-green-500 mr-2 h-5 w-5" />
              Potential Returns
            </h3>
            <div className="bg-white p-4 rounded-md shadow-sm mb-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-lg">Investment Amount:</span>
                <span className="text-xl font-bold text-gray-800">${parseFloat(amount).toFixed(2)}</span>
              </div>
              
              {/* Calculate returns based on duration */}
              {(() => {
                const returns = calculatePotentialReturns(parseFloat(amount));
                return (
                  <>
                    <div className="mt-2 border-t border-gray-100 pt-2 flex justify-between items-center">
                      <span className="text-gray-700 text-lg">Investment Period:</span>
                      <span className="text-xl font-bold text-purple-600">{plan.duration} days</span>
                    </div>
                    <div className="mt-2 border-t border-gray-100 pt-2 flex justify-between items-center">
                      <span className="text-gray-700 text-lg">Estimated Monthly Return:</span>
                      <span className="text-xl font-bold text-blue-600">${returns.monthly.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 border-t border-gray-100 pt-2 flex justify-between items-center">
                      <span className="text-gray-700 text-lg">Total Estimated Return:</span>
                      <span className="text-xl font-bold text-green-600">${returns.total.toFixed(2)} ({returns.percentage.toFixed(2)}%)</span>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="text-sm text-gray-500 flex items-start">
              <FiAlertCircle className="text-blue-500 mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Returns are estimates and not guaranteed. Actual returns may vary based on market conditions.</span>
            </div>
          </div>
        )}
        
        <div className="flex justify-center space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all duration-300 w-full md:w-auto"
              disabled={submitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 w-full md:w-auto"
            disabled={submitting}
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                <span>Processing...</span>
              </div>
            ) : (
              'Invest Now'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentForm;
