import React from 'react';
import Header from '../components/Header';
import './Home.css';
 // assuming Weather is implemented

function Home() {
  return (
    <div>
      <Header />

      

      <div className="home-content">
        <h2>🌍 Welcome to CrisisAid</h2>
        <p>
          CrisisAid is a centralized disaster response platform that connects citizens, volunteers, and authorities
          to act swiftly and efficiently during natural and human-made emergencies.
        </p>

        

        {/* Key Features */}
        <h3>⚡ What You Can Do</h3>
        <ul className="feature-list">
          
          <li>🙋‍♂️ Register as a volunteer and contribute to relief efforts.</li>
          <li>🗺️ Track disaster zones with our interactive map.</li>
          <li>📊 Access verified statistics and safety resources.</li>
          <li>📢 Report incidents with photos, location, and description.</li>
        </ul>

        {/* Why CrisisAid */}
        <h3>💡 Why Choose CrisisAid?</h3>
        <p>
          In critical moments, quick access to information and coordination can save lives. CrisisAid brings
          technology and community together to deliver timely support, enhance situational awareness, and ensure
          effective disaster management.
        </p>

        {/* CTA Section */}
        <div className="cta-section">
          <h3>🤝 Ready to Make an Impact?</h3>
          <p>
            Whether you’re here to help or need assistance — CrisisAid is your trusted companion during emergencies.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
