// src/views/AdminView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminView = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolution, setResolution] = useState('');

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
    if (status === 'resolved' && !resolution) {
      setSelectedTicket(id);
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/feedback/${id}`, { status, resolution });
      setTickets(tickets.map(ticket => ticket._id === id ? { ...ticket, status, resolution } : ticket));
      setSelectedTicket(null);
      setResolution('');
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
      {selectedTicket && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-xl mb-2">Enter Resolution for Ticket</h3>
          <textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button onClick={() => handleChangeStatus(selectedTicket, 'resolved')} className="bg-blue-500 text-white p-2 rounded mt-2">
            Submit Resolution
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminView;