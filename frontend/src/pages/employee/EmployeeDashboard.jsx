import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchToday, fetchMyHistory } from '../../store/slices/attendanceSlice';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard(){
  const dispatch = useDispatch();
  const { today, records } = useSelector(s => s.attendance);

  useEffect(()=> {
    dispatch(fetchToday());
    dispatch(fetchMyHistory());
  }, []);

  const presentCount = records.filter(r=> r.status === 'present').length;
  const absentCount = records.filter(r=> r.status === 'absent').length;
  const lateCount = records.filter(r=> r.status === 'late').length;
  const totalHours = records.reduce((s,r)=> s + (r.totalHours||0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-2 bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Employee Dashboard</h3>
          <Link to="/employee/mark" className="text-sm text-blue-600">Quick Check In/Out</Link>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded">
            <div className="text-sm">This month - Present</div>
            <div className="text-2xl">{presentCount}</div>
          </div>
          <div className="p-4 bg-red-50 rounded">
            <div className="text-sm">This month - Absent</div>
            <div className="text-2xl">{absentCount}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded">
            <div className="text-sm">This month - Late</div>
            <div className="text-2xl">{lateCount}</div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold">Recent attendance (last 7)</h4>
          <ul className="mt-2 space-y-2">
            {records.slice(0,7).map(r => (
              <li key={r._id} className="flex justify-between p-3 rounded border">
                <div>{r.date}</div>
                <div>{r.status}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h4 className="font-semibold">Today's</h4>
        <div className="mt-2">
          <div>Status: {today?.status || 'Not checked in'}</div>
          <div>Check In: {today?.checkInTime ? new Date(today.checkInTime).toLocaleTimeString() : '-'}</div>
          <div>Total hours this month: { totalHours.toFixed(2) }</div>
        </div>
      </div>
    </div>
  );
}
