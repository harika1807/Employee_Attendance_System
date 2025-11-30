import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyHistory } from '../../store/slices/attendanceSlice';

export default function MyAttendance(){
  const dispatch = useDispatch();
  const { records } = useSelector(s => s.attendance);

  useEffect(()=> {
    dispatch(fetchMyHistory());
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">My Attendance History</h3>
      <table className="w-full text-left">
        <thead>
          <tr><th>Date</th><th>Status</th><th>Check In</th><th>Check Out</th><th>Total Hours</th></tr>
        </thead>
        <tbody>
          {records.map(r=> (
            <tr key={r._id} className="border-t">
              <td>{r.date}</td>
              <td>{r.status}</td>
              <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '-'}</td>
              <td>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '-'}</td>
              <td>{r.totalHours ? r.totalHours.toFixed(2) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
