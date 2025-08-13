// src/components/TaskForm.jsx
import React, { useState, useEffect } from 'react';

const TaskForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Set form với dữ liệu edit
      setFormData(initialData);
    } else {
      // Reset form về trạng thái trống
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        category: 'work'
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề công việc không được để trống';
    } else if (formData.title.length > 50) {
      newErrors.title = 'Tiêu đề không được vượt quá 50 ký tự';
    }

    // Validate due date
    if (formData.dueDate) {
      const today = new Date().toISOString().split('T')[0];
      if (formData.dueDate < today) {
        newErrors.dueDate = 'Ngày hạn không được nhỏ hơn ngày hiện tại';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const taskData = {
        id: initialData?.id || Date.now(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate,
        completed: initialData?.completed || false
      };
      onSubmit(taskData);
      if (!initialData) {
        setFormData({ title: '', description: '', dueDate: '' });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title d-flex align-items-center mb-4">
          <i className="bi bi-plus-circle me-2"></i>
          {initialData ? 'Sửa công việc' : 'Thêm công việc mới'}
        </h5>
        
        <div>
          <div className="mb-3">
            <label className="form-label">Tiêu đề công việc *</label>
            <input
              type="text"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề công việc"
            />
            {errors.title && <div className="text-danger mt-1">{errors.title}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Mô tả công việc</label>
            <textarea
              className="form-control"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết công việc (tùy chọn)"
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Ngày hạn</label>
            <input
              type="date"
              className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
            {errors.dueDate && <div className="text-danger mt-1">{errors.dueDate}</div>}
          </div>

          <div className="d-grid gap-2">
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              <i className="bi bi-plus me-2"></i>
              {initialData ? 'Cập nhật công việc' : 'Thêm công việc'}
            </button>
            {initialData && (
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Hủy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;