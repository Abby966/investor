import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'investor'
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await signup(form);
      alert('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Signup failed.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-xl w-96">
        <h2 className="text-2xl mb-4 text-center font-bold">Signup</h2>
        <input name="username" placeholder="Username" onChange={handleChange}
          className="border p-2 w-full mb-3 rounded" />
        <input name="email" placeholder="Email" onChange={handleChange}
          className="border p-2 w-full mb-3 rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange}
          className="border p-2 w-full mb-3 rounded" />
        <select name="role" onChange={handleChange} className="border p-2 w-full mb-3 rounded">
          <option value="entrepreneur">Entrepreneur</option>
          <option value="investor">Investor</option>
        </select>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
