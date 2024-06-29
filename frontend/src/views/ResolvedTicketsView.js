// src/views/ResolvedTicketsView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const ResolvedTicketsView = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchResolvedTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/feedback?status=resolved');
        setTickets(response.data);
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

  const sortedTickets = tickets.sort((a, b) => new Date(b.resolvedAt) - new Date(a.resolvedAt));

  return (
    <div className="p-4 font-sans">
      <h2 className="text-2xl mb-4">Resolved Tickets</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Date Created</th>
              <th className="py-2 px-4 border-b">Date Resolved</th>
              <th className="py-2 px-4 border-b">Company</th>
              <th className="py-2 px-4 border-b">Department</th>
            </tr>
          </thead>
          <tbody>
            {sortedTickets.map(ticket => (
              <tr key={ticket._id}>
                <td className="py-2 px-4 border-b">{ticket.description}</td>
                <td className="py-2 px-4 border-b">{formatDate(ticket.createdAt)}</td>
                <td className="py-2 px-4 border-b">{formatDate(ticket.resolvedAt)}</td>
                <td className="py-2 px-4 border-b">{ticket.companyCode}</td>
                <td className="py-2 px-4 border-b">{ticket.departments.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResolvedTicketsView;