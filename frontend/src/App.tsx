import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VolunteerTable from './VolunteerTable';
import VolunteerNotes from './VolunteerNote';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ textAlign: 'center' }}>
        <h1>Volunteer Management System</h1>
        <Routes>
          <Route path="/volunteer/:id" element={<VolunteerNotes />} />
          <Route path="/" element={<VolunteerTable />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
