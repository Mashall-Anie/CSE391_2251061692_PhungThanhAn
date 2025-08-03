let currentPage = 1;
const itemsPerPage = 5;
let filteredEmployees = [...employees];
let selectedEmployees = new Set();

// Hiển thị bảng
function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const currentEmployees = filteredEmployees.slice(start, start + itemsPerPage);

    let html = '';
    currentEmployees.forEach(emp => {
        html += `
            <tr>
                <td><input type="checkbox" value="${emp.id}"></td>
                <td>${emp.name}</td>
                <td>${emp.email}</td>
                <td>${emp.address}</td>
                <td>${emp.phone}</td>
                <td>
                    <button class="btn-icon edit" data-id="${emp.id}">✏️</button>
                    <button class="btn-icon delete" data-id="${emp.id}">🗑️</button>
                </td>
            </tr>
        `;
    });
    
    $('#employeeTableBody').html(html);
    updatePagination();
    $('#currentStart').text(start + 1);
    $('#totalEntries').text(filteredEmployees.length);
}

// Phân trang
function updatePagination() {
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    let html = '';
    
    // Nút Previous
    if (currentPage > 1) {
        html += `<a href="#" data-page="${currentPage - 1}">Previous</a>`;
    }
    
    // Số trang
    for (let i = 1; i <= totalPages; i++) {
        const active = i === currentPage ? 'active' : '';
        html += `<a href="#" data-page="${i}" class="${active}">${i}</a>`;
    }
    
    // Nút Next
    if (currentPage < totalPages) {
        html += `<a href="#" data-page="${currentPage + 1}">Next</a>`;
    }
    
    $('#pagination').html(html);
}

// Tìm kiếm
function searchEmployees() {
    const term = $('#searchInput').val().toLowerCase();
    filteredEmployees = employees.filter(emp => 
        emp.name.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.address.toLowerCase().includes(term) ||
        emp.phone.includes(term)
    );
    currentPage = 1;
    renderTable();
}

// Mở/đóng modal
function openModal(id) {
    $('#' + id).addClass('show');
}

function closeModal(id) {
    $('#' + id).removeClass('show');
}

// Thêm nhân viên
function addEmployee() {
    const form = $('#addEmployeeForm');
    const newEmp = {
        id: Math.max(...employees.map(e => e.id)) + 1,
        name: form.find('[name="name"]').val(),
        email: form.find('[name="email"]').val(),
        address: form.find('[name="address"]').val(),
        phone: form.find('[name="phone"]').val()
    };
    
    employees.push(newEmp);
    filteredEmployees = [...employees];
    renderTable();
    closeModal('addEmployeeModal');
    form[0].reset();
}

// Sửa nhân viên
function editEmployee(id) {
    const emp = employees.find(e => e.id == id);
    const form = $('#editEmployeeForm');
    
    form.find('[name="id"]').val(emp.id);
    form.find('[name="name"]').val(emp.name);
    form.find('[name="email"]').val(emp.email);
    form.find('[name="address"]').val(emp.address);
    form.find('[name="phone"]').val(emp.phone);
    
    openModal('editEmployeeModal');
}

function updateEmployee() {
    const form = $('#editEmployeeForm');
    const id = parseInt(form.find('[name="id"]').val());
    const index = employees.findIndex(e => e.id === id);
    
    employees[index] = {
        id: id,
        name: form.find('[name="name"]').val(),
        email: form.find('[name="email"]').val(),
        address: form.find('[name="address"]').val(),
        phone: form.find('[name="phone"]').val()
    };
    
    filteredEmployees = [...employees];
    renderTable();
    closeModal('editEmployeeModal');
}

// Xóa nhân viên
function deleteEmployee(id) {
    selectedEmployees.clear();
    selectedEmployees.add(parseInt(id));
    openModal('deleteEmployeeModal');
}

function confirmDelete() {
    selectedEmployees.forEach(id => {
        const index = employees.findIndex(e => e.id === id);
        employees.splice(index, 1);
    });
    
    filteredEmployees = [...employees];
    renderTable();
    closeModal('deleteEmployeeModal');
}

// Chọn tất cả
function toggleSelectAll() {
    const checked = $('#selectAll').is(':checked');
    $('#employeeTableBody input[type="checkbox"]').prop('checked', checked);
}

// jQuery Events
$(document).ready(function() {
    renderTable();
    
    // Tìm kiếm
    $('#searchInput').on('input', searchEmployees);
    
    // Phân trang
    $(document).on('click', '#pagination a', function(e) {
        e.preventDefault();
        currentPage = parseInt($(this).data('page'));
        renderTable();
    });
    
    // Chọn tất cả
    $('#selectAll').on('change', toggleSelectAll);
    
    // Nút thêm
    $('.btn-success').on('click', function() {
        openModal('addEmployeeModal');
    });
    
    // Nút sửa
    $(document).on('click', '.edit', function() {
        editEmployee($(this).data('id'));
    });
    
    // Nút xóa
    $(document).on('click', '.delete', function() {
        deleteEmployee($(this).data('id'));
    });
    
    // Đóng modal
    $('.modal-close, .btn-primary').on('click', function() {
        $('.modal').removeClass('show');
    });
    
    // Click bên ngoài đóng modal
    $('.modal').on('click', function(e) {
        if (e.target === this) {
            $(this).removeClass('show');
        }
    });
    
    // Submit forms
    $('#addEmployeeModal .btn-success').on('click', addEmployee);
    $('#editEmployeeModal .btn-success').on('click', updateEmployee);
    $('#deleteEmployeeModal .btn-danger').on('click', confirmDelete);
});