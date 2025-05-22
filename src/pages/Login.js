import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
    
    if (!formData.email || !formData.password) {
      setFormError('Please enter both email and password.');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await login(formData.email, formData.password);
      
      // If login successful, store user data and redirect
      if (response.success) {
        console.log('Login successful:', response);
        
        // Update auth context with user data
        loginUser(response.user);
        
        // If remember me is checked, we already stored the token in localStorage in the service
        // If not checked, we could use sessionStorage instead (would need to modify the service)
        if (response.user.role === 'admin' || response.user.role === 'superadmin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setFormError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Welcome Area */}
      <div className="breadcumb-area clearfix auto-init">
        <div className="breadcumb-content">
          <div className="container h-100">
            <div className="row h-100 align-items-center">
              <div className="col-12">
                <nav aria-label="breadcrumb" className="breadcumb--con text-center">
                  <h2 className="w-text title wow fadeInUp" data-wow-delay="0.2s">Login</h2>
                  <ol className="breadcrumb justify-content-center wow fadeInUp" data-wow-delay="0.4s">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Login</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Area */}
      <section className="section-padding-100-0 contact_us_area" id="contact">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-6">
              <div className="contact_form">
                <div className="section-heading text-center">
                  <div className="dream-dots justify-content-center wow fadeInUp" data-wow-delay="0.2s">
                    <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                  </div>
                  <h2 className="wow fadeInUp" data-wow-delay="0.3s">Login to Your Account</h2>
                  <p className="wow fadeInUp" data-wow-delay="0.4s">Enter your credentials to access your account</p>
                </div>
                
                {formError && (
                  <div className="alert alert-danger" role="alert">
                    {formError}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="form-horizontal">
                  <div className="row">
                    <div className="col-12">
                      <div className="group wow fadeInUp" data-wow-delay="0.2s">
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
                      <div className="group wow fadeInUp" data-wow-delay="0.3s">
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
                      <div className="forgot-pass-remember d-flex justify-content-between align-items-center mb-4 wow fadeInUp" data-wow-delay="0.4s">
                        <div className="remember-me">
                          <input 
                            type="checkbox" 
                            id="rememberMe" 
                            name="rememberMe" 
                            checked={formData.rememberMe} 
                            onChange={handleChange} 
                          />
                          <label htmlFor="rememberMe">Remember me</label>
                        </div>
                        <div className="forgot-password">
                          <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 text-center wow fadeInUp" data-wow-delay="0.5s">
                      <button type="submit" className="btn dream-btn">Login</button>
                    </div>
                    <div className="col-12 text-center mt-4 wow fadeInUp" data-wow-delay="0.6s">
                      <p>Don't have an account? <Link to="/register" className="register-link">Register Now</Link></p>
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

export default Login;
