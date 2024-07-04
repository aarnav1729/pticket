// src/views/ManagerialView.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import moment from 'moment';

Modal.setAppElement('#root'); // Ensure to match your root element

const ManagerialView = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolution, setResolution] = useState('');
  const location = useLocation();
  const { department } = location.state || {};

  const fetchTickets = useCallback(async () => {
    try {
      const response = await axios.get(`https://pticket.onrender.com/api/feedback?department=${department}`);
      setTickets(response.data);
      setFilteredTickets(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [department]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleChangeStatus = async (id, status) => {
    if (status === 'resolved' && !resolution) {
      setSelectedTicket(id);
      return;
    }
    try {
      await axios.put(`https://pticket.onrender.com/api/feedback/${id}`, { status, resolution });
      setResolution('');
      setSelectedTicket(null);
      fetchTickets();
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

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = tickets.filter(ticket => {
      const createdAtFormatted = moment(ticket.createdAt).format('YYYY-MM-DD').toLowerCase();
      const resolvedAtFormatted = moment(ticket.resolvedAt).format('YYYY-MM-DD').toLowerCase();
      return (
        ticket.description.toLowerCase().includes(value) ||
        ticket.companyCode.toLowerCase().includes(value) ||
        ticket.departments.join(', ').toLowerCase().includes(value) ||
        createdAtFormatted.includes(value) ||
        resolvedAtFormatted.includes(value) ||
        ticket.status.toLowerCase().includes(value)
      );
    });
    setFilteredTickets(filtered);
  };

  // Sort tickets: new tickets first, resolved tickets last
  const sortedTickets = filteredTickets.sort((a, b) => {
    if (a.status === 'resolved' && b.status !== 'resolved') return 1;
    if (a.status !== 'resolved' && b.status === 'resolved') return -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="p-4 font-sans bg-black min-h-screen text-white">
      <h2 className="text-2xl mb-4">Managerial View - {department}</h2>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by description, company, department, status, or date (YYYY-MM-DD)"
          className="w-full p-2 border rounded bg-gray-800 text-white"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 shadow-md rounded-lg">
          <thead className="bg-white text-black">
            <tr>
              <th className="sticky top-0 py-2 px-4 border-b ">Description</th>
              <th className="sticky top-0 py-2 px-4 border-b ">Date Created</th>
              <th className="sticky top-0 py-2 px-4 border-b ">Date Resolved</th>
              <th className="sticky top-0 py-2 px-4 border-b ">Company</th>
              <th className="sticky top-0 py-2 px-4 border-b ">Department</th>
              <th className="sticky top-0 py-2 px-4 border-b ">Status</th>
              <th className="sticky top-0 py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTickets.map(ticket => (
              <tr key={ticket._id} className="hover:bg-gray-700">
                <td className="py-2 px-4 border-b border-gray-600">{ticket.description}</td>
                <td className="py-2 px-4 border-b border-gray-600">{formatDate(ticket.createdAt)}</td>
                <td className="py-2 px-4 border-b border-gray-600">{formatDate(ticket.resolvedAt)}</td>
                <td className="py-2 px-4 border-b border-gray-600">{ticket.companyCode}</td>
                <td className="py-2 px-4 border-b border-gray-600">{ticket.departments.join(', ')}</td>
                <td className={`py-2 px-4 border-b border-gray-600 ${ticket.status === 'resolved' ? 'text-green-500' : ticket.status === 'in progress' ? 'text-yellow-500' : 'text-red-500'}`}>
                  {ticket.status}
                </td>
                <td className="py-2 px-4 border-b border-gray-600">
                  <button onClick={() => handleChangeStatus(ticket._id, 'in progress')} className="bg-yellow-500 text-white p-2 rounded mr-2">
                    In Progress
                  </button>
                  <button onClick={() => setSelectedTicket(ticket._id)} className="bg-green-500 text-white p-2 rounded">
                    Resolved
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

export default ManagerialView;