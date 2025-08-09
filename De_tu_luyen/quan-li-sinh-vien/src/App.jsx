// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import studentsData from './data.js';
import Stats from './components/Stats.jsx';
import StudentList from './components/StudentList.jsx';
import StudentForm from './components/StudentForm.jsx';
import './App.css';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Nạp data.js vào localStorage nếu chưa có
    const existing = localStorage.getItem('students');
    if (!existing) {
      localStorage.setItem('students', JSON.stringify(studentsData));
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="loading-container">
        <div className="loading-text">Đang khởi tạo dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-title">Quản lý sinh viên</h1>
          <div className="nav-links">
            <Link className="nav-link" to="/">Danh sách</Link>
            <Link className="nav-link nav-link-primary" to="/add">Thêm sinh viên</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        <Routes>
          <Route path="/" element={<><Stats /><StudentList /></>} />
          <Route path="/add" element={<StudentForm />} />
          <Route path="/edit/:id" element={<StudentForm />} />
        </Routes>
      </div>
    </div>
  );
}