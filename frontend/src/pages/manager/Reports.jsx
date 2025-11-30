import React, { useState } from 'react';
import api from '../../api/axios';

export default function Reports(){
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [records, setRecords] = useState([]);

  const fetch = async () => {
    const { data } = await api.get('/attendance/all', { params: { date: '', start, end }});
    setRecords(data);
  };

  const exportCsv = async () => {
    const res = await api.get('/attendance/export', { params: { start, end }, responseType: 'blob' });
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${start}_${end}.csv`;
    a.click();
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl mb-4">Reports</h3>
      <div className="flex gap-2">
        <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="p-2 border rounded" />
        <input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="p-2 border rounded" />
        <button onClick={fetch} className="px-3 py-2 bg-blue-600 text-white rounded">Show</button>
        <button onClick={exportCsv} className="px-3 py-2 bg-green-600 text-white rounded">Export CSV</button>
      </div>

      <div className="mt-4">
        <table className="w-full">
          <thead><tr><th>Employee</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {records.map(r => (
              <tr key={r._id} className="border-t"><td>{r.userId?.name}</td><td>{r.date}</td><td>{r.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
