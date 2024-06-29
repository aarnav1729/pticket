// src/views/AdminView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import moment from 'moment';

Modal.setAppElement('#root'); // Ensure to match your root element

const AdminView = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolution, setResolution] = useState('');

  const fetchTickets = async () => {
    try {
      const response = await axios.get('https://aft-099c.onrender.com/api/feedback');
      setTickets(response.data);
      setFilteredTickets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChangeStatus = async (id, status) => {
    if (status === 'resolved' && !resolution) {
      setSelectedTicket(id);
      return;
    }
    try {
      await axios.put(`https://aft-099c.onrender.com/api/feedback/${id}`, { status, resolution });
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
    <div className="p-4 font-sans bg-black">
      <h2 className="text-2xl mb-4">Admin View</h2>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by description, company, department, status, or date (YYYY-MM-DD)"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black shadow-md rounded-lg">
          <thead className="bg-white text-black">
            <tr>
              <th className="sticky top-0 py-2 px-4 border-b">Description</th>
              <th className="sticky top-0 py-2 px-4 border-b">Date Created</th>
              <th className="sticky top-0 py-2 px-4 border-b">Date Resolved</th>
              <th className="sticky top-0 py-2 px-4 border-b">Company</th>
              <th className="sticky top-0 py-2 px-4 border-b">Department</th>
              <th className="sticky top-0 py-2 px-4 border-b">Status</th>
              <th className="sticky top-0 py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTickets.map(ticket => (
              <tr key={ticket._id} className="hover:bg-gray-700">
                <td className="py-2 px-4 border-b text-white">{ticket.description}</td>
                <td className="py-2 px-4 border-b text-white">{formatDate(ticket.createdAt)}</td>
                <td className="py-2 px-4 border-b text-white">{formatDate(ticket.resolvedAt)}</td>
                <td className="py-2 px-4 border-b text-white">{ticket.companyCode}</td>
                <td className="py-2 px-4 border-b text-white">{ticket.departments.join(', ')}</td>
                <td className={`py-2 px-4 border-b text-white ${ticket.status === 'resolved' ? 'text-green-600' : ticket.status === 'in progress' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {ticket.status}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button onClick={() => handleChangeStatus(ticket._id, 'in progress')} className="bg-yellow-600 text-white p-2 rounded mr-2">
                    In Progress
                  </button>
                  <button onClick={() => setSelectedTicket(ticket._id)} className="bg-green-600 text-white p-2 rounded">
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
          className="bg-black p-4 rounded shadow-md mx-auto my-12 max-w-lg relative"
          overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center"
        >
          <button onClick={closeModal} className="absolute top-2 right-2 text-white hover:text-red-600">
            &times;
          </button>
          <h3 className="text-xl mb-2">Enter Resolution for Ticket</h3>
          <textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 border-white"
          />
          <button onClick={() => handleChangeStatus(selectedTicket, 'resolved')} className="bg-blue-500 text-white p-2 rounded mt-2 w-full text-center hover:bg-green-600">
            Submit Resolution
          </button>
        </Modal>
      )}
    </div>
  );
};

export default AdminView;