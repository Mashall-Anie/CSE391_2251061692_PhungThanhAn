// src/components/TaskList.jsx
import React, { useState } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete }) => {
  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'overdue': {
        const today = new Date().toISOString().split('T')[0];
        return !task.completed && task.dueDate && task.dueDate < today;
      }
      default:
        return true;
    }
  });

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title d-flex align-items-center mb-4">
          <i className="bi bi-list-task me-2"></i>
          Danh sách công việc
        </h5>

        <div className="mb-3">
          <div className="btn-group w-100 filter-buttons" role="group">
            <button
              type="button"
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={`btn ${filter === 'active' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('active')}
            >
              Đang thực hiện
            </button>
            <button
              type="button"
              className={`btn ${filter === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilter('completed')}
            >
              Đã hoàn thành
            </button>
            <button
              type="button"
              className={`btn ${filter === 'overdue' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setFilter('overdue')}
            >
              Sắp đến hạn
            </button>
          </div>
        </div>

        {filteredTasks.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th width="50"></th>
                  <th>Công việc</th>
                  <th>Ngày hạn</th>
                  <th>Trạng thái</th>
                  <th>Cảnh báo</th>
                  <th width="120">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleComplete={onToggleComplete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted py-4 empty-state">
            <i className="bi bi-inbox display-4"></i>
            <p className="mt-2">Không có công việc nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;