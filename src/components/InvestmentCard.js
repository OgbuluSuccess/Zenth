import React, { useState } from 'react';
import InvestmentForm from './InvestmentForm';

const InvestmentCard = ({ 
  id, // Add id prop for the investment plan
  iconUrl, 
  title, 
  description, 
  riskLevel, 
  assetType, 
  expectedReturns, 
  duration, // Add duration prop
  minimumInvestment, // Add minimumInvestment prop
  onLearnMore,
  showInvestButton = true // Add prop to control whether to show the Invest Now button
}) => {
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low risk':
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium risk':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high risk':
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-200 hover:shadow-xl transition-shadow duration-300 ease-in-out p-6 flex flex-col h-full">
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center">
          {/* Use a default SVG icon if iconUrl is not provided or image fails to load */}
          {iconUrl ? (
            <div className="h-10 w-10 flex items-center justify-center">
              <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <div className="h-10 w-10 flex items-center justify-center">
              <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 flex-grow text-center">{description}</p>
      
      <div className="mb-4 flex justify-center space-x-2">
        {riskLevel && (
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRiskColor(riskLevel)}`}>
            {riskLevel}
          </span>
        )}
        {assetType && (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800">
            {assetType}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {expectedReturns && (
          <p className="text-sm font-semibold text-blue-600 text-center">
            Returns: {expectedReturns}
          </p>
        )}
        {duration && (
          <p className="text-sm font-semibold text-purple-600 text-center">
            Duration: {duration} days
          </p>
        )}
        {minimumInvestment && (
          <p className="text-sm font-semibold text-green-600 text-center col-span-2">
            Min. Investment: ${minimumInvestment.toLocaleString()}
          </p>
        )}
        {/* Display calculated daily return */}
        {expectedReturns && duration && (
          <p className="text-sm font-medium text-indigo-600 text-center col-span-2 mt-1">
            {parseFloat(expectedReturns) > 0 && 
              `(~${(parseFloat(expectedReturns) / parseInt(duration)).toFixed(3)}% per day)`
            }
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-3 mt-auto">
        {showInvestButton && (
          <button 
            onClick={() => setShowInvestmentForm(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Invest Now
          </button>
        )}
        <button 
          onClick={onLearnMore}
          className="w-full bg-gradient-to-r from-teal-400 to-purple-600 hover:from-teal-500 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Learn More
        </button>
      </div>
      
      {/* Investment Form Modal */}
      {showInvestmentForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowInvestmentForm(false)}></div>
            <div className="relative inline-block w-full max-w-2xl bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={() => setShowInvestmentForm(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Invest in {title}</h3>
                {/* Log the ID for debugging */}
                {console.log('Investment Card ID being passed:', id)}
                <InvestmentForm 
                  planId={id} 
                  onSuccess={() => {
                    setShowInvestmentForm(false);
                  }}
                  onCancel={() => setShowInvestmentForm(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentCard;
