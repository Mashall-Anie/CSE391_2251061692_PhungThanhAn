// src/components/Stats.jsx
import React, { useState, useEffect } from 'react';

export default function Stats() {
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0
  });

  useEffect(() => {
    updateStats();
    
    // Lắng nghe sự thay đổi của localStorage
    const handleStorageChange = () => {
      updateStats();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event để cập nhật stats khi thay đổi data trong cùng tab
    window.addEventListener('studentsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('studentsUpdated', handleStorageChange);
    };
  }, []);

  const updateStats = () => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const total = students.length;
    const male = students.filter(s => s.gioiTinh === 'Nam').length;
    const female = students.filter(s => s.gioiTinh === 'Nữ').length;

    setStats({ total, male, female });
  };

  return (
    <div className="stats-container">
      <div className="stats-card">
        <div className="stats-number">{stats.total}</div>
        <div className="stats-label">Tổng sinh viên</div>
      </div>
      <div className="stats-card">
        <div className="stats-number">{stats.male}</div>
        <div className="stats-label">Nam</div>
      </div>
      <div className="stats-card">
        <div className="stats-number">{stats.female}</div>
        <div className="stats-label">Nữ</div>
      </div>
    </div>
  );
}