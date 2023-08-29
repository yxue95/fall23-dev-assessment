import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Volunteer {
    name: string;
    notes: string;
    id: string;
}

const VolunteerNotes: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  
    useEffect(() => {
      fetch(`http://localhost:5001/api/bog/users/${id}`)
        .then(response => response.json())
        .then(data => setVolunteer(data))
        .catch(error => console.error('Error fetching volunteer:', error));
    }, [id]);
  
    return (
      <div>
        {volunteer ? (
          <>
            <h2>{volunteer.name}'s Notes</h2>
            <p>{volunteer.notes}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };
  
  export default VolunteerNotes;