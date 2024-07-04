// src/views/LoginView.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginView = () => {
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwords = {
      stores: 'storespassword',
      procurement: 'password',
      Admin: 'adminpassword'
    };

    if (passwords[department] === password) {
      if (department === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/managerial', { state: { department } });
      }
    } else {
      alert('Invalid password');
    }
  };

  return (
    <div className="p-4 font-sans bg-black">
      <h2 className="text-2xl mb-4 text-white">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-white">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white border-white"
            required
          >

            <option value="">Select a department</option>
            <option value="procurement">Procurement</option>
            <option value="stores">Stores</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white border-white"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full text-center">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginView;