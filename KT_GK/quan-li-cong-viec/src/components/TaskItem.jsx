// src/components/TaskItem.jsx
import React from 'react';

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      onDelete(task.id);
    }
  };

  return (
    <tr className={task.completed ? 'table-success' : isOverdue() ? 'table-warning' : ''}>
      <td>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
          />
        </div>
      </td>
      <td>
        <div className={task.completed ? 'text-decoration-line-through text-muted' : ''}>
          <strong>{task.title}</strong>
          {task.description && (
            <div className="small text-muted mt-1">{task.description}</div>
          )}
        </div>
      </td>
      <td>
        {task.dueDate && (
          <span className={`badge ${isOverdue() ? 'bg-danger' : task.completed ? 'bg-success' : 'bg-warning text-dark'}`}>
            {formatDate(task.dueDate)}
          </span>
        )}
      </td>
      <td>
        <span className={`badge ${task.completed ? 'bg-success' : 'bg-secondary'}`}>
          {task.completed ? 'Đã hoàn thành' : 'Đang thực hiện'}
        </span>
      </td>
      <td>
        {isOverdue() && !task.completed && (
          <span className="badge bg-danger rounded-lg">Sắp đến hạn</span>
        )}
      </td>
      <td>
        <div className="btn-group">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(task)}
            title="Sửa"
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleDelete}
            title="Xóa"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TaskItem;