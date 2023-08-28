import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

interface Volunteer {
  name: string;
  avatar: string;
  hero_project: string;
  notes: string;
  email: string;
  phone: string;
  rating: string;
  status: boolean;
  id: string;
}

const VolunteerTable: React.FC = () => {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  
    useEffect(() => {
      fetch('http://localhost:5001/api/bog/users')
        .then(response => response.json())
        .then(data => setVolunteers(data))
        .catch(error => console.error('Error fetching volunteers:', error));
    }, []);
  
    return (
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Profile Picture</Th>
            <Th>Phone</Th>
            <Th>Email</Th>
            <Th>Rating</Th>
            <Th>Status</Th>
            <Th>Hero Project</Th>
          </Tr>
        </Thead>
        <Tbody>
          {volunteers.map(volunteer => (
            <Tr key={volunteer.id}>
              <Td>{volunteer.name}</Td>
              <Td>
                <img src={volunteer.avatar} alt={`${volunteer.name}'s profile`} />
              </Td>
              <Td>{volunteer.phone}</Td>
              <Td>{volunteer.email}</Td>
              <Td>{volunteer.rating}</Td>
              <Td>{volunteer.status ? 'Active' : 'Inactive'}</Td>
              <Td>{volunteer.hero_project}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };
  
  export default VolunteerTable;
  