import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function Navbar(){
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="font-semibold text-xl">Attendance System</Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.name} ({user.role})</span>
              <button className="px-3 py-1 rounded bg-red-500 text-white text-sm" onClick={()=> dispatch(logout())}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-blue-600">Login</Link>
              <Link to="/register" className="text-sm text-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
