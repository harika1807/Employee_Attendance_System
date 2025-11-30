import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      if(result.role === 'manager') navigate('/manager/dashboard');
      else navigate('/employee/dashboard');
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <div className="flex justify-between items-center">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Login</button>
          <a href="/register" className="text-sm text-blue-600">Create account</a>
        </div>
      </form>
    </div>
  );
}
