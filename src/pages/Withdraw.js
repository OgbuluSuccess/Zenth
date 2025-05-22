import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle, FiCheckCircle, FiLoader, FiSend } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext'; // For notifications

const initialCryptoOptions = []; // Will be populated from API

const Withdraw = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [cryptoOptions, setCryptoOptions] = useState(initialCryptoOptions);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

    const availableBalance = selectedCrypto?.balance ? parseFloat(selectedCrypto.balance) : 0;
  const withdrawalFee = selectedCrypto?.withdrawalFee ? parseFloat(selectedCrypto.withdrawalFee) : 0;
  const netAmount = parseFloat(amount) > 0 ? Math.max(0, parseFloat(amount) - withdrawalFee) : 0;

    useEffect(() => {
    const fetchWalletAssets = async () => {
      if (!user) return;
      setLoadingAssets(true);
      setError(null);
      try {
        const response = await api.get('/wallet/assets');
        const withdrawableAssets = response.data.filter(asset => asset.canWithdraw && asset.isActive);

        setCryptoOptions(withdrawableAssets.map(asset => ({
          // Map all necessary fields from backend asset config
          ...asset, // Includes id (as assetId), name, symbol, iconUrl, balance, withdrawalFee, precision, etc.
        })));

        if (withdrawableAssets.length > 0) {
          setSelectedCrypto(withdrawableAssets[0]);
        } else {
          setError('No withdrawable assets available.');
        }
      } catch (err) {
        console.error('Error fetching wallet assets:', err);
        setError(err.response?.data?.message || 'Could not load your assets. Please try again later.');
      }
      setLoadingAssets(false);
    };

    fetchWalletAssets();
  }, [user]);

  useEffect(() => {
    // Reset form when crypto changes
    setRecipientAddress('');
    setAmount('');
    setTwoFactorCode('');
    setError(null);
    setSuccessMessage(null);
  }, [selectedCrypto]);

  const handleCryptoChange = (cryptoId) => {
    const newCrypto = cryptoOptions.find(c => (c.assetId || c.id) === cryptoId);
    if (newCrypto) {
      setSelectedCrypto(newCrypto);
    }
  };

  const handleMaxAmount = () => {
    setAmount(availableBalance.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (!recipientAddress || !amount || parseFloat(amount) <= 0) {
      setError('Please fill in all required fields and enter a valid amount.');
      setIsSubmitting(false);
      return;
    }
    if (parseFloat(amount) > availableBalance) {
      setError('Withdrawal amount exceeds available balance.');
      setIsSubmitting(false);
      return;
    }
    if (!twoFactorCode) { // Basic check for 2FA, real validation on backend
        setError('Please enter your 2FA code.');
        setIsSubmitting(false);
        return;
    }

    try {
      const payload = {
        assetId: selectedCrypto.assetId || selectedCrypto.id,
        recipientAddress,
        amount: amount.toString(), // Send amount as string for precision
        twoFactorCode,
        // memo: recipientMemo, // Add if your UI supports memo/destination tag input for relevant cryptos
      };
      
      const response = await api.post('/wallet/withdrawals', payload);

      setSuccessMessage(response.data.message || `Withdrawal request for ${amount} ${selectedCrypto.symbol} submitted successfully!`);
      showToast('success', response.data.message || 'Withdrawal request submitted!');
      
      // Reset form and potentially update balance display if API returns new balance
      setRecipientAddress('');
      setAmount('');
      setTwoFactorCode('');
      
      // Refetch assets to update balance if not returned by withdrawal endpoint
      const updatedAssetsResponse = await api.get('/wallet/assets');
      const updatedAssets = updatedAssetsResponse.data.filter(asset => asset.canWithdraw && asset.isActive);
      setCryptoOptions(updatedAssets.map(asset => ({ ...asset })));
      const currentlySelected = updatedAssets.find(a => (a.assetId || a.id) === (selectedCrypto.assetId || selectedCrypto.id));
      if (currentlySelected) setSelectedCrypto(currentlySelected);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during withdrawal. Please try again.';
      setError(errorMessage);
      showToast('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

    if (loadingAssets) {
    return (
      <div className="text-center py-20">
        <FiLoader className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
        <p>Loading your wallet...</p>
      </div>
    );
  }

  if (!user || !selectedCrypto && cryptoOptions.length === 0 && !error) { // Added check for no selected crypto if options are empty and no error
    return (
      <div className="text-center py-20">
        <FiLoader className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
        <p>Loading user data...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-8 content-container">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/dashboard" className="text-sm text-primary hover:text-primary-dark font-medium flex items-center">
            <FiArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Withdraw Funds</h1>
          <p className="text-md text-gray-600 mb-6 text-center">Securely withdraw your cryptocurrency.</p>

          {/* Crypto Selection Tabs */}
          <div className="mb-6">
            <div className="flex justify-center space-x-1 sm:space-x-2 border-b border-gray-200 pb-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {cryptoOptions.map((crypto) => (
                <button
                  key={crypto.assetId || crypto.id}
                  onClick={() => handleCryptoChange(crypto.assetId || crypto.id)}
                  className={`flex flex-col sm:flex-row items-center whitespace-nowrap space-x-0 sm:space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 
                              ${selectedCrypto && (selectedCrypto.assetId || selectedCrypto.id) === (crypto.assetId || crypto.id) 
                                ? 'bg-primary text-white shadow-md' 
                                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'}`}
                >
                  <img src={crypto.iconUrl || crypto.icon} alt={crypto.name} className="w-5 h-5 mb-1 sm:mb-0" />
                  <span>{crypto.name} <span className="hidden sm:inline">({crypto.symbol})</span></span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Recipient's {selectedCrypto?.symbol} Address
              </label>
              <input 
                type="text" 
                name="recipientAddress"
                id="recipientAddress"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder={`Enter ${selectedCrypto?.symbol} address`}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount to Withdraw
                </label>
                <span className="text-xs text-gray-500">
                  Available: {availableBalance.toFixed(selectedCrypto?.precision || 6)} {selectedCrypto?.symbol}
                </span>
              </div>
              <div className="relative">
                <input 
                  type="number" 
                  name="amount"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="any"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors pr-20"
                />
                <button 
                  type="button"
                  onClick={handleMaxAmount}
                  className="absolute inset-y-0 right-0 px-3 py-1 m-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between">
                <span>Withdrawal Fee:</span>
                <span>{withdrawalFee.toFixed(selectedCrypto?.precision || 2)} {selectedCrypto?.symbol}</span>
              </div>
              <div className="flex justify-between font-medium mt-1">
                <span>You Will Receive:</span>
                <span>{netAmount.toFixed(selectedCrypto?.precision || 2)} {selectedCrypto?.symbol}</span>
              </div>
            </div>

            <div>
              <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700 mb-1">
                2FA Code (e.g., Google Authenticator)
              </label>
              <input 
                type="text" 
                name="twoFactorCode"
                id="twoFactorCode"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            
            {error && (
              <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-md text-sm">
                <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-md text-sm">
                <FiCheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{successMessage}</p>
              </div>
            )}

            <div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin h-5 w-5 mr-2" /> Processing...
                  </>
                ) : (
                  <>
                    <FiSend className="h-5 w-5 mr-2" /> Submit Withdrawal
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Withdrawals are processed promptly. You can track status in your <Link to="/transactions" className="text-primary hover:underline">transaction history</Link>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
