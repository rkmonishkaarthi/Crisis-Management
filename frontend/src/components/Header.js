import React from 'react';
import { NavLink } from 'react-router-dom';
import '../App.css';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">CrisisAid</div>
      <nav className="nav">
        <NavLink to="/" exact="true" activeclassname="active">Home</NavLink>
        <NavLink to="/dashboard" activeclassname="active">Dashboard</NavLink>
        <NavLink to="/admin" activeclassname="active">Admin</NavLink>
        <NavLink to="/report" activeclassname="active">Report</NavLink>
        <NavLink to="/map" activeclassname="active">Map</NavLink>
        <NavLink to="/volunteer" activeclassname="active">Volunteer</NavLink>
        <NavLink to="/resources" activeclassname="active">Resources</NavLink>
        <NavLink to="/VolunteerFeedback" activeclassname="active">VolunteerFeedback</NavLink>
       
      </nav>
    
    </header>
  );
}

export default Header;