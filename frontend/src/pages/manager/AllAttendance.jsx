import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AllAttendance(){
  const [records, setRecords] = useState([]);

  useEffect(()=> {
    const load = async () => {
      const { data } = await api.get('/attendance/all');
      setRecords(data);
    };
    load();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">All Employees Attendance</h3>
      <table className="w-full">
        <thead><tr><th>Employee</th><th>Date</th><th>Status</th><th>CheckIn</th><th>CheckOut</th></tr></thead>
        <tbody>
          {records.map(r => (
            <tr key={r._id} className="border-t">
              <td>{r.userId?.name} ({r.userId?.employeeId})</td>
              <td>{r.date}</td>
              <td>{r.status}</td>
              <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '-'}</td>
              <td>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
