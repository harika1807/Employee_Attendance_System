import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ManagerDashboard(){
  const [stats, setStats] = useState(null);

  useEffect(()=> {
    const load = async () => {
      const { data } = await api.get('/dashboard/manager');
      setStats(data);
    };
    load();
  }, []);

  if(!stats) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-1 bg-white p-6 rounded shadow">
        <div className="text-sm">Total Employees</div>
        <div className="text-2xl">{stats.totalEmployees}</div>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <div>Today's attendance</div>
        <div>{stats.presentToday} present</div>
        <div>{stats.lateToday} late</div>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <div>Absent Today</div>
        <ul>
          {stats.absentToday.map(a => (
            <li key={a._id}>{a.u?.name} ({a.u?.employeeId})</li>
          ))}
        </ul>
      </div>

      <div className="col-span-3 bg-white p-6 rounded shadow">
        <h4>Weekly trend</h4>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {stats.weeklyTrend.map(d => (
            <div key={d.date} className="p-2 rounded border text-center">
              <div className="text-xs">{d.date.split('-').slice(1).join('-')}</div>
              <div className="text-lg">{d.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
