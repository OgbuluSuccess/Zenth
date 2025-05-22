import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Prepare user data for API
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password
    };

    try {
      setIsLoading(true);
      const response = await register(userData);
      
      // If registration successful
      if (response.success) {
        console.log('Registration successful:', response);
        
        // Update auth context with user data
        loginUser(response.user);
        
        // Redirect to dashboard since we're automatically logged in after registration
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFormError(error.message || 'Registration failed. Please try again.');
      
      // Keep form data on error
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
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
                  <h2 className="w-text title wow fadeInUp" data-wow-delay="0.2s">Register</h2>
                  <ol className="breadcrumb justify-content-center wow fadeInUp" data-wow-delay="0.4s">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Register</li>
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
                  <h2 className="wow fadeInUp" data-wow-delay="0.3s">Create Your Account</h2>
                  <p className="wow fadeInUp" data-wow-delay="0.4s">Join Zynith Investments and start your investment journey today</p>
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
                          id="firstName" 
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
                          id="lastName" 
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
                          id="email" 
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
                          id="password" 
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
                          id="confirmPassword" 
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
                      <div className="agree-terms d-flex align-items-center mb-4 wow fadeInUp" data-wow-delay="0.7s">
                        <div className="terms-check">
                          <input 
                            type="checkbox" 
                            id="agreeTerms" 
                            name="agreeTerms" 
                            checked={formData.agreeTerms} 
                            onChange={handleChange} 
                            required 
                          />
                          <label htmlFor="agreeTerms">
                            I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 text-center wow fadeInUp" data-wow-delay="0.8s">
                      <button type="submit" className="btn dream-btn">Create Account</button>
                    </div>
                    <div className="col-12 text-center mt-4 wow fadeInUp" data-wow-delay="0.9s">
                      <p>Already have an account? <Link to="/login" className="login-link">Login</Link></p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
