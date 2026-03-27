import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import '../../styles/static.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="static-page"
    >
      <div className="static-page__header">
        <h1>Contact Us</h1>
        <p className="static-page__subtitle">We'd Love to Hear from You</p>
      </div>

      <div className="static-page__content">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p className="contact-info__desc">Have a story tip, a question, or just want to say hi? Fill out the form or use our contact details below.</p>
            
            <div className="contact-info__item">
              <Mail className="contact-info__icon" size={24} />
              <div>
                <h3>Email</h3>
                <p>contact@prubelinews.com</p>
              </div>
            </div>

            <div className="contact-info__item">
              <Phone className="contact-info__icon" size={24} />
              <div>
                <h3>Phone</h3>
                <p>+977 123 456 7890</p>
              </div>
            </div>

            <div className="contact-info__item">
              <MapPin className="contact-info__icon" size={24} />
              <div>
                <h3>Location</h3>
                <p>Itahari, Sunsari, Nepal</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your Name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Your Email" />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Topic of Interest" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="How can we help?" rows="5"></textarea>
            </div>
            <button type="submit" className="contact-submit">
              Send Message <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactUs;
