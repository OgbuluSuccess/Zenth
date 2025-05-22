import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import InvestmentCard from '../../components/InvestmentCard'; // Import the new card component

const InvestmentPlansManager = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    targetAudience: '',
    description: '',
    minimumInvestment: 0,
    duration: '', // Flexible duration in days
    assets: [
      { name: '', percentage: 0 }
    ],
    expectedReturns: '',
    returnRate: '', // Rate of return (e.g., percentage per month)
    riskLevel: 'Medium', // Default value
    features: [''],
    whyGreat: '',
    isActive: true
  });

  // Fetch all investment plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/investment-plans');
        setPlans(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching investment plans:', err);
        setError('Failed to load investment plans. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle asset changes
  const handleAssetChange = (index, field, value) => {
    const updatedAssets = [...formData.assets];
    updatedAssets[index] = {
      ...updatedAssets[index],
      [field]: field === 'percentage' ? Number(value) : value
    };
    setFormData({ ...formData, assets: updatedAssets });
  };

  // Add new asset field
  const addAsset = () => {
    setFormData({
      ...formData,
      assets: [...formData.assets, { name: '', percentage: 0 }]
    });
  };

  // Remove asset field
  const removeAsset = (index) => {
    const updatedAssets = [...formData.assets];
    updatedAssets.splice(index, 1);
    setFormData({ ...formData, assets: updatedAssets });
  };

  // Handle feature changes
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };

  // Add new feature field
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  // Remove feature field
  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({ ...formData, features: updatedFeatures });
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      name: '',
      targetAudience: '',
      description: '',
      minimumInvestment: 0,
      duration: '', // Flexible duration in days
      assets: [{ name: '', percentage: 0 }],
      expectedReturns: '',
      returnRate: '', // Rate of return
      riskLevel: 'Medium',
      features: [''],
      whyGreat: '',
      isActive: true
    });
    setEditingPlan(null);
  };

  // Open form for editing
  const handleEdit = (plan) => {
    setEditingPlan(plan._id);
    setFormData({
      name: plan.name,
      targetAudience: plan.targetAudience,
      description: plan.description,
      minimumInvestment: plan.minimumInvestment,
      duration: plan.duration || '', // Use existing duration
      assets: plan.assets.length > 0 ? plan.assets : [{ name: '', percentage: 0 }],
      expectedReturns: plan.expectedReturns,
      returnRate: plan.returnRate || '', // Use existing return rate if available
      riskLevel: plan.riskLevel,
      features: plan.features.length > 0 ? plan.features : [''],
      whyGreat: plan.whyGreat || '',
      isActive: plan.isActive
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.description || !formData.targetAudience || 
        formData.minimumInvestment <= 0 || !formData.expectedReturns || 
        !formData.duration || !formData.returnRate) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Make sure duration and return rate are valid numbers
    if (isNaN(parseFloat(formData.duration)) || parseFloat(formData.duration) <= 0) {
      setError('Duration must be a positive number');
      return;
    }
    
    if (isNaN(parseFloat(formData.returnRate)) || parseFloat(formData.returnRate) < 0) {
      setError('Return rate must be a non-negative number');
      return;
    }

    // Validate assets total percentage equals 100%
    const totalPercentage = formData.assets.reduce((sum, asset) => sum + Number(asset.percentage), 0);
    if (Math.abs(totalPercentage - 100) > 0.1) { // Allow small rounding errors
      setError('Asset allocation percentages must total 100%');
      return;
    }

    try {
      setFormSubmitting(true);
      setError(null);

      if (editingPlan) {
        // Update existing plan
        await axios.put(`http://localhost:5000/api/investment-plans/${editingPlan}`, formData);
        setSuccessMessage('Investment plan updated successfully!');
      } else {
        // Create new plan
        await axios.post('http://localhost:5000/api/investment-plans', formData);
        setSuccessMessage('Investment plan created successfully!');
      }

      // Refresh plans list
      const { data } = await axios.get('http://localhost:5000/api/investment-plans');
      setPlans(data);
      
      // Reset form and state
      resetForm();
      setShowForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving investment plan:', err);
      setError(err.response?.data?.message || 'Failed to save investment plan. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle plan deletion/deactivation
  const handleDelete = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this investment plan?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/investment-plans/${planId}`);
      
      // Refresh plans list
      const { data } = await axios.get('http://localhost:5000/api/investment-plans');
      setPlans(data);
      
      setSuccessMessage('Investment plan deleted successfully!');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting investment plan:', err);
      setError(err.response?.data?.message || 'Failed to delete investment plan. Please try again.');
    }
  };

  // Toggle plan active status
  const toggleActive = async (plan) => {
    try {
      await axios.put(`http://localhost:5000/api/investment-plans/${plan._id}`, {
        ...plan,
        isActive: !plan.isActive
      });
      
      // Refresh plans list
      const { data } = await axios.get('http://localhost:5000/api/investment-plans');
      setPlans(data);
      
      setSuccessMessage(`Investment plan ${plan.isActive ? 'deactivated' : 'activated'} successfully!`);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating investment plan status:', err);
      setError(err.response?.data?.message || 'Failed to update investment plan status. Please try again.');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading investment plans...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm mb-6 rounded-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Investment Plans Manager</h1>
              <p className="text-sm text-gray-500">Manage your platform's investment offerings</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search plans..." 
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <i className="fa fa-search"></i>
                </div>
              </div>
              <button 
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                {showForm ? 'Cancel' : 'Add New Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Alerts Section */}
        {(successMessage || error) && (
          <div className="mb-6">
            <div className={`flex justify-between items-center p-3 rounded-lg ${
              successMessage ? 'bg-green-50 text-green-700 border border-green-200' : 
              'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <div>
                <span className="font-semibold">{successMessage ? 'Success:' : 'Error:'}</span> {successMessage || error}
              </div>
            </div>
          </div>
        )}

        {/* Form for adding/editing plans */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{editingPlan ? 'Edit Investment Plan' : 'Create New Investment Plan'}</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Plan Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience *</label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Minimum Investment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Investment ($) *</label>
                <input
                  type="number"
                  name="minimumInvestment"
                  value={formData.minimumInvestment}
                  onChange={handleInputChange}
                  min="0"
                  step="100"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days) *</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={(e) => {
                    // Update duration and recalculate expected returns if return rate exists
                    const newDuration = e.target.value;
                    const returnRate = formData.returnRate;
                    
                    setFormData({
                      ...formData,
                      duration: newDuration,
                      // Update expected returns if we have both duration and return rate
                      expectedReturns: returnRate && newDuration ? 
                        `${(parseFloat(returnRate) * (parseInt(newDuration) / 30)).toFixed(2)}%` : 
                        formData.expectedReturns
                    });
                  }}
                  min="1"
                  step="1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              {/* Return Rate (per month) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Rate (% per month) *</label>
                <input
                  type="number"
                  name="returnRate"
                  value={formData.returnRate}
                  onChange={(e) => {
                    // Update return rate and recalculate expected returns if duration exists
                    const newReturnRate = e.target.value;
                    const duration = formData.duration;
                    
                    setFormData({
                      ...formData,
                      returnRate: newReturnRate,
                      // Update expected returns if we have both duration and return rate
                      expectedReturns: newReturnRate && duration ? 
                        `${(parseFloat(newReturnRate) * (parseInt(duration) / 30)).toFixed(2)}%` : 
                        formData.expectedReturns
                    });
                  }}
                  min="0"
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              {/* Expected Returns (calculated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Returns *</label>
                <input
                  type="text"
                  name="expectedReturns"
                  value={formData.expectedReturns}
                  onChange={handleInputChange}
                  placeholder="Calculated based on duration and rate"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Auto-calculated, but can be manually adjusted</p>
              </div>

              {/* Risk Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level *</label>
                <select
                  name="riskLevel"
                  value={formData.riskLevel}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Asset Allocation */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Allocation *</label>
              <p className="text-xs text-gray-500 mb-2">Specify the assets and their allocation percentages (must total 100%)</p>
              
              {formData.assets.map((asset, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={asset.name}
                    onChange={(e) => handleAssetChange(index, 'name', e.target.value)}
                    placeholder="Asset name (e.g., Bitcoin)"
                    className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-primary focus:border-primary"
                    required
                  />
                  <div className="flex items-center border-t border-b border-r border-gray-300 rounded-r-md">
                    <input
                      type="number"
                      value={asset.percentage}
                      onChange={(e) => handleAssetChange(index, 'percentage', e.target.value)}
                      min="0"
                      max="100"
                      className="w-16 p-2 focus:ring-primary focus:border-primary"
                      required
                    />
                    <span className="pr-2">%</span>
                  </div>
                  
                  {formData.assets.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeAsset(index)}
                      className="ml-2 p-2 text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  )}
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={addAsset}
                className="mt-2 text-sm text-primary hover:text-primary-dark"
              >
                <i className="fas fa-plus mr-1"></i> Add Another Asset
              </button>
            </div>

            {/* Features */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
              
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Feature description"
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                  
                  {formData.features.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeFeature(index)}
                      className="ml-2 p-2 text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  )}
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={addFeature}
                className="mt-2 text-sm text-primary hover:text-primary-dark"
              >
                <i className="fas fa-plus mr-1"></i> Add Another Feature
              </button>
            </div>

            {/* Why It's Great */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Why It's Great</label>
              <textarea
                name="whyGreat"
                value={formData.whyGreat}
                onChange={handleInputChange}
                rows="2"
                placeholder="Explain why this plan is great for investors"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              ></textarea>
            </div>

            {/* Active Status */}
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active (visible to users)
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={formSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
                disabled={formSubmitting}
              >
                {formSubmitting ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}
              </button>
            </div>
          </form>
          </div>
          </div>
        )}

        {/* Display Investment Plans in Cards when form is not shown */}
        {!showForm && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 my-6">Available Investment Plans</h2>
            {plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {plans.map((plan) => (
                  <InvestmentCard
                    key={plan._id}
                    id={plan._id}
                    iconUrl={plan.iconUrl || '/placeholder-icon.svg'} // Assuming you might add iconUrl to plan data, or use a placeholder
                    title={plan.name}
                    description={plan.description}
                    riskLevel={plan.riskLevel}
                    assetType={plan.assets && plan.assets.length > 0 ? plan.assets[0].name : 'General'}
                    expectedReturns={plan.expectedReturns}
                    duration={plan.duration}
                    minimumInvestment={plan.minimumInvestment}
                    onLearnMore={() => handleEdit(plan)} // Use handleEdit to open the form for this plan
                  />
                ))}
              </div>
            ) : (
              !loading && <p className="text-center text-gray-500">No investment plans available. Click 'Add New Plan' to create one.</p>
            )}
          </div>
        )}

        {/* Plans List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Existing Plans</h2>
              <button 
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                className="text-sm text-primary hover:text-primary-dark"
              >
                {showForm ? 'Cancel Form' : 'Add New Plan'}
              </button>
            </div>
        
          {loading ? (
            <p className="text-center text-gray-500 py-4">Loading investment plans...</p>
          ) : plans.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No investment plans found. Create your first plan above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min. Investment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plans.map((plan) => (
                    <tr key={plan._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                        <div className="text-xs text-gray-500">{plan.targetAudience}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${plan.minimumInvestment.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{plan.duration} days</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{plan.expectedReturns}</div>
                        {plan.returnRate && (
                          <div className="text-xs text-gray-500">
                            Rate: {plan.returnRate}% per month
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${plan.riskLevel === 'Low' ? 'bg-green-100 text-green-800' : 
                            plan.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {plan.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div>
                          <button
                            onClick={() => handleEdit(plan)}
                            className="text-primary hover:text-primary-dark mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleActive(plan)}
                            className={`${plan.isActive ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'} mr-3`}
                          >
                            {plan.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(plan._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestmentPlansManager;
