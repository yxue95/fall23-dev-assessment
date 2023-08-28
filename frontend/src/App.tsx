import './App.css';
import React from 'react';
import VolunteerTable from './VolunteerTable';

const App: React.FC = () => {
  return (
    <div style={{ textAlign: 'center'}}>
      <h1>Volunteer Management System</h1>
      <VolunteerTable />
    </div>
  );
}

export default App;

