// src/views/ResolvedTicketsView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const ResolvedTicketsView = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchResolvedTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/feedback?status=resolved');
        setTickets(response.data);
        setFilteredTickets(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchResolvedTickets();
  }, []);

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
        resolvedAtFormatted.includes(value)
      );
    });
    setFilteredTickets(filtered);
  };

  const sortedTickets = filteredTickets.sort((a, b) => new Date(b.resolvedAt) - new Date(a.resolvedAt));

  return (
    <div className="p-4 font-sans bg-black min-h-screen">
      <h2 className="text-2xl mb-4 text-white">Resolved Tickets</h2>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by description, company, department, or date (YYYY-MM-DD)"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black">
          <thead className="bg-white text-black">
            <tr>
              <th className="sticky top-0 py-2 px-4 border-b">Description</th>
              <th className="sticky top-0 py-2 px-4 border-b">Date Created</th>
              <th className="sticky top-0 py-2 px-4 border-b">Date Resolved</th>
              <th className="sticky top-0 py-2 px-4 border-b">Company</th>
              <th className="sticky top-0 py-2 px-4 border-b">Department</th>
              <th className="sticky top-0 py-2 px-4 border-b">Resolution</th>
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
                <td className="py-2 px-4 border-b text-white">{ticket.resolution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResolvedTicketsView;