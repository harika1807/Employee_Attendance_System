// src/pages/employee/MarkAttendance.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkIn, checkOut, fetchToday, clearError } from '../../store/slices/attendanceSlice';

export default function MarkAttendance(){
  const dispatch = useDispatch();
  const { today, loading, error } = useSelector(s => s.attendance);

  useEffect(()=> {
    dispatch(fetchToday());
  }, []);

  useEffect(() => {
    if (error) {
      // simple user feedback; replace with toast library if you want
      alert(error);
      dispatch(clearError());
    }
  }, [error]);

  const handleCheckIn = async () => {
    await dispatch(checkIn());
  };
  const handleCheckOut = async () => {
    await dispatch(checkOut());
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Mark Attendance</h3>

      <div className="flex gap-4 items-center">
        <div>
          <div className="text-sm text-gray-600">Today's status</div>
          <div className="text-xl">{ today?.status || 'Not checked in' }</div>
        </div>

        <div className="ml-auto flex gap-2">
          <button onClick={handleCheckIn} disabled={loading} className={`px-4 py-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white'}`}>
            {loading ? 'Working...' : 'Check In'}
          </button>
          <button onClick={handleCheckOut} disabled={loading} className={`px-4 py-2 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700 text-white'}`}>
            {loading ? 'Working...' : 'Check Out'}
          </button>
        </div>
      </div>

      {today && (
        <div className="mt-4 text-sm">
          <div>Check In: { today.checkInTime ? new Date(today.checkInTime).toLocaleString() : '-' }</div>
          <div>Check Out: { today.checkOutTime ? new Date(today.checkOutTime).toLocaleString() : '-' }</div>
          <div>Total Hours: { today.totalHours ? Number(today.totalHours).toFixed(2) : '-' }</div>
        </div>
      )}
    </div>
  );
}
