// src/views/AdminView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminView = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/feedback');
        setTickets(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTickets();
  }, []);

  const handleChangeStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/feedback/${id}`, { status });
      setTickets(tickets.map(ticket => ticket._id === id ? { ...ticket, status } : ticket));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 font-sans">
      <h2 className="text-2xl mb-4">Admin View</h2>
      {tickets.map(ticket => (
        <div key={ticket._id} className="border p-4 mb-4 rounded">
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Departments:</strong> {ticket.departments.join(', ')}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <button onClick={() => handleChangeStatus(ticket._id, 'in progress')} className="bg-yellow-500 text-white p-2 rounded mr-2">
            In Progress
          </button>
          <button onClick={() => handleChangeStatus(ticket._id, 'resolved')} className="bg-green-500 text-white p-2 rounded">
            Resolved
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminView;