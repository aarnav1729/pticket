// src/views/FormView.js
import React, { useState } from 'react';
import axios from 'axios';

const FormView = () => {
  const [description, setDescription] = useState('');
  const [departments, setDepartments] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [companyCode, setCompanyCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
    formData.append('departments', JSON.stringify(departments));
    if (attachment) {
      formData.append('attachment', attachment);
    }
    formData.append('companyCode', companyCode);

    try {
      const response = await axios.post('https://pticket.onrender.com/api/feedback', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      alert('Form submitted successfully');
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    }
  };

  const handleDepartmentChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setDepartments([...departments, value]);
    } else {
      setDepartments(departments.filter((dept) => dept !== value));
    }
  };

  return (
    <div className="p-4 font-sans">
      <h2 className="text-2xl mb-4">Submit an Request Report</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Description of the issue</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white border-white"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Departments</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                value="procurement"
                onChange={handleDepartmentChange}
              />
              <span>Procurement</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                value="stores"
                onChange={handleDepartmentChange}
              />
              <span>Stores</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block mb-2">Attachment (optional)</label>
          <input
            type="file"
            onChange={(e) => setAttachment(e.target.files[0])}
            className="w-full p-2 border rounded border-white bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-2">Company Code</label>
          <select
            value={companyCode}
            onChange={(e) => setCompanyCode(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white border-white"
            required
          >
            <option value="">Select a company</option>
            <option value="company1">1000</option>
            <option value="company2">2000</option>
            <option value="company3">3000</option>
            <option value="company4">4000</option>
            <option value="company5">5000</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full text-center">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormView;