// Khởi tạo dữ liệu
let transactions = [...transactionData];
let currentPage = 1;
const itemsPerPage = 5;
let filteredTransactions = [...transactions];
let selectedTransactions = new Set();

// Format tiền tệ và ngày tháng
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

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

// Hiển thị bảng
function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const currentTransactions = filteredTransactions.slice(start, start + itemsPerPage);

    let html = '';
    currentTransactions.forEach(t => {
        html += `
            <tr>
                <td>
                    <span class="custom-checkbox">
                        <input type="checkbox" id="checkbox${t.id}" value="${t.id}">
                        <label for="checkbox${t.id}"></label>
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <a href="#" class="view" data-id="${t.id}" title="Xem">
                            <i class="material-icons">&#xE417;</i>
                        </a>
                        <a href="#" class="edit" data-id="${t.id}" title="Sửa">
                            <i class="material-icons">&#xE254;</i>
                        </a>
                        <a href="#" class="delete" data-id="${t.id}" title="Xóa">
                            <i class="material-icons">&#xE872;</i>
                        </a>
                    </div>
                </td>
                <td>${t.id}</td>
                <td>${t.customer}</td>
                <td>${t.employee}</td>
                <td class="currency">${formatCurrency(t.amount)} ₫</td>
                <td>${formatDate(t.date)}</td>
            </tr>
        `;
    });
    
    $('#transactionTableBody').html(html);
    updatePagination();
    updatePaginationInfo();
    updateDeleteButton();
}

// Phân trang
function updatePagination() {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    let html = '';
    
    // Nút Trước
    const prevClass = currentPage === 1 ? 'disabled' : '';
    html += `<li class="page-item ${prevClass}">
                <a href="#" class="page-link" data-page="${currentPage - 1}">Trước</a>
             </li>`;
    
    // Số trang
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        html += `<li class="page-item ${activeClass}">
                    <a href="#" class="page-link" data-page="${i}">${i}</a>
                 </li>`;
    }
    
    // Nút Sau
    const nextClass = currentPage === totalPages ? 'disabled' : '';
    html += `<li class="page-item ${nextClass}">
                <a href="#" class="page-link" data-page="${currentPage + 1}">Sau</a>
             </li>`;
    
    $('#pagination').html(html);
}

// Cập nhật thông tin phân trang
function updatePaginationInfo() {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredTransactions.length);
    
    $('#currentStart').text(start);
    $('#currentEnd').text(end);
    $('#totalEntries').text(filteredTransactions.length);
}

// Cập nhật nút xóa
function updateDeleteButton() {
    const count = selectedTransactions.size;
    if (count > 0) {
        $('#deleteSelectedBtn').show().html(`<i class="material-icons">&#xE15C;</i> <span>Xóa (${count})</span>`);
    } else {
        $('#deleteSelectedBtn').hide();
    }
}

// Thay đổi trang
function changePage(page) {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTable();
    }
}

// Chọn tất cả
function toggleSelectAll() {
    const checked = $('#selectAll').is(':checked');
    $('#transactionTableBody input[type="checkbox"]').each(function() {
        $(this).prop('checked', checked);
        const id = parseInt($(this).val());
        if (checked) {
            selectedTransactions.add(id);
        } else {
            selectedTransactions.delete(id);
        }
    });
    updateDeleteButton();
}

// Chọn từng item
function toggleSelection(id) {
    if (selectedTransactions.has(id)) {
        selectedTransactions.delete(id);
    } else {
        selectedTransactions.add(id);
    }
    
    // Cập nhật select all
    const total = $('#transactionTableBody input[type="checkbox"]').length;
    const checked = $('#transactionTableBody input[type="checkbox"]:checked').length;
    $('#selectAll').prop('checked', total === checked);
    
    updateDeleteButton();
}

// Mở/đóng modal
function openModal(id) {
    $('#' + id).addClass('show').show();
    $('body').addClass('modal-open');
}

function closeModal(id) {
    $('#' + id).removeClass('show').hide();
    $('body').removeClass('modal-open');
    $('#' + id).find('.alert-danger').hide();
}

// Tìm kiếm
function searchTransactions() {
    const term = $('#searchInput').val().toLowerCase();
    filteredTransactions = transactions.filter(t => 
        t.customer.toLowerCase().includes(term) ||
        t.employee.toLowerCase().includes(term) ||
        t.id.toString().includes(term) ||
        t.amount.toString().includes(term)
    );
    currentPage = 1;
    renderTable();
}

// Xem giao dịch
function viewTransaction(id) {
    const t = transactions.find(item => item.id == id);
    if (t) {
        alert(`Thông tin giao dịch:\n\nID: ${t.id}\nKhách hàng: ${t.customer}\nNhân viên: ${t.employee}\nSố tiền: ${formatCurrency(t.amount)} ₫\nNgày: ${formatDate(t.date)}`);
    }
}

// Mở modal sửa
function openEditModal(id) {
    const t = transactions.find(item => item.id == id);
    if (t) {
        const form = $('#editTransactionForm');
        form.find('[name="id"]').val(t.id);
        form.find('[name="customer"]').val(t.customer);
        form.find('[name="employee"]').val(t.employee);
        form.find('[name="amount"]').val(t.amount);
        openModal('editTransactionModal');
    }
}

// Mở modal xóa
function openDeleteModal(id = null) {
    if (id) {
        selectedTransactions.clear();
        selectedTransactions.add(parseInt(id));
    }
    openModal('deleteTransactionModal');
}

// Validate form
function validateForm(form) {
    const errors = [];
    const customer = form.find('[name="customer"]').val().trim();
    const employee = form.find('[name="employee"]').val().trim();
    const amount = form.find('[name="amount"]').val();
    
    if (!customer) errors.push('Tên khách hàng không được để trống');
    if (customer.length > 30) errors.push('Tên khách hàng không được quá 30 ký tự');
    if (!employee) errors.push('Tên nhân viên không được để trống');
    if (employee.length > 30) errors.push('Tên nhân viên không được quá 30 ký tự');
    if (!amount || amount <= 0) errors.push('Số tiền phải lớn hơn 0');
    
    return errors;
}

// Hiển thị lỗi
function showErrors(formId, errors) {
    const errorDiv = $('#' + formId + 'Errors');
    if (errors.length > 0) {
        errorDiv.html('<ul>' + errors.map(e => `<li>${e}</li>`).join('') + '</ul>').show();
        return false;
    }
    errorDiv.hide();
    return true;
}

// Thêm giao dịch
function addTransaction() {
    const form = $('#addTransactionForm');
    const errors = validateForm(form);
    
    if (!showErrors('addForm', errors)) return;
    
    const newTransaction = {
        id: Math.max(...transactions.map(t => t.id)) + 1,
        customer: form.find('[name="customer"]').val().trim(),
        employee: form.find('[name="employee"]').val().trim(),
        amount: parseInt(form.find('[name="amount"]').val()),
        date: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    filteredTransactions = [...transactions];
    renderTable();
    closeModal('addTransactionModal');
    form[0].reset();
    alert('Thêm giao dịch thành công!');
}

// Cập nhật giao dịch
function updateTransaction() {
    const form = $('#editTransactionForm');
    const errors = validateForm(form);
    
    if (!showErrors('editForm', errors)) return;
    
    const id = parseInt(form.find('[name="id"]').val());
    const index = transactions.findIndex(t => t.id === id);
    
    if (index !== -1) {
        transactions[index] = {
            id: id,
            customer: form.find('[name="customer"]').val().trim(),
            employee: form.find('[name="employee"]').val().trim(),
            amount: parseInt(form.find('[name="amount"]').val()),
            date: transactions[index].date
        };
        
        filteredTransactions = [...transactions];
        renderTable();
        closeModal('editTransactionModal');
        alert('Cập nhật giao dịch thành công!');
    }
}

// Xóa giao dịch
function deleteTransactions() {
    selectedTransactions.forEach(id => {
        const index = transactions.findIndex(t => t.id === id);
        if (index !== -1) transactions.splice(index, 1);
    });
    
    selectedTransactions.clear();
    filteredTransactions = [...transactions];
    
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }
    
    renderTable();
    closeModal('deleteTransactionModal');
    alert('Xóa giao dịch thành công!');
}

// jQuery Events
$(document).ready(function() {
    renderTable();
    
    // Tìm kiếm
    $('#searchInput').on('input', searchTransactions);
    
    // Phân trang
    $(document).on('click', '#pagination a', function(e) {
        e.preventDefault();
        if (!$(this).parent().hasClass('disabled')) {
            currentPage = parseInt($(this).data('page'));
            renderTable();
        }
    });
    
    // Chọn tất cả
    $('#selectAll').on('change', toggleSelectAll);
    
    // Chọn từng item
    $(document).on('change', '#transactionTableBody input[type="checkbox"]', function() {
        toggleSelection(parseInt($(this).val()));
    });
    
    // Các nút action
    $('.btn-success').on('click', function() {
        openModal('addTransactionModal');
    });
    
    $('#deleteSelectedBtn').on('click', function() {
        if (selectedTransactions.size > 0) {
            openModal('deleteTransactionModal');
        }
    });
    
    $(document).on('click', '.view', function(e) {
        e.preventDefault();
        viewTransaction($(this).data('id'));
    });
    
    $(document).on('click', '.edit', function(e) {
        e.preventDefault();
        openEditModal($(this).data('id'));
    });
    
    $(document).on('click', '.delete', function(e) {
        e.preventDefault();
        openDeleteModal($(this).data('id'));
    });
    
    // Đóng modal
    $('.close, .btn-secondary').on('click', function() {
        $('.modal').removeClass('show').hide();
        $('body').removeClass('modal-open');
    });
    
    // Click bên ngoài đóng modal
    $('.modal').on('click', function(e) {
        if (e.target === this) {
            $(this).removeClass('show').hide();
            $('body').removeClass('modal-open');
        }
    });
    
    // Submit forms
    $('#addTransactionModal .btn-success').on('click', function(e) {
        e.preventDefault();
        addTransaction();
    });
    
    $('#editTransactionModal .btn-primary').on('click', function(e) {
        e.preventDefault();
        updateTransaction();
    });
    
    $('#deleteTransactionModal .btn-danger').on('click', deleteTransactions);
});