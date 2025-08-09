// src/components/StudentForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    maSV: '',
    hoTen: '',
    email: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    ghiChu: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (isEdit) {
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      const student = students.find(s => s.id === parseInt(id));
      if (student) {
        setFormData({
          maSV: student.maSV,
          hoTen: student.hoTen,
          email: student.email,
          ngaySinh: student.ngaySinh || '',
          gioiTinh: student.gioiTinh,
          ghiChu: student.ghiChu || ''
        });
      }
    }
  }, [id, isEdit]);

  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra mã sinh viên
    if (!formData.maSV.trim()) {
      newErrors.maSV = 'Mã sinh viên không được để trống!';
    }

    // Kiểm tra họ tên
    if (!formData.hoTen.trim()) {
      newErrors.hoTen = 'Họ tên không được để trống!';
    }

    // Kiểm tra email
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống!';
    } else {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ!';
      }
    }

    // Kiểm tra mã sinh viên đã tồn tại (chỉ khi thêm mới hoặc thay đổi mã)
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const existingStudent = students.find(s => s.maSV === formData.maSV.trim());
    if (existingStudent && (!isEdit || existingStudent.id !== parseInt(id))) {
      newErrors.maSV = 'Mã sinh viên đã tồn tại!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const confirmMessage = isEdit 
      ? "Bạn có chắc chắn muốn cập nhật thông tin sinh viên này?"
      : "Bạn có chắc chắn muốn thêm sinh viên này?";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    const students = JSON.parse(localStorage.getItem('students') || '[]');
    
    if (isEdit) {
      // Cập nhật sinh viên
      const updatedStudents = students.map(student => 
        student.id === parseInt(id) 
          ? { ...student, ...formData }
          : student
      );
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      showMessage('Cập nhật sinh viên thành công!', 'success');
    } else {
      // Thêm sinh viên mới
      const newStudent = {
        id: Math.max(...students.map(s => s.id), 0) + 1,
        ...formData
      };
      const updatedStudents = [...students, newStudent];
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      showMessage('Thêm sinh viên thành công!', 'success');
    }

    // Dispatch custom event để thông báo thay đổi
    window.dispatchEvent(new Event('studentsUpdated'));

    // Chuyển về trang danh sách sau 1 giây
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCancel = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy?")) {
      navigate('/');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  return (
    <div className="form-container">
      <div className="form-section">
        <h2 className="form-title">
          {isEdit ? 'Chỉnh sửa sinh viên' : 'Thêm sinh viên mới'}
        </h2>

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label htmlFor="maSV">Mã sinh viên:</label>
            <input
              type="text"
              id="maSV"
              name="maSV"
              className={`form-control ${errors.maSV ? 'error' : ''}`}
              value={formData.maSV}
              onChange={handleChange}
              required
            />
            {errors.maSV && <div className="error-message">{errors.maSV}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="hoTen">Họ và tên:</label>
            <input
              type="text"
              id="hoTen"
              name="hoTen"
              className={`form-control ${errors.hoTen ? 'error' : ''}`}
              value={formData.hoTen}
              onChange={handleChange}
              required
            />
            {errors.hoTen && <div className="error-message">{errors.hoTen}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="ngaySinh">Ngày sinh:</label>
            <input
              type="date"
              id="ngaySinh"
              name="ngaySinh"
              className="form-control"
              value={formData.ngaySinh}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Giới tính:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="gioiTinh"
                  value="Nam"
                  checked={formData.gioiTinh === 'Nam'}
                  onChange={handleChange}
                />
                Nam
              </label>
              <label>
                <input
                  type="radio"
                  name="gioiTinh"
                  value="Nữ"
                  checked={formData.gioiTinh === 'Nữ'}
                  onChange={handleChange}
                />
                Nữ
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="ghiChu">Ghi chú:</label>
            <textarea
              id="ghiChu"
              name="ghiChu"
              rows="3"
              className="form-control"
              value={formData.ghiChu}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className={`btn-submit ${isEdit ? 'btn-update' : ''}`}>
              {isEdit ? 'Cập nhật' : 'Thêm sinh viên'}
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Hủy
            </button>
          </div>
        </form>

        {/* Thông báo */}
        {message.text && (
          <div className={`thong-bao ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}