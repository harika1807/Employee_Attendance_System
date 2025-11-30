import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MarkAttendance from './pages/employee/MarkAttendance';
import MyAttendance from './pages/employee/MyAttendance';
import Profile from './pages/employee/Profile';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import AllAttendance from './pages/manager/AllAttendance';
import TeamCalendar from './pages/manager/TeamCalendar';
import Reports from './pages/manager/Reports';
import Navbar from './components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMe } from './store/slices/authSlice';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(()=> {
    if(token && !user) dispatch(fetchMe());
  }, [token]);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={ user ? (user.role === 'manager' ? <Navigate to="/manager/dashboard" /> : <Navigate to="/employee/dashboard" />) : <Navigate to="/login" /> } />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />

          {/* Employee routes (protected) */}
          <Route path="/employee/dashboard" element={
            <PrivateRoute role="employee">
              <EmployeeDashboard/>
            </PrivateRoute>
          } />
          <Route path="/employee/mark" element={
            <PrivateRoute role="employee">
              <MarkAttendance/>
            </PrivateRoute>
          } />
          <Route path="/employee/history" element={
            <PrivateRoute role="employee">
              <MyAttendance/>
            </PrivateRoute>
          } />
          <Route path="/employee/profile" element={
            <PrivateRoute role="employee">
              <Profile/>
            </PrivateRoute>
          } />

          {/* Manager routes (protected) */}
          <Route path="/manager/dashboard" element={
            <PrivateRoute role="manager">
              <ManagerDashboard/>
            </PrivateRoute>
          } />
          <Route path="/manager/all" element={
            <PrivateRoute role="manager">
              <AllAttendance/>
            </PrivateRoute>
          } />
          <Route path="/manager/calendar" element={
            <PrivateRoute role="manager">
              <TeamCalendar/>
            </PrivateRoute>
          } />
          <Route path="/manager/reports" element={
            <PrivateRoute role="manager">
              <Reports/>
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
