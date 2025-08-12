// App.js - Component chính của ứng dụng Quản Lý Danh Bạ
import React, { useState } from 'react';
import { contactsData } from './data.js';
import ContactCard from './components/ContactCard.jsx';
import ContactForm from './components/ContactForm.jsx';

const App = () => {
  // State quản lý danh sách liên hệ
  const [contacts, setContacts] = useState(contactsData);
  
  // State quản lý liên hệ đang được edit
  const [editingContact, setEditingContact] = useState(null);
  
  // State quản lý từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  
  // State quản lý ngôn ngữ (placeholder)
  const [filterLanguage, setFilterLanguage] = useState('Tiếng Việt');

  // Lọc danh sách liên hệ theo từ khóa tìm kiếm
  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.ten} ${contact.ho}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) ||
           contact.soDienThoai.includes(searchTerm) ||
           contact.email.toLowerCase().includes(searchLower) ||
           contact.diaChi.toLowerCase().includes(searchLower) ||
           contact.congTy.toLowerCase().includes(searchLower);
  });

  // Xử lý lưu liên hệ (thêm mới hoặc cập nhật)
  const handleSave = (contactData) => {
    if (editingContact) {
      // Cập nhật liên hệ existing
      setContacts(prev => prev.map(c => 
        c.id === editingContact.id 
          ? { ...contactData, id: editingContact.id } 
          : c
      ));
      setEditingContact(null);
      alert('Cập nhật liên hệ thành công!');
    } else {
      // Thêm liên hệ mới
      const newContact = {
        ...contactData,
        id: Date.now() // Tạo ID đơn giản
      };
      setContacts(prev => [...prev, newContact]);
      alert('Thêm liên hệ thành công!');
    }
  };

  // Xử lý chỉnh sửa liên hệ
  const handleEdit = (contact) => {
    setEditingContact(contact);
  };

  // Xử lý xóa liên hệ
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa liên hệ này không?')) {
      setContacts(prev => prev.filter(c => c.id !== id));
      
      // Nếu đang edit liên hệ bị xóa, clear edit state
      if (editingContact && editingContact.id === id) {
        setEditingContact(null);
      }
      
      alert('Xóa liên hệ thành công!');
    }
  };

  // Xử lý hủy edit
  const handleCancel = () => {
    setEditingContact(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header của ứng dụng */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Quản Lý Danh Bạ
          </h1>
          
          {/* Các control ở header */}
          <div className="flex gap-3">
            {/* Dropdown ngôn ngữ */}
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="px-3 py-1 border border-gray-300 text-sm focus:outline-none focus:border-blue-500 rounded-xl"
            >
              <option>Tiếng Việt</option>
              <option>English</option>
            </select>
            
            {/* Nút Thêm Liên Hệ (decoration) */}
            <button className="bg-black text-white px-4 py-1 text-sm hover:bg-gray-800 transition duration-200 rounded-xl">
              Thêm Liên Hệ
            </button>
          </div>
        </div>

        {/* Layout chính: 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Cột trái: Danh sách liên hệ */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              
              {/* Header của danh sách */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Danh Sách Liên Hệ
                </h2>
                <span className="text-sm text-gray-500">
                  Tổng: {filteredContacts.length} liên hệ
                </span>
              </div>
              
              {/* Thanh tìm kiếm */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm liên hệ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 rounded-xl"
                />
              </div>

              {/* Danh sách các contact cards */}
              <div className="max-h-165 overflow-y-auto">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map(contact => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'Không tìm thấy liên hệ nào' : 'Chưa có liên hệ nào'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải: Form thêm/sửa liên hệ */}
          <div className="lg:col-span-1">
            <ContactForm
              contact={editingContact}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default App;