import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({name:'',email:'',password:'',employeeId:'',department:''});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      const res = await dispatch(register({ ...form, role: 'employee' })).unwrap();
      // defensive store in case slice doesn't (ensures token exists)
      if (res?.token) {
        localStorage.setItem('token', res.token);
      }
      navigate('/employee/dashboard');
    } catch(err){
      alert(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Register (Employee)</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" className="w-full p-2 border rounded" />
        <input required onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" className="w-full p-2 border rounded" />
        <input required onChange={e=>setForm({...form, password:e.target.value})} type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <input onChange={e=>setForm({...form, employeeId:e.target.value})} placeholder="Employee ID (EMP001)" className="w-full p-2 border rounded" />
        <input onChange={e=>setForm({...form, department:e.target.value})} placeholder="Department" className="w-full p-2 border rounded" />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Create</button>
      </form>
    </div>
  );
}
