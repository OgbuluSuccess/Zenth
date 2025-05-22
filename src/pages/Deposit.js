import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; // Import QRCodeSVG
import { FiCopy, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import api from '../services/api'; // Assuming your API service is set up
import { useAuth } from '../context/AuthContext';

const initialCryptoOptions = []; // Will be populated from API

const Deposit = () => {
  const { user } = useAuth();
  const [cryptoOptions, setCryptoOptions] = useState(initialCryptoOptions);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [depositAddress, setDepositAddress] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [errorAddress, setErrorAddress] = useState(null);
  const [copied, setCopied] = useState(false);

    // Effect to fetch available cryptocurrencies for deposit
  useEffect(() => {
    const fetchAssets = async () => {
      if (!user) return;
      setLoadingAddress(true); // Use general loading state for initial asset load
      setErrorAddress(null);
      try {
        const response = await api.get('/wallet/assets');
        const depositableAssets = response.data.filter(asset => asset.canDeposit && asset.isActive);
        if (depositableAssets.length > 0) {
          setCryptoOptions(depositableAssets.map(asset => ({
            id: asset.assetId,
            name: asset.name,
            symbol: asset.symbol,
            icon: asset.iconUrl, // Assuming iconUrl is provided by backend
            network: asset.network, 
            minDeposit: asset.minDeposit, // Store for display
          })));
          setSelectedCrypto(depositableAssets[0]); // Select the first one by default
        } else {
          setErrorAddress('No depositable assets found.');
        }
      } catch (error) {
        console.error('Error fetching wallet assets:', error);
        setErrorAddress('Could not load available cryptocurrencies. Please try again.');
      } finally {
        setLoadingAddress(false);
      }
    };
    fetchAssets();
  }, [user]);

  // Effect to fetch deposit address when selectedCrypto changes
  useEffect(() => {
    if (user && selectedCrypto) {
      setLoadingAddress(true);
      setErrorAddress(null);
      const fetchDepositAddress = async () => {
        try {
          const response = await api.get(`/wallet/deposit-address?assetId=${selectedCrypto.assetId || selectedCrypto.id}`);
          setDepositAddress(response.data.address); // Assuming API returns { address: '...' }
          // Potentially set memo if response.data.memo exists
        } catch (error) {
          console.error('Error fetching deposit address:', error);
          setErrorAddress(error.response?.data?.message || 'Could not load deposit address. Please try again.');
        }
        setLoadingAddress(false);
      };

      fetchDepositAddress();
    }
  }, [user, selectedCrypto]);

  const handleCryptoChange = (cryptoId) => {
    const newCrypto = cryptoOptions.find(c => c.id === cryptoId);
    if (newCrypto) {
      setSelectedCrypto(newCrypto);
      setCopied(false); // Reset copied status when crypto changes
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(depositAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy address. Please try manually.');
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 content-container">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Deposit Funds</h1>
          <p className="text-md text-gray-600 mt-1">Choose a cryptocurrency to make a deposit.</p>
        </div>

        {/* Crypto Selection Tabs */}
        <div className="mb-6">
          <div className="flex justify-center space-x-2 sm:space-x-4 border-b border-gray-200 pb-3">
            {cryptoOptions.map((crypto) => (
              <button
                key={crypto.assetId || crypto.id}
                onClick={() => handleCryptoChange(crypto.assetId || crypto.id)}
                className={`flex flex-col sm:flex-row items-center space-x-0 sm:space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 
                            ${selectedCrypto && (selectedCrypto.assetId || selectedCrypto.id) === (crypto.assetId || crypto.id) 
                              ? 'bg-primary text-white shadow-md' 
                              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'}`}
              >
                <img src={crypto.icon} alt={crypto.name} className="w-5 h-5 mb-1 sm:mb-0" />
                <span>{crypto.name} <span className="hidden sm:inline">({crypto.symbol})</span></span>
              </button>
            ))}
          </div>
        </div>

        {/* Deposit Information Area */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
          {loadingAddress && (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-3 text-gray-600">Generating your deposit address...</p>
            </div>
          )}

          {errorAddress && !loadingAddress && (
            <div className="text-center py-10 bg-red-50 p-4 rounded-lg">
              <FiAlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2" />
              <p className="text-red-700 font-medium">{errorAddress}</p>
              <button 
                onClick={() => setSelectedCrypto(prev => ({...prev}))} // Re-trigger useEffect
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!loadingAddress && !errorAddress && depositAddress && (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Your {selectedCrypto.name} ({selectedCrypto.symbol}) Deposit Address
              </h2>
              {selectedCrypto.network && (
                <p className="text-sm text-gray-500 mb-4">Network: {selectedCrypto.network}</p>
              )}
              
              <div className="my-6 flex justify-center">
                <QRCodeSVG 
                  value={depositAddress} 
                  size={160} 
                  level="H" 
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#192a56" // primary color
                />
              </div>

              <div className="relative bg-gray-100 p-3 rounded-lg mb-6">
                <p className="text-gray-800 font-mono break-all text-sm sm:text-base">{depositAddress}</p>
                <button 
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                  title="Copy address"
                >
                  {copied ? <FiCheckCircle className="text-green-600 h-5 w-5" /> : <FiCopy className="text-gray-700 h-5 w-5" />}
                </button>
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md text-left text-sm mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiInfo className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-blue-700">Important Instructions:</h3>
                    <ul className="list-disc list-inside mt-1 text-blue-600 space-y-1">
                      <li>Send only <span className="font-semibold">{selectedCrypto.name} ({selectedCrypto.symbol})</span> to this address.</li>
                      {selectedCrypto.network && <li>Ensure you are using the <span className="font-semibold">{selectedCrypto.network}</span> network.</li>}
                      <li>Minimum deposit: <span className="font-semibold">{selectedCrypto.minDeposit || 'N/A'} {selectedCrypto.symbol}</span>.</li>
                      <li>Deposits typically take <span className="font-semibold">3-6 network confirmations</span>.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>Your deposit will be credited to your account after network confirmation.</p>
                <p className="mt-1">You can check your <Link to="/transactions" className="text-primary hover:underline">transaction history</Link> for updates.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Link (Optional) */}
        <div className="mt-8 text-center">
          <Link to="/dashboard" className="text-sm text-primary hover:text-primary-dark font-medium">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
