import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  // Sample team members data
  const teamMembers = [
    {
      id: 1,
      name: 'John Smith',
      position: 'CEO & Founder',
      bio: 'With over 20 years of experience in finance and investment management, John leads Zynith with a vision for accessible and diverse investment opportunities.',
      image: 'https://via.placeholder.com/300x300?text=John+Smith'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      position: 'Chief Investment Officer',
      bio: 'Sarah brings 15 years of expertise in portfolio management and market analysis, ensuring our investment options are both profitable and secure.',
      image: 'https://via.placeholder.com/300x300?text=Sarah+Johnson'
    },
    {
      id: 3,
      name: 'Michael Chen',
      position: 'Head of Technology',
      bio: 'Michael leads our technology team, developing cutting-edge solutions that make investing with Zynith seamless and secure.',
      image: 'https://via.placeholder.com/300x300?text=Michael+Chen'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      position: 'Customer Relations Director',
      bio: 'Emily ensures that every investor receives personalized support and guidance throughout their investment journey with Zynith.',
      image: 'https://via.placeholder.com/300x300?text=Emily+Rodriguez'
    }
  ];

  return (
    <div className="about-page">
      {/* Welcome Area */}
      <div className="breadcumb-area clearfix auto-init">
        <div className="breadcumb-content">
          <div className="container h-100">
            <div className="row h-100 align-items-center">
              <div className="col-12">
                <nav aria-label="breadcrumb" className="breadcumb--con text-center">
                  <h2 className="w-text title wow fadeInUp" data-wow-delay="0.2s">About Us</h2>
                  <ol className="breadcrumb justify-content-center wow fadeInUp" data-wow-delay="0.4s">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">About</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="about-us-area section-padding-100 clearfix">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6">
              <div className="welcome-meter wow fadeInUp" data-wow-delay="0.7s">
                <img src="https://via.placeholder.com/600x400?text=Our+Story" alt="Zynith Investments Story" />
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="who-we-contant">
                <div className="dream-dots text-left wow fadeInUp" data-wow-delay="0.2s">
                  <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                </div>
                <h4 className="wow fadeInUp" data-wow-delay="0.3s">Our Story</h4>
                <p className="wow fadeInUp" data-wow-delay="0.4s">
                  Zynith Investments was founded in 2015 with a clear vision: to democratize access to diverse investment opportunities. 
                  We recognized that traditional investment platforms often limited options and excluded many potential investors due to high entry barriers.
                </p>
                <p className="wow fadeInUp" data-wow-delay="0.5s">
                  Our team of financial experts and technology innovators came together to create a platform that offers a wide range of investment options—from traditional stocks and bonds to real estate and cryptocurrencies—all accessible through a single, user-friendly platform.
                </p>
                <p className="wow fadeInUp" data-wow-delay="0.6s">
                  Today, Zynith serves thousands of investors worldwide, helping them build diversified portfolios and achieve their financial goals through smart, informed investment choices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="our_services_area section-padding-0-0 clearfix" id="services">
        <div className="container">
          <div className="section-heading text-center">
            <div className="dream-dots justify-content-center wow fadeInUp" data-wow-delay="0.2s">
              <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <h2 className="wow fadeInUp" data-wow-delay="0.3s">Our Values</h2>
            <p className="wow fadeInUp" data-wow-delay="0.4s">The principles that guide everything we do</p>
          </div>

          <div className="row">
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="service_single_content text-center mb-100 wow fadeInUp" data-wow-delay="0.2s">
                <div className="service_icon">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </div>
                <h6>Security</h6>
                <p>We prioritize the security of your investments and personal information above all else.</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="service_single_content text-center mb-100 wow fadeInUp" data-wow-delay="0.3s">
                <div className="service_icon">
                  <i className="fa fa-handshake-o" aria-hidden="true"></i>
                </div>
                <h6>Transparency</h6>
                <p>We believe in complete transparency in all our operations and investment offerings.</p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="service_single_content text-center mb-100 wow fadeInUp" data-wow-delay="0.4s">
                <div className="service_icon">
                  <i className="fa fa-users" aria-hidden="true"></i>
                </div>
                <h6>Inclusivity</h6>
                <p>We're committed to making investing accessible to everyone, regardless of their background or experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="our-team-area section-padding-100-0 clearfix" id="team">
        <div className="container">
          <div className="section-heading text-center">
            <div className="dream-dots justify-content-center wow fadeInUp" data-wow-delay="0.2s">
              <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <h2 className="wow fadeInUp" data-wow-delay="0.3s">Meet Our Team</h2>
            <p className="wow fadeInUp" data-wow-delay="0.4s">The experts behind Zynith Investments</p>
          </div>

          <div className="row">
            {teamMembers.map(member => (
              <div key={member.id} className="col-12 col-sm-6 col-lg-3">
                <div className="single-team-member wow fadeInUp" data-wow-delay="0.2s">
                  <div className="team-member-thumb">
                    <img src={member.image} className="center-block" alt={member.name} />
                  </div>
                  <div className="team-info">
                    <h5>{member.name}</h5>
                    <p>{member.position}</p>
                  </div>
                  <div className="team-social-icon">
                    <a href="#"><i className="fa fa-linkedin" aria-hidden="true"></i></a>
                    <a href="#"><i className="fa fa-twitter" aria-hidden="true"></i></a>
                    <a href="#"><i className="fa fa-envelope-o" aria-hidden="true"></i></a>
                  </div>
                  <div className="team-hover-effects">
                    <div className="team-social-icon">
                      <a href="#"><i className="fa fa-linkedin" aria-hidden="true"></i></a>
                      <a href="#"><i className="fa fa-twitter" aria-hidden="true"></i></a>
                      <a href="#"><i className="fa fa-envelope-o" aria-hidden="true"></i></a>
                    </div>
                  </div>
                </div>
                <div className="team-member-bio">
                  <p>{member.bio}</p>
                </div>
              </div>
            ))}
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

export default About;
