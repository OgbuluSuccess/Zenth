import React, { useState, useEffect } from 'react';
import config from '../config';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InvestmentCard from '../components/InvestmentCard'; // Import the reusable card component

const Home = () => {
  // State for investment plans
  const [investmentPlans, setInvestmentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to determine icon based on plan type
  const getIconForPlan = (plan) => {
    // First check if the plan has assets and use the first asset type to determine icon
    if (plan.assets && plan.assets.length > 0) {
      const assetType = plan.assets[0].name.toLowerCase();
      
      if (assetType.includes('stock') || assetType.includes('equity')) {
        return '/img/icons/stocks-icon.svg';
      } else if (assetType.includes('real estate') || assetType.includes('property')) {
        return '/img/icons/real-estate-icon.svg';
      } else if (assetType.includes('crypto') || assetType.includes('bitcoin') || assetType.includes('ethereum')) {
        return '/img/icons/bitcoin-icon.svg';
      } else if (assetType.includes('bond') || assetType.includes('fixed income')) {
        return '/img/icons/bonds-icon.svg';
      }
    }
    
    // If no specific asset type is found, determine by plan name
    const planName = plan.name.toLowerCase();
    if (planName.includes('stock') || planName.includes('equity')) {
      return '/img/icons/stocks-icon.svg';
    } else if (planName.includes('real estate') || planName.includes('property')) {
      return '/img/icons/real-estate-icon.svg';
    } else if (planName.includes('crypto') || planName.includes('bitcoin') || planName.includes('ethereum')) {
      return '/img/icons/bitcoin-icon.svg';
    } else if (planName.includes('bond') || planName.includes('fixed income')) {
      return '/img/icons/bonds-icon.svg';
    }
    
    // Default icon if no specific type is determined
    return '/img/icons/investment-placeholder.svg';
  };

  // Fetch investment plans from the backend
  useEffect(() => {
    const fetchInvestmentPlans = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${config.apiUrl}/investment-plans`);
        // Only show active plans and limit to 4 for the featured section
        const activePlans = data.filter(plan => plan.isActive).slice(0, 4);
        setInvestmentPlans(activePlans);
        setError(null);
      } catch (err) {
        console.error('Error fetching investment plans:', err);
        setError('Failed to load investment plans');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentPlans();
  }, []);

  return (
    <div className="home-page">
      {/* Login popup form */}
      <div id="login-popup" className="white-popup mfp-hide">
        <div className="top-form-header">
          <h4>Login Form</h4>
        </div>
        <form action="#" method="post" id="main_login_form" noValidate="">
          <div className="row">
            <div className="col-12 col-md-12">
              <div className="group">
                <input type="text" name="name" id="name0" required="" />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Email</label>
              </div>
            </div>
            <div className="col-12 col-md-12">
              <div className="group">
                <input type="password" name="name" id="name1" required="" />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Password</label>
              </div>
            </div>
            <div className="col-12 col-sm-5 text-left">
              <button type="submit" className="btn dream-btn">Login</button>
            </div>
            <div className="col-12 col-sm-7 text-left">
              <p className="mb-0 mt-10">Don't have an account? <Link to="/register">Sign up</Link></p>
            </div>
          </div>
        </form>

        <div className="other-accounts text-center">
          <p className="w-text">Login with other account</p>
          <div className="footer-social-info">
            <a href="#"><i className="fa fa-facebook" aria-hidden="true"></i></a>
            <a href="#"><i className="fa fa-twitter" aria-hidden="true"></i></a>
            <a href="#"><i className="fa fa-google-plus" aria-hidden="true"></i></a>
            <a href="#"><i className="fa fa-instagram" aria-hidden="true"></i></a>
            <a href="#"><i className="fa fa-linkedin" aria-hidden="true"></i></a>
          </div>
        </div>
      </div>
      
      {/* Signup popup form */}
      <div id="signup-popup" className="white-popup mfp-hide">
        <div className="top-form-header">
          <h4>Signup Form</h4>
        </div>
        <form action="#" method="post" id="main_Signup_form" noValidate="">
          <div className="row">
            <div className="col-12 col-md-12">
              <div className="group">
                <input type="text" name="name" id="name3" required="" />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Name</label>
              </div>
            </div>
            <div className="col-12 col-md-12">
              <div className="group">
                <input type="text" name="email" id="name4" required="" />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Email</label>
              </div>
            </div>
            <div className="col-12 col-md-12">
              <div className="group">
                <input type="text" name="username" id="username" required="" />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Username (Optional)</label>
              </div>
            </div>
            <div className="col-12 col-md-12">
              <div className="group">
                <input type="password" name="password" id="name5" required="" />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Password</label>
              </div>
            </div>
            <div className="col-12 col-md-12">
              <div className="group">
                <input type="password" name="confirm_password" id="name6" required="" />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Confirm Password</label>
              </div>
            </div>
            <div className="col-12">
              <div className="admin-register-toggle">
                <a href="#" className="toggle-admin-section">Admin Registration</a>
                <div className="admin-register-section" style={{ display: 'none' }}>
                  <div className="group">
                    <input type="text" name="admin_code" id="admin_code" />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label>Admin Code</label>
                    <small className="text-muted">Enter code for admin access</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-5 text-left">
              <button type="submit" className="btn dream-btn">Sign Up</button>
            </div>
            <div className="col-12 col-sm-7 text-left">
              <p className="mb-0 mt-10">Already have an account? <Link to="/login">Log in</Link></p>
            </div>
          </div>
        </form>

        <div className="other-accounts text-center">
          <p className="w-text">Sign up with other account</p>
          <div className="footer-social-info">
            <a href="#"><i className="fa fa-facebook" aria-hidden="true"></i></a>
            <a href="#"><i className="fa fa-twitter" aria-hidden="true"></i></a>
            <a href="#"><i className="fa fa-google-plus" aria-hidden="true"></i></a>
            <a href="#"><i className="fa fa-instagram" aria-hidden="true"></i></a>
            <a href="#"><i className="fa fa-linkedin" aria-hidden="true"></i></a>
          </div>
        </div>
      </div>

      {/* Welcome Area Start */}
      <section className="welcome_area demo2 flex align-items-center">
        <div className="container">
          <div className="row align-items-center">
            {/* Welcome Content */}
            <div className="col-12 col-lg-6 col-md-12">
              <div className="welcome-content v2">
                <div className="promo-section">
                  <div className="integration-link light">
                    <span className="integration-icon">
                      <img src="img/svg/img-dollar.svg" width="24" height="24" alt="" />
                    </span>
                    <span className="integration-text">Modern Investment Platform for Smart Investors</span>
                  </div>
                </div>
                <h1 className="wow fadeInUp w-text" data-wow-delay="0.2s">Explore, Invest, and Grow Your Wealth</h1>
                <p className="wow fadeInUp" data-wow-delay="0.3s">Zynith offers a comprehensive investment platform with diverse options including stocks, bonds, real estate, and cryptocurrencies. Manage your portfolio, track performance, and make informed investment decisions.</p>
                <div className="dream-btn-group wow fadeInUp" data-wow-delay="0.4s">
                  
                  <a href="/register" className="btn dream-btn green-btn open-signup-link">Get Started</a>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 col-md-12">
              <div className="banner-box">
                <img src="img/core-img/banner2.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Welcome Area End */}

      <div className="clearfix"></div>

      <div className="st-bg">
        {/* Cool Facts Area Start */}
        <div className="cool-facts-area">
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm-6 col-md-3">
                {/* Single Cool Fact */}
                <div className="single_cool_fact text-center wow fadeInUp" data-wow-delay="0.2s">
                  <div className="cool_fact_icon">
                    <i className="ti-user"></i>
                  </div>
                  {/* Single Cool Detail */}
                  <div className="cool_fact_detail">
                    <h3><span className="counter">3215</span>+</h3>
                    <h2>Happy Investors</h2>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                {/* Single Cool Fact */}
                <div className="single_cool_fact text-center wow fadeInUp" data-wow-delay="0.3s">
                  <div className="cool_fact_icon">
                    <i className="ti-check"></i>
                  </div>
                  {/* Single Cool Detail */}
                  <div className="cool_fact_detail">
                    <h3><span className="counter">784</span>K+</h3>
                    <h2>Active Portfolios</h2>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                {/* Single Cool Fact */}
                <div className="single_cool_fact text-center wow fadeInUp" data-wow-delay="0.4s">
                  <div className="cool_fact_icon">
                    <i className="ti-shortcode"></i>
                  </div>
                  {/* Single Cool Detail */}
                  <div className="cool_fact_detail">
                    <h3><span className="counter">13658</span>+</h3>
                    <h2>Investments Made</h2>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                {/* Single Cool Fact */}
                <div className="single_cool_fact text-center wow fadeInUp" data-wow-delay="0.5s">
                  <div className="cool_fact_icon">
                    <i className="ti-cup"></i>
                  </div>
                  {/* Single Cool Detail */}
                  <div className="cool_fact_detail">
                    <h3><span className="counter">23</span>+</h3>
                    <h2>Years of Experience</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Cool Facts Area End */}

        {/* About Us Area Start */}
        <section className="about-us-area section-padding-0-100 clearfix" id="about">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-lg-6">
                <div className="welcome-meter fadeInUp" data-wow-delay="0.7s">
                  <img src="img/core-img/about.png" className="img-responsive center-block" alt="" />
                  {/* client meta */}
                  <div className="growing-company text-center mt-30 fadeInUp" data-wow-delay="0.8s">
                    <p>* Already growing up <span className="counter">5236</span> company</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <div className="who-we-contant mt-s">
                  <div className="dream-dots fadeInUp" data-wow-delay="0.2s">
                    <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                  </div>
                  <h4 className="fadeInUp" data-wow-delay="0.3s">Why Choose Zynith Investment Platform?</h4>
                  <p className="fadeInUp" data-wow-delay="0.4s">At Zynith, we're committed to providing a secure, transparent, and user-friendly investment experience. Our platform offers diverse investment options across multiple asset classes, including traditional investments and cryptocurrencies.</p>
                  <p className="fadeInUp" data-wow-delay="0.5s">With robust security features, real-time market data, and personalized portfolio management tools, we empower investors to make informed decisions and achieve their financial goals.</p>
                  <a className="btn dream-btn mt-30 fadeInUp" data-wow-delay="0.6s" href="#">Read More</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* About Us Area End */}

        {/* About Us Area Start */}
        <section className="about-us-area section-padding-0-100 clearfix">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-lg-6">
                <div className="who-we-contant">
                  <div className="dream-dots fadeInUp" data-wow-delay="0.2s">
                    <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                  </div>
                  <h4 className="fadeInUp" data-wow-delay="0.3s">Comprehensive Investment Solutions</h4>
                  <p className="fadeInUp" data-wow-delay="0.4s">Zynith offers a wide range of investment options to diversify your portfolio. From traditional stocks and bonds to real estate opportunities and cutting-edge cryptocurrency investments, we provide access to multiple asset classes all in one platform.</p>
                  <p className="fadeInUp" data-wow-delay="0.5s">Our crypto-specific features include wallet integration, real-time price tracking, and secure transaction processing. With our role-based access control system, we ensure that your investments are secure while providing you with the tools you need to succeed.</p>
                  <a className="btn dream-btn mt-30 fadeInUp" data-wow-delay="0.6s" href="#">Read More</a>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <div className="welcome-meter fadeInUp mt-s" data-wow-delay="0.7s">
                  <img src="img/core-img/about2.png" className="center-block" alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* About Us Area End */}

        <section className="demo-video feat section-padding-0-100">
          <div className="container">
            <div className="section-heading text-center">
              <div className="dream-dots justify-content-center wow fadeInUp" data-wow-delay="0.2s">
                <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
              </div>
              <h2 className="d-blue fadeInUp" data-wow-delay="0.3s">See How Zynith Works</h2>
              <p className="fadeInUp" data-wow-delay="0.4s" style={{color:'#888'}}>Watch our demo video to learn how Zynith can help you build and manage your investment portfolio across multiple asset classes.</p>
            </div>
            <div className="row align-items-center">
              {/* Welcome Video Area */}
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="welcome-video-area fadeInUp" data-wow-delay="0.5s">
                  {/* Welcome Thumbnail */}
                  <div className="welcome-thumb">
                    <img src="img/bg-img/bg-4.jpg" alt="" />
                  </div>
                  {/* Video Icon */}
                  <div className="video-icon">
                    <a href="https://www.youtube.com/watch?v=gbXEPHsTkgU" className="btn dream-btn video-btn" id="videobtn"><i className="fa fa-play"></i></a>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="services-block-four mt-s">
                  <div className="inner-box">
                    <div className="icon-img-box">
                      <img src="img/icons/d1.png" alt="" />
                    </div>
                    <h3><a href="#">Portfolio Management</a></h3>
                    <div className="text">Track and manage your investments in real-time with our intuitive portfolio dashboard.</div>
                  </div>
                </div>
                <div className="services-block-four">
                  <div className="inner-box">
                    <div className="icon-img-box">
                      <img src="img/icons/d2.png" alt="" />
                    </div>
                    <h3><a href="#">Crypto Integration</a></h3>
                    <div className="text">Connect your crypto wallets and track your cryptocurrency investments alongside traditional assets.</div>
                  </div>
                </div>
                <div className="services-block-four" style={{marginBottom:0}}>
                  <div className="inner-box">
                    <div className="icon-img-box">
                      <img src="img/icons/d3.png" alt="" />
                    </div>
                    <h3><a href="#">Lots of ilustration Options</a></h3>
                    <div className="text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium modi.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services Area Start */}
        <section className="our_services_area section-padding-0-70 clearfix" id="services">
          <div className="container">
            <div className="section-heading text-center">
              <div className="dream-dots justify-content-center wow fadeInUp" data-wow-delay="0.2s">
                <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
              </div>
              <h2 className="wow fadeInUp" data-wow-delay="0.3s">Investment Options</h2>
              <p className="wow fadeInUp" data-wow-delay="0.4s">Explore our diverse range of investment opportunities designed to help you achieve your financial goals. From traditional assets to cutting-edge cryptocurrency options, we have something for every investor.</p>
            </div>

            <div className="row">
              <div className="col-12 col-sm-6 col-lg-4">
                {/* Content */}
                <div className="service_single_content text-center mb-100 wow fadeInUp" data-wow-delay="0.2s">
                  {/* Icon */}
                  <div className="service_icon">
                    <img src="img/services/1.svg" alt="" />
                  </div>
                  <h6>Stocks</h6>
                  <p>Invest in a carefully curated selection of stocks from top-performing companies across various sectors with potential for growth and dividends.</p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                {/* Content */}
                <div className="service_single_content text-center mb-100 wow fadeInUp" data-wow-delay="0.3s">
                  {/* Icon */}
                  <div className="service_icon">
                    <img src="img/services/2.svg" alt="" />
                  </div>
                  <h6>Bonds</h6>
                  <p>Explore our range of corporate and government bonds offering stable returns and lower risk profiles for conservative investors.</p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                {/* Content */}
                <div className="service_single_content text-center mb-100 wow fadeInUp" data-wow-delay="0.4s">
                  {/* Icon */}
                  <div className="service_icon">
                    <img src="img/services/3.svg" alt="" />
                  </div>
                  <h6>Real Estate</h6>
                  <p>Diversify your portfolio with real estate investment opportunities in residential, commercial, and industrial properties.</p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                {/* Content */}
                <div className="service_single_content text-center mb-100 wow fadeInUp" data-wow-delay="0.5s">
                  {/* Icon */}
                  <div className="service_icon">
                    <img src="img/services/4.svg" alt="" />
                  </div>
                  <h6>Cryptocurrency</h6>
                  <p>Explore the world of digital assets with our secure cryptocurrency investment options, including Bitcoin, Ethereum, and other altcoins.</p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                {/* Content */}
                <div className="service_single_content text-center mb-100 wow fadeInUp" data-wow-delay="0.6s">
                  {/* Icon */}
                  <div className="service_icon">
                    <img src="img/services/5.svg" alt="" />
                  </div>
                  <h6>Managed Portfolios</h6>
                  <p>Let our expert team manage your investments with professionally curated portfolios tailored to your risk profile and financial goals.</p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                {/* Content */}
                <div className="service_single_content text-center mb-100 wow fadeInUp" data-wow-delay="0.7s">
                  {/* Icon */}
                  <div className="service_icon">
                    <img src="img/services/6.svg" alt="" />
                  </div>
                  <h6>Retirement Planning</h6>
                  <p>Secure your future with our specialized retirement investment plans designed to provide financial stability during your golden years.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Our Services Area End */}
      </div>

      <div className="clearfix"></div>

      {/* Featured Investments */}
      <section className="our_services_area section-padding-100-0 clearfix" id="services">
        <div className="container">
          <div className="section-heading text-center">
            <div className="dream-dots justify-content-center wow fadeInUp" data-wow-delay="0.2s">
              <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <h2 className="wow fadeInUp" data-wow-delay="0.3s">Featured Investments</h2>
            <p className="wow fadeInUp" data-wow-delay="0.4s">Explore our carefully selected investment opportunities</p>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-3">Loading investment opportunities...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          ) : investmentPlans.length === 0 ? (
            <div className="text-center py-5">
              <p>No investment plans available at the moment. Please check back soon!</p>
            </div>
          ) : (
            <div className="row">
              {investmentPlans.map(plan => (
                <div key={plan._id} className="col-12 col-sm-6 col-lg-3 mb-4">
                  <InvestmentCard
                    iconUrl={getIconForPlan(plan)}
                    title={plan.name}
                    description={plan.description}
                    riskLevel={plan.riskLevel}
                    assetType={plan.assets && plan.assets.length > 0 ? plan.assets[0].name : 'Various'}
                    expectedReturns={plan.expectedReturns}
                    duration={plan.duration}
                    minimumInvestment={plan.minimumInvestment}
                    onLearnMore={() => alert(`Learn more about ${plan.name} investment opportunity`)}
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mb-5">
            <Link to="/investments" className="btn dream-btn">View All Investments</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-us-area section-padding-100 clearfix" id="about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6">
              <div className="welcome-meter wow fadeInUp" data-wow-delay="0.2s">
                <img src="/img/svg/about-img.svg" className="img-responsive center-block" alt="" />
              </div>
            </div>
            
            <div className="col-12 col-lg-6">
              <div className="who-we-contant mt-s">
                <div className="dream-dots wow fadeInUp" data-wow-delay="0.2s">
                  <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                </div>
                <h4 className="wow fadeInUp" data-wow-delay="0.3s">Why Choose Zynith Investments</h4>
                <p className="wow fadeInUp" data-wow-delay="0.4s">We provide a comprehensive investment platform with a focus on security, diversity, and expert guidance.</p>
                <div className="list-wrap align-items-center">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="side-feature-list-item">
                        <i className="fa fa-check-square-o check-mark-icon-font" aria-hidden="true"></i>
                        <div className="foot-c-info">Diverse Investment Options</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="side-feature-list-item">
                        <i className="fa fa-check-square-o check-mark-icon-font" aria-hidden="true"></i>
                        <div className="foot-c-info">Secure Platform</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="side-feature-list-item">
                        <i className="fa fa-check-square-o check-mark-icon-font" aria-hidden="true"></i>
                        <div className="foot-c-info">Expert Guidance</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="side-feature-list-item">
                        <i className="fa fa-check-square-o check-mark-icon-font" aria-hidden="true"></i>
                        <div className="foot-c-info">Real-time Analytics</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="side-feature-list-item">
                        <i className="fa fa-check-square-o check-mark-icon-font" aria-hidden="true"></i>
                        <div className="foot-c-info">Low Fees</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="side-feature-list-item">
                        <i className="fa fa-check-square-o check-mark-icon-font" aria-hidden="true"></i>
                        <div className="foot-c-info">24/7 Support</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dream-btn-group wow fadeInUp" data-wow-delay="0.4s">
                  <Link to="/about" className="btn dream-btn mr-3">Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container" style={{paddingBottom: '0px'}} id="start">
        <div className="subscribe">
          <div className="row">
            <div className="col-sm-12">
              <div className="subscribe-wrapper">
                <div className="section-heading text-center">
                  <h2 className="wow fadeInUp" data-wow-delay="0.3s">Ready to Start Investing?</h2>
                  <p className="wow fadeInUp" data-wow-delay="0.4s">Join thousands of investors who trust Zynith for their investment needs.</p>
                </div>
                <div className="service-text text-center">
                  <div className="subscribe-section wow fadeInUp" data-wow-delay="0.5s">
                    <Link to="/register" className="btn dream-btn">Create Your Account</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
