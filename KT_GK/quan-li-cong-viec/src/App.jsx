// src/App.jsx
import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { initialTasksData } from './data/data';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks từ localStorage khi component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Sử dụng dữ liệu mẫu từ data.js nếu chưa có dữ liệu trong localStorage
      setTasks(initialTasksData);
      localStorage.setItem('tasks', JSON.stringify(initialTasksData));
    }
  }, []);

  // Lưu tasks vào localStorage mỗi khi tasks thay đổi
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Tính toán thống kê
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(task => {
    if (task.completed || !task.dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  }).length;

  // Hàm thêm task
  const addTask = (taskData) => {
    setTasks(prev => [...prev, taskData]);
  };

  // Hàm cập nhật task
  const updateTask = (taskData) => {
    setTasks(prev => prev.map(task => 
      task.id === taskData.id ? taskData : task
    ));
    setEditingTask(null);
  };

  // Hàm xóa task
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Hàm toggle hoàn thành
  const toggleComplete = (taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Hàm bắt đầu chỉnh sửa
  const startEdit = (task) => {
    setEditingTask(task);
  };

  // Hàm hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="min-vh-100 main-container" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    }}>
      <div className="container py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="text-white mb-4">
              <i className="bi bi-list-check me-2"></i>
              Task Manager
            </h1>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card text-center h-100 stats-card">
              <div className="card-body">
                <h2 className="text-primary mb-2 stats-number">{totalTasks}</h2>
                <p className="text-muted mb-0">Tổng công việc</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center h-100 stats-card">
              <div className="card-body">
                <h2 className="text-success mb-2 stats-number">{completedTasks}</h2>
                <p className="text-muted mb-0">Đã hoàn thành</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center h-100 stats-card">
              <div className="card-body">
                <h2 className="text-warning mb-2 stats-number">{activeTasks}</h2>
                <p className="text-muted mb-0">Đang thực hiện</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center h-100 stats-card">
              <div className="card-body">
                <h2 className="text-danger mb-2 stats-number">{overdueTasks}</h2>
                <p className="text-muted mb-0">Sắp đến hạn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          <div className="col-md-5 mb-4">
            <TaskForm
              initialData={editingTask}
              onSubmit={editingTask ? updateTask : addTask}
              onCancel={cancelEdit}
            />
          </div>
          <div className="col-md-7">
            <TaskList
              tasks={tasks}
              onEdit={startEdit}
              onDelete={deleteTask}
              onToggleComplete={toggleComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;