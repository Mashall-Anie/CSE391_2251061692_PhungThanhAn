let currentPage = 1;
const itemsPerPage = 5;
let filteredEmployees = [...employees];
let selectedEmployees = new Set();

function renderTable() {
    const tbody = document.getElementById('employeeTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

    tbody.innerHTML = currentEmployees.map(employee => `
        <tr>
            <td>
                <input type="checkbox" class="checkbox" value="${employee.id}" 
                       onchange="toggleEmployeeSelection(${employee.id})"
                       ${selectedEmployees.has(employee.id) ? 'checked' : ''}>
            </td>
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${employee.address}</td>
            <td>${employee.phone}</td>
            <td>
                <div class="actions">
                    <button class="btn-icon edit" onclick="openEditModal(${employee.id})" title="Edit">
                        <svg class="icon" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                    </button>
                    <button class="btn-icon delete" onclick="openDeleteModal(${employee.id})" title="Delete">
                        <svg class="icon" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    updatePagination();
    updatePaginationInfo();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `<a href="#" onclick="changePage(${currentPage - 1})" 
                      ${currentPage === 1 ? 'class="disabled"' : ''}>Previous</a>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<a href="#" onclick="changePage(${i})" 
                          ${i === currentPage ? 'class="active"' : ''}>${i}</a>`;
    }
    
    // Next button
    paginationHTML += `<a href="#" onclick="changePage(${currentPage + 1})" 
                      ${currentPage === totalPages ? 'class="disabled"' : ''}>Next</a>`;
    
    pagination.innerHTML = paginationHTML;
}

function updatePaginationInfo() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredEmployees.length);
    
    document.getElementById('currentStart').textContent = startIndex;
    document.getElementById('totalEntries').textContent = filteredEmployees.length;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
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
            selectedEmployees.add(parseInt(cb.value));
        });
    } else {
        checkboxes.forEach(cb => {
            cb.checked = false;
            selectedEmployees.delete(parseInt(cb.value));
        });
    }
}

function toggleEmployeeSelection(employeeId) {
    if (selectedEmployees.has(employeeId)) {
        selectedEmployees.delete(employeeId);
    } else {
        selectedEmployees.add(employeeId);
    }
    
    // Update select all checkbox
    const selectAllCheckbox = document.getElementById('selectAll');
    const visibleCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const allChecked = Array.from(visibleCheckboxes).every(cb => cb.checked);
    selectAllCheckbox.checked = allChecked;
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function openAddModal() {
    document.getElementById('addEmployeeForm').reset();
    openModal('addEmployeeModal');
}

function openEditModal(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
        const form = document.getElementById('editEmployeeForm');
        form.querySelector('input[name="id"]').value = employee.id;
        form.querySelector('input[name="name"]').value = employee.name;
        form.querySelector('input[name="email"]').value = employee.email;
        form.querySelector('textarea[name="address"]').value = employee.address;
        form.querySelector('input[name="phone"]').value = employee.phone;
        openModal('editEmployeeModal');
    }
}

function openDeleteModal(employeeId = null) {
    if (employeeId) {
        selectedEmployees.clear();
        selectedEmployees.add(employeeId);
    }
    openModal('deleteEmployeeModal');
}

function addEmployee() {
    const form = document.getElementById('addEmployeeForm');
    const formData = new FormData(form);
    
    const newEmployee = {
        id: Math.max(...employees.map(emp => emp.id)) + 1,
        name: formData.get('name'),
        email: formData.get('email'),
        address: formData.get('address'),
        phone: formData.get('phone')
    };
    
    employees.push(newEmployee);
    filteredEmployees = [...employees];
    renderTable();
    closeModal('addEmployeeModal');
}

function updateEmployee() {
    const form = document.getElementById('editEmployeeForm');
    const formData = new FormData(form);
    const employeeId = parseInt(formData.get('id'));
    
    const employeeIndex = employees.findIndex(emp => emp.id === employeeId);
    if (employeeIndex !== -1) {
        employees[employeeIndex] = {
            id: employeeId,
            name: formData.get('name'),
            email: formData.get('email'),
            address: formData.get('address'),
            phone: formData.get('phone')
        };
        
        filteredEmployees = [...employees];
        renderTable();
        closeModal('editEmployeeModal');
    }
}

function deleteSelectedEmployees() {
    selectedEmployees.forEach(employeeId => {
        const index = employees.findIndex(emp => emp.id === employeeId);
        if (index !== -1) {
            employees.splice(index, 1);
        }
    });
    
    selectedEmployees.clear();
    filteredEmployees = [...employees];
    
    // Adjust current page if necessary
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }
    
    renderTable();
    closeModal('deleteEmployeeModal');
}

function searchEmployees() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredEmployees = employees.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm) ||
        employee.address.toLowerCase().includes(searchTerm) ||
        employee.phone.includes(searchTerm)
    );
    
    currentPage = 1;
    renderTable();
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', searchEmployees);

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
});

// Initialize table
renderTable();