import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Link } from 'react-router-dom';

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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [clickCounts, setClickCounts] = useState<{ [id: string]: number }>({});

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterTerm, setFilterTerm] = useState<string>('');


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

  const handlePrevious = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
  };
  
  const handleNext = () => {
    const totalPages = Math.ceil(volunteers.length / itemsPerPage);
    setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages);
  };

  const handleRowClick = (id: string) => {
    setClickCounts(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const sortVolunteers = (volunteers: Volunteer[]) => {
    const sortedVolunteers = [...volunteers];
    if (sortDirection === 'asc') {
      sortedVolunteers.sort((a, b) => a.hero_project.localeCompare(b.hero_project));
    } else {
      sortedVolunteers.sort((a, b) => b.hero_project.localeCompare(a.hero_project));
    }
    return sortedVolunteers;
  };

  const filterVolunteers = (volunteers: Volunteer[]) => {
    return volunteers.filter(volunteer => 
      volunteer.hero_project.toLowerCase().includes(filterTerm.toLowerCase())
    );
  };

  const toggleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTerm(e.target.value);
  };

  // Filter first, then sort
  const displayedVolunteers = sortVolunteers(filterVolunteers(volunteers));
  

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
          <Th>
            Hero Project
            <button onClick={toggleSort}>
              Sort {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
            </button>
            <input
              type="text"
              placeholder="Filter..."
              value={filterTerm}
              onChange={handleFilterInputChange}
            />
            </Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {displayedVolunteers
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map(volunteer => (
          <Tr key={volunteer.id} onClick={() => handleRowClick(volunteer.id)}>
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
                <Td><Link to={`/volunteer/${volunteer.id}`}>{volunteer.name}</Link></Td>
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
    <h2>Row Click Statistics</h2>
      <ul>
        {Object.keys(clickCounts).map(id => (
          <li key={id}>
            Row for Volunteer ID {id} has been clicked {clickCounts[id]} times.
          </li>
        ))}
      </ul>
    <div>
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default VolunteerTable;
