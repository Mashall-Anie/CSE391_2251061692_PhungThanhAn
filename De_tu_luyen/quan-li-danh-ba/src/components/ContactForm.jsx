// ContactForm.js - Component form để thêm/sửa thông tin liên hệ
import React, { useState, useEffect } from 'react';

const ContactForm = ({ contact, onSave, onCancel }) => {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    ten: '',
    ho: '',
    soDienThoai: '',
    email: '',
    diaChi: '',
    congTy: '',
    danhMuc: ''
  });
  
  // State quản lý lỗi validation
  const [errors, setErrors] = useState({});

  // Effect để load dữ liệu khi edit
  useEffect(() => {
    if (contact) {
      setFormData(contact);
    } else {
      // Reset form khi không có contact (chế độ thêm mới)
      setFormData({
        ten: '',
        ho: '',
        soDienThoai: '',
        email: '',
        diaChi: '',
        congTy: '',
        danhMuc: ''
      });
    }
    setErrors({}); // Clear errors
  }, [contact]);

  // Hàm validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Hàm validate số điện thoại (10 chữ số)
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Hàm validate toàn bộ form
  const validateForm = () => {
    const newErrors = {};

    // Validate các trường bắt buộc
    if (!formData.ten.trim()) {
      newErrors.ten = 'Tên không được để trống';
    }
    
    if (!formData.ho.trim()) {
      newErrors.ho = 'Họ không được để trống';
    }
    
    // Validate số điện thoại
    if (!formData.soDienThoai.trim()) {
      newErrors.soDienThoai = 'Số điện thoại không được để trống';
    } else if (!validatePhone(formData.soDienThoai)) {
      newErrors.soDienThoai = 'Số điện thoại phải có đúng 10 chữ số';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    if (!formData.diaChi.trim()) {
      newErrors.diaChi = 'Địa chỉ không được để trống';
    }
    
    if (!formData.congTy.trim()) {
      newErrors.congTy = 'Công ty không được để trống';
    }
    
    if (!formData.danhMuc) {
      newErrors.danhMuc = 'Vui lòng chọn danh mục';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Xóa lỗi của field đang nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Xử lý submit form
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      
      // Reset form nếu không phải chế độ edit
      if (!contact) {
        setFormData({
          ten: '',
          ho: '',
          soDienThoai: '',
          email: '',
          diaChi: '',
          congTy: '',
          danhMuc: ''
        });
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 rounded-xl">
      {/* Tiêu đề form */}
      <h2 className="text-lg font-semibold mb-4">
        {contact ? 'Sửa Liên Hệ' : 'Thêm Liên Hệ Mới'}
      </h2>
      
      {/* Hàng đầu: Tên và Họ */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">
            Tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ten"
            value={formData.ten}
            onChange={handleChange}
            className={`w-full px-3 py-2 border focus:outline-none focus:border-blue-500 ${
              errors.ten ? 'border-red-500' : 'border-gray-300 rounded-lg' 
            }`}
            placeholder="Nhập tên"
          />
          {errors.ten && (
            <p className="text-red-500 text-xs mt-1 ">{errors.ten}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ho"
            value={formData.ho}
            onChange={handleChange}
            className={`w-full px-3 py-2 border focus:outline-none focus:border-blue-500 ${
              errors.ho ? 'border-red-500' : 'border-gray-300 rounded-lg'
            }`}
            placeholder="Nhập họ"
          />
          {errors.ho && (
            <p className="text-red-500 text-xs mt-1">{errors.ho}</p>
          )}
        </div>
      </div>

      {/* Số điện thoại */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số Điện Thoại <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="soDienThoai"
          value={formData.soDienThoai}
          onChange={handleChange}
          className={`w-full px-3 py-2 border focus:outline-none focus:border-blue-500 ${
            errors.soDienThoai ? 'border-red-500' : 'border-gray-300 rounded-lg'
          }`}
          placeholder="0123456789"
        />
        {errors.soDienThoai && (
          <p className="text-red-500 text-xs mt-1">{errors.soDienThoai}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border focus:outline-none focus:border-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300 rounded-lg'
          }`}
          placeholder="example@email.com"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Địa chỉ */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Địa Chỉ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="diaChi"
          value={formData.diaChi}
          onChange={handleChange}
          className={`w-full px-3 py-2 border focus:outline-none focus:border-blue-500 ${
            errors.diaChi ? 'border-red-500' : 'border-gray-300 rounded-lg'
          }`}
          placeholder="Nhập địa chỉ đầy đủ"
        />
        {errors.diaChi && (
          <p className="text-red-500 text-xs mt-1">{errors.diaChi}</p>
        )}
      </div>

      {/* Công ty */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Công Ty <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="congTy"
          value={formData.congTy}
          onChange={handleChange}
          className={`w-full px-3 py-2 border focus:outline-none focus:border-blue-500 ${
            errors.congTy ? 'border-red-500' : 'border-gray-300 rounded-lg'
          }`}
          placeholder="Nhập tên công ty"
        />
        {errors.congTy && (
          <p className="text-red-500 text-xs mt-1">{errors.congTy}</p>
        )}
      </div>

      {/* Danh mục */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Danh Mục <span className="text-red-500">*</span>
        </label>
        <select
          name="danhMuc"
          value={formData.danhMuc}
          onChange={handleChange}
          className={`w-full px-3 py-2 border focus:outline-none focus:border-blue-500 ${
            errors.danhMuc ? 'border-red-500' : 'border-gray-300 rounded-lg'
          }`}
        >
          <option value="">Chọn danh mục</option>
          <option value="Công Việc">Công Việc</option>
          <option value="Gia Đình">Gia Đình</option>
          <option value="Bạn Bè">Bạn Bè</option>
        </select>
        {errors.danhMuc && (
          <p className="text-red-500 text-xs mt-1">{errors.danhMuc}</p>
        )}
      </div>

      {/* Các nút action */}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition duration-200"
        >
          {contact ? 'Cập Nhật' : 'Thêm Liên Hệ'}
        </button>
        
        {/* Nút Hủy chỉ hiển thị khi đang edit */}
        {contact && (
          <button
            onClick={onCancel}
            className="bg-white text-black px-6 py-2 border border-gray-300 hover:bg-gray-50 transition duration-200"
          >
            Hủy Bỏ
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactForm;