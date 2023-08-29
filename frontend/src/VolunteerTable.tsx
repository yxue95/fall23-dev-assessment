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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Volunteer | null>(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/bog/users')
      .then(response => response.json())
      .then(data => setVolunteers(data))
      .catch(error => console.error('Error fetching volunteers:', error));
  }, []);

  const addNewVolunteer = () => {
    const newVolunteer: Volunteer = {
      name: '',
      avatar: '',
      hero_project: '',
      notes: '',
      email: '',
      phone: '',
      rating: '',
      status: false,
      id: `${Date.now()}`,
    };
    fetch('http://localhost:5001/api/bog/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newVolunteer),
    })
      .then(res => res.json())
      .then(data => {
        setVolunteers([data, ...volunteers]);
        setEditingId(data.id);
        setEditedData(data);
      });
  };

  const handleEdit = (id: string, volunteerData: Volunteer) => {
    setEditingId(id);
    setEditedData(volunteerData);
  };

  const handleSave = (id: string) => {
    fetch(`http://localhost:5001/api/bog/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedData),
    })
      .then(res => res.json())
      .then(data => {
        setVolunteers(
          volunteers.map(volunteer => (volunteer.id === id ? data : volunteer))
        );
        setEditingId(null);
      });
  };

  const handleDelete = (id: string) => {
    fetch(`http://localhost:5001/api/bog/users/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setVolunteers(volunteers.filter(volunteer => volunteer.id !== id));
    });
  };

  return (
    <div>
    <button onClick={addNewVolunteer}>Add New Volunteer</button> 
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
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {volunteers.map(volunteer => (
          <Tr key={volunteer.id}>
            {editingId === volunteer.id ? (
              <>
                <Td>
                  <input
                    defaultValue={volunteer.name}
                    onChange={e => setEditedData({ ...editedData!, name: e.target.value })}
                  />
                </Td>
                <Td>
                  <input
                    defaultValue={volunteer.avatar}
                    onChange={e => setEditedData({ ...editedData!, avatar: e.target.value })}
                  />
                </Td>
                <Td>
                  <input
                    defaultValue={volunteer.phone}
                    onChange={e => setEditedData({ ...editedData!, phone: e.target.value })}
                  />
                </Td>
                <Td>
                  <input
                    defaultValue={volunteer.email}
                    onChange={e => setEditedData({ ...editedData!, email: e.target.value })}
                  />
                </Td>
                <Td>
                  <input
                    defaultValue={volunteer.rating}
                    onChange={e => setEditedData({ ...editedData!, rating: e.target.value })}
                  />
                </Td>
                <Td>
                  <select
                    defaultValue={volunteer.status ? 'Active' : 'Inactive'}
                    onChange={e =>
                      setEditedData({ ...editedData!, status: e.target.value === 'Active' })
                    }
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </Td>
                <Td>
                  <input
                    defaultValue={volunteer.hero_project}
                    onChange={e => setEditedData({ ...editedData!, hero_project: e.target.value })}
                  />
                </Td>
              </>
            ) : (
              <>
                <Td>{volunteer.name}</Td>
                <Td>
                  <img src={volunteer.avatar} alt={`${volunteer.name}'s profile`} />
                </Td>
                <Td>{volunteer.phone}</Td>
                <Td>{volunteer.email}</Td>
                <Td>{volunteer.rating}</Td>
                <Td>{volunteer.status ? 'Active' : 'Inactive'}</Td>
                <Td>{volunteer.hero_project}</Td>
              </>
            )}
            <Td>
              {editingId === volunteer.id ? (
                <button onClick={() => handleSave(volunteer.id)}>Save</button>
              ) : (
                <button onClick={() => handleEdit(volunteer.id, volunteer)}>Edit</button>
              )}
              <button onClick={() => handleDelete(volunteer.id)}>Delete</button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
    </div>
  );
};

export default VolunteerTable;
