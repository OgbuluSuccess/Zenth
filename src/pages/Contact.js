import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend or a service like EmailJS
    console.log('Form submitted:', formData);
    alert('Thank you for your message. We will get back to you soon!');
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      {/* Welcome Area */}
      <div className="breadcumb-area clearfix auto-init">
        <div className="breadcumb-content">
          <div className="container h-100">
            <div className="row h-100 align-items-center">
              <div className="col-12">
                <nav aria-label="breadcrumb" className="breadcumb--con text-center">
                  <h2 className="w-text title wow fadeInUp" data-wow-delay="0.2s">Contact Us</h2>
                  <ol className="breadcrumb justify-content-center wow fadeInUp" data-wow-delay="0.4s">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Contact</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Area */}
      <section className="contact_us_area section-padding-100-0" id="contact">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-heading text-center">
                <div className="dream-dots justify-content-center wow fadeInUp" data-wow-delay="0.2s">
                  <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                </div>
                <h2 className="wow fadeInUp" data-wow-delay="0.3s">Get In Touch</h2>
                <p className="wow fadeInUp" data-wow-delay="0.4s">Have questions or need assistance? We're here to help.</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <div className="contact_form">
                <form onSubmit={handleSubmit} id="main_contact_form" className="form-horizontal">
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="group wow fadeInUp" data-wow-delay="0.2s">
                        <input 
                          type="text" 
                          name="name" 
                          id="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          required 
                        />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label>Name</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="group wow fadeInUp" data-wow-delay="0.3s">
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
                      <div className="group wow fadeInUp" data-wow-delay="0.4s">
                        <input 
                          type="text" 
                          name="subject" 
                          id="subject" 
                          value={formData.subject} 
                          onChange={handleChange} 
                          required 
                        />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label>Subject</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="group wow fadeInUp" data-wow-delay="0.5s">
                        <textarea 
                          name="message" 
                          id="message" 
                          value={formData.message} 
                          onChange={handleChange} 
                          required
                        ></textarea>
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label>Message</label>
                      </div>
                    </div>
                    <div className="col-12 text-center wow fadeInUp" data-wow-delay="0.6s">
                      <button type="submit" className="btn dream-btn">Send Message</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="row justify-content-center section-padding-100">
            <div className="col-12 col-md-4 col-lg-4">
              <div className="contact-information mb-100">
                <div className="contact-thumb-overlay">
                  <img src="/img/bg-img/map.png" alt="Location" />
                </div>
                <div className="contact-info-text">
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                  <h4>Our Location</h4>
                  <p>123 Investment Avenue<br />Financial District<br />New York, NY 10004</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4 col-lg-4">
              <div className="contact-information mb-100">
                <div className="contact-thumb-overlay">
                  <img src="/img/bg-img/call.png" alt="Call Us" />
                </div>
                <div className="contact-info-text">
                  <i className="fa fa-phone" aria-hidden="true"></i>
                  <h4>Call Us</h4>
                  <p>+1 (555) 123-4567</p>
                  <p>Monday - Friday: 9am - 5pm EST</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4 col-lg-4">
              <div className="contact-information mb-100">
                <div className="contact-thumb-overlay">
                  <img src="/img/bg-img/email.png" alt="Email Us" />
                </div>
                <div className="contact-info-text">
                  <i className="fa fa-envelope-o" aria-hidden="true"></i>
                  <h4>Email Us</h4>
                  <p>support@zynithinvestments.com</p>
                  <p>We respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Area */}
      <div className="map-area">
        <div className="map-responsive">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.346380781753!2d-74.01298868459514!3d40.70758797933168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a165bedccab%3A0x2cb2ddf003b5ae01!2sWall%20Street%2C%20New%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sca!4v1646846442221!5m2!1sen!2sca" 
            width="600" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            title="Zynith Investments Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
