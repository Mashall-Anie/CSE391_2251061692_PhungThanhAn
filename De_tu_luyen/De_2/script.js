// Khởi tạo dữ liệu từ file data.js
let transactions = [...transactionData];
let currentPage = 1;
const itemsPerPage = 5;
let filteredTransactions = [...transactions];
let selectedTransactions = new Set();

// Format currency in Vietnamese dong
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function renderTable() {
    const tbody = document.getElementById('transactionTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

    tbody.innerHTML = currentTransactions.map(transaction => `
        <tr>
            <td>
                <span class="custom-checkbox">
                    <input type="checkbox" id="checkbox${transaction.id}" value="${transaction.id}" 
                           onchange="toggleTransactionSelection(${transaction.id})"
                           ${selectedTransactions.has(transaction.id) ? 'checked' : ''}>
                    <label for="checkbox${transaction.id}"></label>
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <a href="#" class="view" onclick="viewTransaction(${transaction.id})" title="Xem">
                        <i class="material-icons">&#xE417;</i>
                    </a>
                    <a href="#" class="edit" onclick="openEditModal(${transaction.id})" title="Sửa">
                        <i class="material-icons">&#xE254;</i>
                    </a>
                    <a href="#" class="delete" onclick="openDeleteModal(${transaction.id})" title="Xóa">
                        <i class="material-icons">&#xE872;</i>
                    </a>
                </div>
            </td>
            <td>${transaction.id}</td>
            <td>${transaction.customer}</td>
            <td>${transaction.employee}</td>
            <td class="currency">${formatCurrency(transaction.amount)} ₫</td>
            <td>${formatDate(transaction.date)}</td>
        </tr>
    `).join('');

    updatePagination();
    updatePaginationInfo();
    updateDeleteButton();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                      <a href="#" class="page-link" onclick="changePage(${currentPage - 1})">Trước</a></li>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                          <a href="#" class="page-link" onclick="changePage(${i})">${i}</a></li>`;
    }
    
    // Next button
    paginationHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                      <a href="#" class="page-link" onclick="changePage(${currentPage + 1})">Sau</a></li>`;
    
    pagination.innerHTML = paginationHTML;
}

function updatePaginationInfo() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredTransactions.length);
    
    document.getElementById('currentStart').textContent = startIndex;
    document.getElementById('currentEnd').textContent = endIndex;
    document.getElementById('totalEntries').textContent = filteredTransactions.length;
}

function updateDeleteButton() {
    const deleteBtn = document.getElementById('deleteSelectedBtn');
    const selectedCount = selectedTransactions.size;
    
    if (selectedCount > 0) {
        deleteBtn.style.display = 'inline-block';
        deleteBtn.innerHTML = `<i class="material-icons">&#xE15C;</i> <span>Xóa (${selectedCount})</span>`;
    } else {
        deleteBtn.style.display = 'none';
    }
}

function changePage(page) {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTable();
    }
}

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
    if (selectAllCheckbox.checked) {
        checkboxes.forEach(cb => {
            cb.checked = true;
            selectedTransactions.add(parseInt(cb.value));
        });
    } else {
        checkboxes.forEach(cb => {
            cb.checked = false;
            selectedTransactions.delete(parseInt(cb.value));
        });
    }
    updateDeleteButton();
}

function toggleTransactionSelection(transactionId) {
    if (selectedTransactions.has(transactionId)) {
        selectedTransactions.delete(transactionId);
    } else {
        selectedTransactions.add(transactionId);
    }
    
    // Update select all checkbox
    const selectAllCheckbox = document.getElementById('selectAll');
    const visibleCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const allChecked = Array.from(visibleCheckboxes).every(cb => cb.checked);
    selectAllCheckbox.checked = allChecked;
    
    updateDeleteButton();
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    modal.classList.add('show');
    document.body.classList.add('modal-open');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    
    // Clear form errors
    const errorDiv = modal.querySelector('.alert-danger');
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.innerHTML = '';
    }
}

function openAddModal() {
    document.getElementById('addTransactionForm').reset();
    openModal('addTransactionModal');
}

function openEditModal(transactionId) {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
        const form = document.getElementById('editTransactionForm');
        form.querySelector('input[name="id"]').value = transaction.id;
        form.querySelector('input[name="customer"]').value = transaction.customer;
        form.querySelector('input[name="employee"]').value = transaction.employee;
        form.querySelector('input[name="amount"]').value = transaction.amount;
        openModal('editTransactionModal');
    }
}

function openDeleteModal(transactionId = null) {
    if (transactionId) {
        selectedTransactions.clear();
        selectedTransactions.add(transactionId);
    }
    openModal('deleteTransactionModal');
}

function viewTransaction(transactionId) {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
        alert(`Thông tin giao dịch:\n\nID: ${transaction.id}\nKhách hàng: ${transaction.customer}\nNhân viên: ${transaction.employee}\nSố tiền: ${formatCurrency(transaction.amount)} ₫\nNgày: ${formatDate(transaction.date)}`);
    }
}

function validateForm(form) {
    const errors = [];
    const formData = new FormData(form);
    
    const customer = formData.get('customer') ? formData.get('customer').trim() : '';
    const employee = formData.get('employee') ? formData.get('employee').trim() : '';
    const amount = formData.get('amount');
    
    // Kiểm tra tên khách hàng
    if (!customer) {
        errors.push('Tên khách hàng không được để trống');
    } else if (customer.length > 30) {
        errors.push('Tên khách hàng không được quá 30 ký tự');
    }
    
    // Kiểm tra tên nhân viên
    if (!employee) {
        errors.push('Tên nhân viên không được để trống');
    } else if (employee.length > 30) {
        errors.push('Tên nhân viên không được quá 30 ký tự');
    }
    
    // Kiểm tra số tiền
    if (!amount || amount <= 0) {
        errors.push('Số tiền phải lớn hơn 0');
    }
    
    return errors;
}

function showFormErrors(formId, errors) {
    const errorDiv = document.getElementById(formId + 'Errors');
    if (errors.length > 0) {
        errorDiv.innerHTML = '<ul>' + errors.map(error => `<li>${error}</li>`).join('') + '</ul>';
        errorDiv.style.display = 'block';
        return false;
    } else {
        errorDiv.style.display = 'none';
        return true;
    }
}

function addTransaction(event) {
    event.preventDefault();
    const form = document.getElementById('addTransactionForm');
    const errors = validateForm(form);
    
    if (!showFormErrors('addForm', errors)) {
        return false;
    }
    
    const formData = new FormData(form);
    const newTransaction = {
        id: Math.max(...transactions.map(t => t.id)) + 1,
        customer: formData.get('customer').trim(),
        employee: formData.get('employee').trim(),
        amount: parseInt(formData.get('amount')),
        date: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    filteredTransactions = [...transactions];
    renderTable();
    closeModal('addTransactionModal');
    
    alert('Thêm giao dịch thành công!');
    return false;
}

function updateTransaction(event) {
    event.preventDefault();
    const form = document.getElementById('editTransactionForm');
    const errors = validateForm(form);
    
    if (!showFormErrors('editForm', errors)) {
        return false;
    }
    
    const formData = new FormData(form);
    const transactionId = parseInt(formData.get('id'));
    
    const transactionIndex = transactions.findIndex(t => t.id === transactionId);
    if (transactionIndex !== -1) {
        transactions[transactionIndex] = {
            id: transactionId,
            customer: formData.get('customer').trim(),
            employee: formData.get('employee').trim(),
            amount: parseInt(formData.get('amount')),
            date: transactions[transactionIndex].date
        };
        
        filteredTransactions = [...transactions];
        renderTable();
        closeModal('editTransactionModal');
        alert('Cập nhật giao dịch thành công!');
    }
    return false;
}

function deleteSelectedTransactions() {
    selectedTransactions.forEach(transactionId => {
        const index = transactions.findIndex(t => t.id === transactionId);
        if (index !== -1) {
            transactions.splice(index, 1);
        }
    });
    
    selectedTransactions.clear();
    filteredTransactions = [...transactions];
    
    // Adjust current page if necessary
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }
    
    renderTable();
    closeModal('deleteTransactionModal');
    alert('Xóa giao dịch thành công!');
}

function searchTransactions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredTransactions = transactions.filter(transaction => 
        transaction.customer.toLowerCase().includes(searchTerm) ||
        transaction.employee.toLowerCase().includes(searchTerm) ||
        transaction.id.toString().includes(searchTerm) ||
        transaction.amount.toString().includes(searchTerm)
    );
    
    currentPage = 1;
    renderTable();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize table
    renderTable();
    
    // Add search input event listener
    document.getElementById('searchInput').addEventListener('input', searchTransactions);
    
    // Prevent form submission on enter key in search input
    document.getElementById('searchInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchTransactions();
        }
    });
});

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        const modalId = event.target.id;
        closeModal(modalId);
    }
});