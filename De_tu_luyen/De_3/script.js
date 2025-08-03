// Khởi tạo dữ liệu
let students = [...studentData];
let currentPage = 1;
const itemsPerPage = 20;
let filteredStudents = [...students];
let selectedStudents = new Set();
// Cập nhật bộ đếm ký tự
function updateCharCounter(input) {
    const current = input.val().length;
    const max = parseInt(input.siblings('.char-counter').find('.max').text());
    const counter = input.siblings('.char-counter');
    const currentSpan = counter.find('.current');
    currentSpan.text(current);
    // Thay đổi màu sắc dựa trên số ký tự
    counter.removeClass('warning danger');
    if (current > max) {
        counter.addClass('danger');
    } else if (current >= max * 0.8) {
        counter.addClass('warning');
    }
}
// Xóa validation errors
function clearValidationErrors(form) {
    form.find('.form-control').removeClass('is-invalid');
    form.find('.invalid-feedback').text('').hide();
}
// Hiển thị validation errors
function showValidationError(input, message) {
    input.addClass('is-invalid');
    input.siblings('.invalid-feedback').text(message).show();
}
// Validate form với quy tắc mới
function validateForm(form) {
    clearValidationErrors(form);
    let isValid = true;
    const firstName = form.find('[name="firstName"]');
    const fullName = form.find('[name="fullName"]');
    const address = form.find('[name="address"]');
    const firstNameValue = firstName.val().trim();
    const fullNameValue = fullName.val().trim();
    const addressValue = address.val().trim();
    // Validate Tên (không quá 15 ký tự)
    if (!firstNameValue) {
        showValidationError(firstName, 'Tên không được để trống');
        isValid = false;
    } else if (firstNameValue.length > 15) {
        showValidationError(firstName, 'Tên không được quá 15 ký tự');
        isValid = false;
    }
    // Validate Họ đệm (không quá 20 ký tự)
    if (!fullNameValue) {
        showValidationError(fullName, 'Họ đệm không được để trống');
        isValid = false;
    } else if (fullNameValue.length > 20) {
        showValidationError(fullName, 'Họ đệm không được quá 20 ký tự');
        isValid = false;
    }
    // Validate Địa chỉ (không quá 50 ký tự)
    if (!addressValue) {
        showValidationError(address, 'Địa chỉ không được để trống');
        isValid = false;
    } else if (addressValue.length > 50) {
        showValidationError(address, 'Địa chỉ không được quá 50 ký tự');
        isValid = false;
    }
    return isValid;
}
// Hiển thị bảng
function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const currentStudents = filteredStudents.slice(start, start + itemsPerPage);
    let html = '';
    currentStudents.forEach((student, index) => {
        const stt = start + index + 1;
        const statusClass = student.status === 'active' ? 'status-active' : 'status-inactive';
        const statusText = student.status === 'active' ? '✓' : '✗';
        html += `
            <tr>
                <td>
                    <span class="custom-checkbox">
                        <input type="checkbox" id="checkbox${student.id}" value="${student.id}">
                        <label for="checkbox${student.id}"></label>
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <a href="#" class="view" data-id="${student.id}" title="Xem">
                            <i class="material-icons">&#xE417;</i>
                        </a>
                        <a href="#" class="edit" data-id="${student.id}" title="Sửa">
                            <i class="material-icons">&#xE254;</i>
                        </a>
                        <a href="#" class="delete" data-id="${student.id}" title="Xóa">
                            <i class="material-icons">&#xE872;</i>
                        </a>
                    </div>
                </td>
                <td>${stt}</td>
                <td>${student.firstName}</td>
                <td>${student.fullName}</td>
                <td>${student.address}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });
    $('#studentTableBody').html(html);
    updatePagination();
    updatePaginationInfo();
    updateDeleteButton();
}
// Phân trang
function updatePagination() {
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    let html = '';
    // Nút Trước
    const prevClass = currentPage === 1 ? 'disabled' : '';
    html += `<li class="page-item ${prevClass}">
                <a href="#" class="page-link" data-page="${currentPage - 1}">‹</a>
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
                <a href="#" class="page-link" data-page="${currentPage + 1}">›</a>
             </li>`;
    $('#pagination').html(html);
}
// Cập nhật thông tin phân trang
function updatePaginationInfo() {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredStudents.length);
    $('#currentStart').text(start);
    $('#currentEnd').text(end);
}
// Cập nhật nút xóa
function updateDeleteButton() {
    const count = selectedStudents.size;
    if (count > 0) {
        $('#deleteSelectedBtn').show().html(`<i class="material-icons">&#xE15C;</i> <span>Xóa (${count})</span>`);
    } else {
        $('#deleteSelectedBtn').hide();
    }
}
// Chọn tất cả
function toggleSelectAll() {
    const checked = $('#selectAll').is(':checked');
    $('#studentTableBody input[type="checkbox"]').each(function () {
        $(this).prop('checked', checked);
        const id = parseInt($(this).val());
        if (checked) {
            selectedStudents.add(id);
        } else {
            selectedStudents.delete(id);
        }
    });
    updateDeleteButton();
}
// Chọn từng item
function toggleSelection(id) {
    if (selectedStudents.has(id)) {
        selectedStudents.delete(id);
    } else {
        selectedStudents.add(id);
    }
    // Cập nhật select all
    const total = $('#studentTableBody input[type="checkbox"]').length;
    const checked = $('#studentTableBody input[type="checkbox"]:checked').length;
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
    // Clear validation errors when closing modal
    clearValidationErrors($('#' + id).find('form'));
}
// Tìm kiếm
function searchStudents() {
    const term = $('#searchInput').val().toLowerCase();
    filteredStudents = students.filter(s =>
        s.firstName.toLowerCase().includes(term) ||
        s.fullName.toLowerCase().includes(term) ||
        s.address.toLowerCase().includes(term) ||
        s.id.toString().includes(term)
    );
    currentPage = 1;
    renderTable();
}
// Xem sinh viên
function viewStudent(id) {
    const student = students.find(item => item.id == id);
    if (student) {
        const statusText = student.status === 'active' ? 'Hoạt động' : 'Không hoạt động';
        alert(`Thông tin sinh viên:\n\nID: ${student.id}\nTên: ${student.firstName}\nHọ đệm: ${student.fullName}\nĐịa chỉ: ${student.address}\nTrạng thái: ${statusText}`);
    }
}
// Mở modal sửa
function openEditModal(id) {
    const student = students.find(item => item.id == id);
    if (student) {
        const form = $('#editStudentForm');
        clearValidationErrors(form);
        form.find('[name="id"]').val(student.id);
        form.find('[name="firstName"]').val(student.firstName);
        form.find('[name="fullName"]').val(student.fullName);
        form.find('[name="address"]').val(student.address);
        form.find('[name="status"]').val(student.status);
        // Update character counters
        form.find('input[name="firstName"], input[name="fullName"], input[name="address"]').each(function () {
            updateCharCounter($(this));
        });
        openModal('editStudentModal');
    }
}
// Mở modal xóa
function openDeleteModal(id = null) {
    if (id) {
        selectedStudents.clear();
        selectedStudents.add(parseInt(id));
    }
    openModal('deleteStudentModal');
}
// Thêm sinh viên
function addStudent() {
    const form = $('#addStudentForm');
    if (!validateForm(form)) return false;
    const newStudent = {
        id: Math.max(...students.map(s => s.id)) + 1,
        firstName: form.find('[name="firstName"]').val().trim(),
        fullName: form.find('[name="fullName"]').val().trim(),
        address: form.find('[name="address"]').val().trim(),
        status: form.find('[name="status"]').val()
    };
    students.push(newStudent);
    filteredStudents = [...students];
    renderTable();
    closeModal('addStudentModal');
    form[0].reset();
    // Reset character counters
    form.find('.char-counter .current').text('0');
    form.find('.char-counter').removeClass('warning danger');
    alert('Thêm sinh viên thành công!');
    return false;
}
// Cập nhật sinh viên
function updateStudent() {
    const form = $('#editStudentForm');
    if (!validateForm(form)) return false;
    const id = parseInt(form.find('[name="id"]').val());
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students[index] = {
            id: id,
            firstName: form.find('[name="firstName"]').val().trim(),
            fullName: form.find('[name="fullName"]').val().trim(),
            address: form.find('[name="address"]').val().trim(),
            status: form.find('[name="status"]').val()
        };
        filteredStudents = [...students];
        renderTable();
        closeModal('editStudentModal');
        alert('Cập nhật sinh viên thành công!');
    }
    return false;
}
// Xóa sinh viên
function deleteStudents() {
    selectedStudents.forEach(id => {
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) students.splice(index, 1);
    });
    selectedStudents.clear();
    filteredStudents = [...students];
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }
    renderTable();
    closeModal('deleteStudentModal');
    alert('Xóa sinh viên thành công!');
}
// jQuery Events
$(document).ready(function () {
    renderTable();
    // Character counter for input fields
    $(document).on('input', 'input[name="firstName"], input[name="fullName"], input[name="address"]', function () {
        updateCharCounter($(this));
    });
    // Real-time validation
    $(document).on('blur', 'input[name="firstName"], input[name="fullName"], input[name="address"]', function () {
        const input = $(this);
        const form = input.closest('form');
        const value = input.val().trim();
        const fieldName = input.attr('name');
        // Get max length from char counter
        let maxLength;
        if (fieldName === 'firstName') {
            maxLength = 15;
        } else if (fieldName === 'fullName') {
            maxLength = 20;
        } else if (fieldName === 'address') {
            maxLength = 50;
        }
        // Clear previous errors
        input.removeClass('is-invalid');
        input.siblings('.invalid-feedback').hide();
        // Validate field
        let errorMessage = '';
        if (!value) {
            if (fieldName === 'firstName') {
                errorMessage = 'Tên không được để trống';
            } else if (fieldName === 'fullName') {
                errorMessage = 'Họ đệm không được để trống';
            } else if (fieldName === 'address') {
                errorMessage = 'Địa chỉ không được để trống';
            }
        } else if (value.length > maxLength) {
            if (fieldName === 'firstName') {
                errorMessage = 'Tên không được quá 15 ký tự';
            } else if (fieldName === 'fullName') {
                errorMessage = 'Họ đệm không được quá 20 ký tự';
            } else if (fieldName === 'address') {
                errorMessage = 'Địa chỉ không được quá 50 ký tự';
            }
        }
        if (errorMessage) {
            showValidationError(input, errorMessage);
        }
    });
    // Tìm kiếm
    $('#searchInput').on('input', searchStudents);
    // Phân trang
    $(document).on('click', '#pagination a', function (e) {
        e.preventDefault();
        if (!$(this).parent().hasClass('disabled')) {
            currentPage = parseInt($(this).data('page'));
            renderTable();
        }
    });
    // Chọn tất cả
    $('#selectAll').on('change', toggleSelectAll);
    // Chọn từng item
    $(document).on('change', '#studentTableBody input[type="checkbox"]', function () {
        toggleSelection(parseInt($(this).val()));
    });
    // Các nút action
    $('.btn-success').on('click', function () {
        // Reset form when opening add modal
        const form = $('#addStudentForm');
        form[0].reset();
        clearValidationErrors(form);
        form.find('.char-counter .current').text('0');
        form.find('.char-counter').removeClass('warning danger');
        openModal('addStudentModal');
    });
    $('#deleteSelectedBtn').on('click', function () {
        if (selectedStudents.size > 0) {
            openModal('deleteStudentModal');
        }
    });
    $(document).on('click', '.view', function (e) {
        e.preventDefault();
        viewStudent($(this).data('id'));
    });
    $(document).on('click', '.edit', function (e) {
        e.preventDefault();
        openEditModal($(this).data('id'));
    });
    $(document).on('click', '.delete', function (e) {
        e.preventDefault();
        openDeleteModal($(this).data('id'));
    });
    // Đóng modal
    $('.close, .btn-secondary').on('click', function () {
        const modalId = $(this).closest('.modal').attr('id');
        closeModal(modalId);
    });
    // Click bên ngoài đóng modal
    $('.modal').on('click', function (e) {
        if (e.target === this) {
            const modalId = $(this).attr('id');
            closeModal(modalId);
        }
    });
    // Submit forms
    $('#addStudentModal .btn-success').on('click', function (e) {
        e.preventDefault();
        addStudent();
    });
    $('#editStudentModal .btn-primary').on('click', function (e) {
        e.preventDefault();
        updateStudent();
    });
    $('#deleteStudentModal .btn-danger').on('click', deleteStudents);
});