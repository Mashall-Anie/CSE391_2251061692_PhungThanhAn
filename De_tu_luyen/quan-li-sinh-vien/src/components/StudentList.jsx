// src/components/StudentList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
    
    // Lắng nghe sự thay đổi của localStorage
    const handleStorageChange = () => {
      loadStudents();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('studentsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('studentsUpdated', handleStorageChange);
    };
  }, []);

  const loadStudents = () => {
    const studentsData = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(studentsData);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
      const updatedStudents = students.filter(student => student.id !== id);
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      setStudents(updatedStudents);
      
      // Dispatch custom event để thông báo thay đổi
      window.dispatchEvent(new Event('studentsUpdated'));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="table-section">
      <h2 className="table-title">Danh sách sinh viên</h2>

      {/* Desktop Table */}
      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã SV</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.maSV}</td>
                <td>{student.hoTen}</td>
                <td>{student.email}</td>
                <td>{student.gioiTinh}</td>
                <td>{formatDate(student.ngaySinh)}</td>
                <td>{student.ghiChu}</td>
                <td>
                  <Link to={`/edit/${student.id}`} className="action-link">
                    Sửa
                  </Link>
                  <button 
                    className="action-link delete" 
                    onClick={() => handleDelete(student.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-card">
        {students.map((student) => (
          <div key={student.id} className="student-card">
            <div className="card-header">
              <div className="student-name">{student.hoTen}</div>
              <div className="student-id">{student.maSV}</div>
            </div>
            <div className="card-info">
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{student.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Giới tính:</span>
                <span className="info-value">{student.gioiTinh}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ngày sinh:</span>
                <span className="info-value">{formatDate(student.ngaySinh)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ghi chú:</span>
                <span className="info-value">{student.ghiChu}</span>
              </div>
            </div>
            <div className="card-actions">
              <Link to={`/edit/${student.id}`} className="mobile-action">
                ✏️ Sửa
              </Link>
              <button 
                className="mobile-action delete" 
                onClick={() => handleDelete(student.id)}
              >
                🗑️ Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 && (
        <div className="no-data">
          <p>Chưa có sinh viên nào. <Link to="/add">Thêm sinh viên mới</Link></p>
        </div>
      )}
    </div>
  );
}