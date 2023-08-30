import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import VolunteerTable from './VolunteerTable';
import VolunteerNotes from './VolunteerNote';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ textAlign: 'center' }}>
        <h1>Volunteer Management System</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="/admin" element={<VolunteerTable role="admin" />} />
          <Route path="/viewer" element={<VolunteerTable role="viewer" />} />
          <Route path="/volunteer/:id" element={<VolunteerNotes />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;