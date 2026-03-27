import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, Users, Award, ShieldCheck } from 'lucide-react';
import '../../styles/static.css';

const AboutUs = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="static-page"
    >
      <div className="static-page__header">
        <h1>About Prubeli News</h1>
        <p className="static-page__subtitle">Your Trusted Voice from Eastern Nepal</p>
      </div>

      <div className="static-page__content">
        <section className="static-page__section">
          <h2>Our Mission</h2>
          <p>
            At Prubeli News, our mission is to deliver accurate, timely, and unbiased news to the people of Eastern Nepal and beyond. 
            We believe in the power of information to transform society and empower individuals.
          </p>
        </section>

        <div className="static-page__grid">
          <div className="static-page__card">
            <Newspaper className="static-page__card-icon" size={32} />
            <h3>Quality Journalism</h3>
            <p>We adhere to the highest standards of journalistic integrity and ethics.</p>
          </div>
          <div className="static-page__card">
            <Users className="static-page__card-icon" size={32} />
            <h3>Community Focused</h3>
            <p>Our stories are rooted in the local communities of Purbanchal.</p>
          </div>
          <div className="static-page__card">
            <Award className="static-page__card-icon" size={32} />
            <h3>Award Winning</h3>
            <p>Recognized for excellence in digital reporting and local news coverage.</p>
          </div>
          <div className="static-page__card">
            <ShieldCheck className="static-page__card-icon" size={32} />
            <h3>Safe & Secure</h3>
            <p>We respect user privacy and ensure a safe browsing experience.</p>
          </div>
        </div>

        <section className="static-page__section">
          <h2>Our History</h2>
          <p>
            Founded in 2024, Prubeli News started as a small initiative to bridge the information gap in rural Nepal. 
            Today, it has grown into one of the most visited digital news portals in the region, reaching millions of readers worldwide.
          </p>
        </section>
      </div>
    </motion.div>
  );
};

export default AboutUs;
