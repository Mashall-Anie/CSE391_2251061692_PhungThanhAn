// ContactCard.js - Component hiển thị thông tin liên hệ dạng card
import React from 'react';

const ContactCard = ({ contact, onEdit, onDelete }) => {
  // Hàm xác định màu sắc cho category tag
  const getCategoryColor = (category) => {
    const colors = {
      "Công Việc": "bg-gray-800 text-white",
      "Gia Đình": "bg-blue-600 text-white", 
      "Bạn Bè": "bg-green-600 text-white"
    };
    return colors[category] || "bg-gray-600 text-white";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      {/* Header với tên và các nút action */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {contact.ten} {contact.ho}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(contact)}
            className="px-3 py-1 border-2 border-gray-600 text-gray-700 text-sm hover:bg-gray-100 transition duration-200 rounded-xl"
          >
            Sửa
          </button>
          <button
            onClick={() => onDelete(contact.id)}
            className="px-3 py-1 border-2 border-red-600 text-red-700 text-sm hover:bg-red-100 transition duration-200 rounded-xl"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="space-y-1 text-sm text-gray-600">
        <div><strong>SĐT:</strong> {contact.soDienThoai}</div>
        <div><strong>Email:</strong> {contact.email}</div>
        <div><strong>Địa chỉ:</strong> {contact.diaChi}</div>
        <div><strong>Công ty:</strong> {contact.congTy}</div>
        
        {/* Category tag */}
        <div className="flex items-center gap-2 mt-2">
          <strong>Category:</strong>
          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(contact.danhMuc)}`}>
            {contact.danhMuc}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;