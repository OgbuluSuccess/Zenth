import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const RegisterAdmin = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: '',
    agreeTerms: false
  });

  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    
    if (!formData.agreeTerms) {
      setFormError('You must agree to the terms and conditions.');
      return;
    }

    // Admin key validation (this should be a secure value stored on the server)
    const validAdminKeys = {
      'zynith-admin-2025': 'admin',
      'zynith-super-2025': 'superadmin'
    };
    
    if (!validAdminKeys[formData.adminKey]) {
      setFormError('Invalid admin key. Please contact the system administrator.');
      return;
    }
    
    // Set the appropriate role based on the admin key
    const adminRole = validAdminKeys[formData.adminKey];

    // Prepare user data for API
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password,
      role: adminRole // Set role based on the admin key
    };

    try {
      setIsLoading(true);
      const response = await register(userData);
      
      // If registration successful
      if (response.success) {
        console.log('Admin registration successful:', response);
        
        // Update auth context with user data
        loginUser(response.user);
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFormError(error.message || 'Registration failed. Please try again.');
      
      // Keep form data on error
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
        adminKey: ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Welcome Area */}
      <div className="breadcumb-area clearfix auto-init">
        <div className="breadcumb-content">
          <div className="container h-100">
            <div className="row h-100 align-items-center">
              <div className="col-12">
                <nav aria-label="breadcrumb" className="breadcumb--con text-center">
                  <h2 className="w-text title wow fadeInUp" data-wow-delay="0.2s">Admin Registration</h2>
                  <ol className="breadcrumb justify-content-center wow fadeInUp" data-wow-delay="0.4s">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Admin Registration</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Area */}
      <section className="section-padding-100-0 contact_us_area" id="contact">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="contact_form">
                <div className="section-heading text-center">
                  <div className="dream-dots justify-content-center wow fadeInUp" data-wow-delay="0.2s">
                    <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                  </div>
                  <h2 className="wow fadeInUp" data-wow-delay="0.3s">Create Admin Account</h2>
                  <p className="wow fadeInUp" data-wow-delay="0.4s">Register a new administrator for the Zynith Investment Platform</p>
                </div>
                
                {formError && (
                  <div className="alert alert-danger" role="alert">
                    {formError}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="form-horizontal">
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="group wow fadeInUp" data-wow-delay="0.2s">
                        <input 
                          type="text" 
                          name="firstName" 
                          id="admin-firstName" 
                          value={formData.firstName} 
                          onChange={handleChange} 
                          required 
                        />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label>First Name</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="group wow fadeInUp" data-wow-delay="0.3s">
                        <input 
                          type="text" 
                          name="lastName" 
                          id="admin-lastName" 
                          value={formData.lastName} 
                          onChange={handleChange} 
                          required 
                        />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label>Last Name</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="group wow fadeInUp" data-wow-delay="0.4s">
                        <input 
                          type="email" 
                          name="email" 
                          id="admin-email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          required 
                        />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label>Email</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="group wow fadeInUp" data-wow-delay="0.5s">
                        <input 
                          type="password" 
                          name="password" 
                          id="admin-password" 
                          value={formData.password} 
                          onChange={handleChange} 
                          required 
                        />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label>Password</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="group wow fadeInUp" data-wow-delay="0.6s">
                        <input 
                          type="password" 
                          name="confirmPassword" 
                          id="admin-confirmPassword" 
                          value={formData.confirmPassword} 
                          onChange={handleChange} 
                          required 
                        />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label>Confirm Password</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="group wow fadeInUp" data-wow-delay="0.7s">
                        <input 
                          type="password" 
                          name="adminKey" 
                          id="admin-key" 
                          value={formData.adminKey} 
                          onChange={handleChange} 
                          required 
                        />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label>Admin Registration Key</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="agree-terms d-flex align-items-center mb-4 wow fadeInUp" data-wow-delay="0.8s">
                        <div className="terms-check">
                          <input 
                            type="checkbox" 
                            id="admin-agreeTerms" 
                            name="agreeTerms" 
                            checked={formData.agreeTerms} 
                            onChange={handleChange} 
                            required 
                          />
                          <label htmlFor="admin-agreeTerms">
                            I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 text-center wow fadeInUp" data-wow-delay="0.9s">
                      <button type="submit" className="btn dream-btn" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Admin Account'}
                      </button>
                    </div>
                    <div className="col-12 text-center mt-4 wow fadeInUp" data-wow-delay="1.0s">
                      <p>Already have an account? <Link to="/login" className="login-link">Login</Link></p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Admin Login Info - This would typically be hidden or on a separate page */}
      <div className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-6">
            <div className="mt-4 p-3 bg-light rounded">
              <h5 className="mb-3">Admin Login Information</h5>
              <p className="mb-2">For admin registration, use these secret codes:</p>
              <ul className="mb-0">
                <li>Regular Admin: <code>zynith-admin-2025</code></li>
                <li>Super Admin: <code>zynith-super-2025</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default RegisterAdmin;
