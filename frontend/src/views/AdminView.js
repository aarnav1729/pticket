// src/views/AdminView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import moment from 'moment';

Modal.setAppElement('#root'); // Ensure to match your root element

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
      setTickets(tickets.map(ticket => ticket._id === id ? { ...ticket, status, resolution, resolvedAt: new Date() } : ticket));
      setSelectedTicket(null);
      setResolution('');
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setResolution('');
  };

  const formatDate = (dateString) => {
    const date = moment(dateString);
    return date.isValid() ? date.format('MMMM Do YYYY, h:mm:ss a') : 'Invalid Date';
  };

  // Sort tickets: new tickets first, resolved tickets last
  const sortedTickets = tickets.sort((a, b) => {
    if (a.status === 'resolved' && b.status !== 'resolved') return 1;
    if (a.status !== 'resolved' && b.status === 'resolved') return -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="p-4 font-sans">
      <h2 className="text-2xl mb-4">Admin View</h2>
      {sortedTickets.map(ticket => (
        <div key={ticket._id} className="border p-4 mb-4 rounded">
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Departments:</strong> {ticket.departments.join(', ')}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Created At:</strong> {formatDate(ticket.createdAt)}</p>
          {ticket.resolvedAt && <p><strong>Resolved At:</strong> {formatDate(ticket.resolvedAt)}</p>}
          <button onClick={() => handleChangeStatus(ticket._id, 'in progress')} className="bg-yellow-500 text-white p-2 rounded mr-2">
            In Progress
          </button>
          <button onClick={() => setSelectedTicket(ticket._id)} className="bg-green-500 text-white p-2 rounded">
            Resolved
          </button>
        </div>
      ))}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onRequestClose={closeModal}
          contentLabel="Resolution Modal"
          className="bg-white p-4 rounded shadow-md mx-auto my-12 max-w-lg relative"
          overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center"
        >
          <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            &times;
          </button>
          <h3 className="text-xl mb-2">Enter Resolution for Ticket</h3>
          <textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button onClick={() => handleChangeStatus(selectedTicket, 'resolved')} className="bg-blue-500 text-white p-2 rounded mt-2">
            Submit Resolution
          </button>
        </Modal>
      )}
    </div>
  );
};

export default AdminView;