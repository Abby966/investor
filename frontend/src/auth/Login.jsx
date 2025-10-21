import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-xl w-96">
        <h2 className="text-2xl mb-4 text-center font-bold">Login</h2>
        <input name="username" placeholder="Username" onChange={handleChange}
          className="border p-2 w-full mb-3 rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange}
          className="border p-2 w-full mb-3 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
