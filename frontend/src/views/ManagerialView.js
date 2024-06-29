// src/views/ManagerialView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Ensure to match your root element

const ManagerialView = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolution, setResolution] = useState('');
  const location = useLocation();
  const { department } = location.state || {};

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/feedback?department=${department}`);
        setTickets(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTickets();
  }, [department]);

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

  return (
    <div className="p-4 font-sans">
      <h2 className="text-2xl mb-4">Managerial View - {department}</h2>
      {tickets.map(ticket => (
        <div key={ticket._id} className="border p-4 mb-4 rounded">
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Departments:</strong> {ticket.departments.join(', ')}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
          {ticket.resolvedAt && <p><strong>Resolved At:</strong> {new Date(ticket.resolvedAt).toLocaleString()}</p>}
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
          className="bg-white p-4 rounded shadow-md mx-auto my-12 max-w-lg"
          overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center"
        >
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

export default ManagerialView;