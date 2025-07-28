// Biến toàn cục
let sttCounter = 4;
let selectedRow = null; // Biến để ghi nhớ dòng đang sửa
let isEditMode = false; // Biến để kiểm tra chế độ chỉnh sửa

// Event listener cho form
document.getElementById("formSinhVien").addEventListener("submit", function(event) {
    event.preventDefault();
    
    console.log("Form submitted, isEditMode:", isEditMode);
    
    if (isEditMode) {
        capNhatSinhVien();
    } else {
        themSinhVien();
    }
});

// Hàm thêm sinh viên
function themSinhVien() {
    // Lấy dữ liệu từ form
    const maSV = document.getElementById("maSV").value.trim();
    const hoTen = document.getElementById("hoTen").value.trim();
    const email = document.getElementById("email").value.trim();
    const ngaySinh = document.getElementById("ngaySinh").value;
    const gioiTinhElements = document.getElementsByName("gioiTinh");
    const ghiChu = document.getElementById("ghiChu").value.trim();

    // Tiết 5: Xác thực đầu vào (Validation)
    if (!validateInput(maSV, hoTen, email)) {
        return;
    }

    // Kiểm tra mã sinh viên đã tồn tại
    if (kiemTraMaSVTonTai(maSV)) {
        hienThiThongBao("Mã sinh viên đã tồn tại!", "error");
        return;
    }

    // Lấy giới tính được chọn
    let gioiTinh = "Nam";
    for (let i = 0; i < gioiTinhElements.length; i++) {
        if (gioiTinhElements[i].checked) {
            gioiTinh = gioiTinhElements[i].value;
            break;
        }
    }

    // Định dạng ngày sinh
    let ngaySinhFormatted = "";
    if (ngaySinh) {
        const date = new Date(ngaySinh);
        ngaySinhFormatted = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }

    // Thêm dòng mới vào bảng desktop
    const table = document.getElementById("bangSinhVien").getElementsByTagName("tbody")[0];
    const newRow = table.insertRow();
    newRow.insertCell(0).innerText = sttCounter;
    newRow.insertCell(1).innerText = maSV;
    newRow.insertCell(2).innerText = hoTen;
    newRow.insertCell(3).innerText = email;
    newRow.insertCell(4).innerText = gioiTinh;
    newRow.insertCell(5).innerText = ngaySinhFormatted;
    newRow.insertCell(6).innerText = ghiChu;
    newRow.insertCell(7).innerHTML = `
        <a href="#" class="action-link" onclick="suaDong(this)">Sửa</a>
        <a href="#" class="action-link delete" onclick="xoaDong(this)">Xóa</a>
    `;

    // Thêm card mới cho mobile
    themMobileCard(maSV, hoTen, email, gioiTinh, ngaySinhFormatted, ghiChu);

    // Tăng counter
    sttCounter++;

    hienThiThongBao("Thêm sinh viên thành công!", "success");
    
    // Reset form
    document.getElementById("formSinhVien").reset();
}

// Tiết 5: Hàm xác thực đầu vào
function validateInput(maSV, hoTen, email) {
    // Kiểm tra dữ liệu rỗng
    if (maSV === "") {
        hienThiThongBao("Mã sinh viên không được để trống!", "error");
        return false;
    }
    
    if (hoTen === "") {
        hienThiThongBao("Họ tên không được để trống!", "error");
        return false;
    }
    
    if (email === "") {
        hienThiThongBao("Email không được để trống!", "error");
        return false;
    }

    // Kiểm tra định dạng email
    const regexEmail = /^\S+@\S+\.\S+$/;
    if (!regexEmail.test(email)) {
        hienThiThongBao("Email không hợp lệ!", "error");
        return false;
    }

    return true;
}

// Hàm kiểm tra mã sinh viên đã tồn tại
function kiemTraMaSVTonTai(maSV) {
    const table = document.getElementById("bangSinhVien").getElementsByTagName("tbody")[0];
    const rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[1].innerText === maSV) {
            return true;
        }
    }
    return false;
}

// Tiết 4: Hàm xóa dòng
function xoaDong(btn) {
    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
        const row = btn.parentElement.parentElement;
        const maSV = row.cells[1].innerText;
        
        // Xóa dòng trong bảng
        row.remove();
        
        // Xóa card tương ứng trong mobile
        xoaMobileCardByMaSV(maSV);
        
        // Cập nhật lại STT
        capNhatSTT();
        
        hienThiThongBao("Xóa thành công!", "success");
    }
}

// Tiết 6: Hàm sửa dòng
function suaDong(btn) {
    console.log("Bắt đầu sửa dòng");
    selectedRow = btn.parentElement.parentElement;
    
    // Nạp dữ liệu lên form
    document.getElementById("maSV").value = selectedRow.cells[1].innerText;
    document.getElementById("hoTen").value = selectedRow.cells[2].innerText;
    document.getElementById("email").value = selectedRow.cells[3].innerText;
    
    // Chuyển đổi ngày sinh từ DD/MM/YYYY sang YYYY-MM-DD
    const ngaySinhText = selectedRow.cells[5].innerText;
    if (ngaySinhText && ngaySinhText.trim() !== "") {
        const parts = ngaySinhText.split('/');
        if (parts.length === 3) {
            const ngaySinhFormatted = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            document.getElementById("ngaySinh").value = ngaySinhFormatted;
        }
    } else {
        document.getElementById("ngaySinh").value = "";
    }
    
    // Set giới tính
    const gioiTinh = selectedRow.cells[4].innerText;
    const gioiTinhRadios = document.getElementsByName("gioiTinh");
    for (let i = 0; i < gioiTinhRadios.length; i++) {
        if (gioiTinhRadios[i].value === gioiTinh) {
            gioiTinhRadios[i].checked = true;
            break;
        }
    }
    
    // Set ghi chú
    document.getElementById("ghiChu").value = selectedRow.cells[6].innerText;
    
    // Chuyển sang chế độ chỉnh sửa
    chuyenSangCheDoChinh();
    
    // Scroll đến form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    
    console.log("Đã chuyển sang chế độ sửa");
}

// Hàm chuyển sang chế độ chỉnh sửa
function chuyenSangCheDoChinh() {
    isEditMode = true;
    document.getElementById("formTitle").innerText = "Chỉnh sửa sinh viên";
    document.getElementById("btnThem").innerText = "Cập nhật";
    document.getElementById("btnThem").className = "btn-submit btn-update";
    document.getElementById("btnHuy").style.display = "block";
}

// Hàm chuyển về chế độ thêm mới
function chuyenVeCheDoBinhThuong() {
    isEditMode = false;
    selectedRow = null;
    document.getElementById("formTitle").innerText = "Thêm sinh viên mới";
    document.getElementById("btnThem").innerText = "Thêm sinh viên";
    document.getElementById("btnThem").className = "btn-submit";
    document.getElementById("btnHuy").style.display = "none";
}

// Thêm vào cuối file script.js

// Hàm hủy chỉnh sửa
function huyChinhSua() {
    if (confirm("Bạn có chắc chắn muốn hủy chỉnh sửa?")) {
        // Reset form
        document.getElementById("formSinhVien").reset();
        
        // Chuyển về chế độ bình thường
        chuyenVeCheDoBinhThuong();
        
        hienThiThongBao("Đã hủy chỉnh sửa!", "success");
    }
}

// Cập nhật hàm themSinhVien để có xác nhận
function themSinhVien() {
    // Lấy dữ liệu từ form
    const maSV = document.getElementById("maSV").value.trim();
    const hoTen = document.getElementById("hoTen").value.trim();
    const email = document.getElementById("email").value.trim();
    const ngaySinh = document.getElementById("ngaySinh").value;
    const gioiTinhElements = document.getElementsByName("gioiTinh");
    const ghiChu = document.getElementById("ghiChu").value.trim();

    // Tiết 5: Xác thực đầu vào (Validation)
    if (!validateInput(maSV, hoTen, email)) {
        return;
    }

    // Kiểm tra mã sinh viên đã tồn tại
    if (kiemTraMaSVTonTai(maSV)) {
        hienThiThongBao("Mã sinh viên đã tồn tại!", "error");
        return;
    }

    // Xác nhận trước khi thêm
    if (!confirm("Bạn có chắc chắn muốn thêm sinh viên này?")) {
        return;
    }

    // Lấy giới tính được chọn
    let gioiTinh = "Nam";
    for (let i = 0; i < gioiTinhElements.length; i++) {
        if (gioiTinhElements[i].checked) {
            gioiTinh = gioiTinhElements[i].value;
            break;
        }
    }

    // Định dạng ngày sinh
    let ngaySinhFormatted = "";
    if (ngaySinh) {
        const date = new Date(ngaySinh);
        ngaySinhFormatted = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }

    // Thêm dòng mới vào bảng desktop
    const table = document.getElementById("bangSinhVien").getElementsByTagName("tbody")[0];
    const newRow = table.insertRow();
    newRow.insertCell(0).innerText = sttCounter;
    newRow.insertCell(1).innerText = maSV;
    newRow.insertCell(2).innerText = hoTen;
    newRow.insertCell(3).innerText = email;
    newRow.insertCell(4).innerText = gioiTinh;
    newRow.insertCell(5).innerText = ngaySinhFormatted;
    newRow.insertCell(6).innerText = ghiChu;
    newRow.insertCell(7).innerHTML = `
        <a href="#" class="action-link" onclick="suaDong(this)">Sửa</a>
        <a href="#" class="action-link delete" onclick="xoaDong(this)">Xóa</a>
    `;

    // Thêm card mới cho mobile
    themMobileCard(maSV, hoTen, email, gioiTinh, ngaySinhFormatted, ghiChu);

    // Tăng counter
    sttCounter++;

    hienThiThongBao("Thêm sinh viên thành công!", "success");
    
    // Reset form
    document.getElementById("formSinhVien").reset();
}

// Hàm cập nhật sinh viên (cần bổ sung)
function capNhatSinhVien() {
    // Lấy dữ liệu từ form
    const maSV = document.getElementById("maSV").value.trim();
    const hoTen = document.getElementById("hoTen").value.trim();
    const email = document.getElementById("email").value.trim();
    const ngaySinh = document.getElementById("ngaySinh").value;
    const gioiTinhElements = document.getElementsByName("gioiTinh");
    const ghiChu = document.getElementById("ghiChu").value.trim();

    // Xác thực đầu vào
    if (!validateInput(maSV, hoTen, email)) {
        return;
    }

    // Kiểm tra mã sinh viên đã tồn tại (trừ dòng đang sửa)
    if (selectedRow && selectedRow.cells[1].innerText !== maSV && kiemTraMaSVTonTai(maSV)) {
        hienThiThongBao("Mã sinh viên đã tồn tại!", "error");
        return;
    }

    // Xác nhận trước khi cập nhật
    if (!confirm("Bạn có chắc chắn muốn cập nhật thông tin sinh viên này?")) {
        return;
    }

    // Lấy giới tính được chọn
    let gioiTinh = "Nam";
    for (let i = 0; i < gioiTinhElements.length; i++) {
        if (gioiTinhElements[i].checked) {
            gioiTinh = gioiTinhElements[i].value;
            break;
        }
    }

    // Định dạng ngày sinh
    let ngaySinhFormatted = "";
    if (ngaySinh) {
        const date = new Date(ngaySinh);
        ngaySinhFormatted = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }

    // Cập nhật dữ liệu trong bảng desktop
    if (selectedRow) {
        const oldMaSV = selectedRow.cells[1].innerText;
        selectedRow.cells[1].innerText = maSV;
        selectedRow.cells[2].innerText = hoTen;
        selectedRow.cells[3].innerText = email;
        selectedRow.cells[4].innerText = gioiTinh;
        selectedRow.cells[5].innerText = ngaySinhFormatted;
        selectedRow.cells[6].innerText = ghiChu;

        // Cập nhật mobile card tương ứng
        capNhatMobileCard(oldMaSV, maSV, hoTen, email, gioiTinh, ngaySinhFormatted, ghiChu);
    }

    hienThiThongBao("Cập nhật sinh viên thành công!", "success");
    
    // Reset form và chuyển về chế độ bình thường
    document.getElementById("formSinhVien").reset();
    chuyenVeCheDoBinhThuong();
}

// Các hàm hỗ trợ cho mobile (cần bổ sung)
function themMobileCard(maSV, hoTen, email, gioiTinh, ngaySinh, ghiChu) {
    const container = document.getElementById("mobileCardContainer");
    const cardHTML = `
        <div class="student-card">
            <div class="card-header">
                <div class="student-name">${hoTen}</div>
                <div class="student-id">${maSV}</div>
            </div>
            <div class="card-info">
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${email}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Giới tính:</span>
                    <span class="info-value">${gioiTinh}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Ngày sinh:</span>
                    <span class="info-value">${ngaySinh}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Ghi chú:</span>
                    <span class="info-value">${ghiChu}</span>
                </div>
            </div>
            <div class="card-actions">
                <a href="#" class="mobile-action" onclick="suaMobileCard(this)">✏️ Sửa</a>
                <a href="#" class="mobile-action delete" onclick="xoaMobileCard(this)">🗑️ Xóa</a>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHTML);
}

function xoaMobileCardByMaSV(maSV) {
    const cards = document.querySelectorAll('.student-card');
    cards.forEach(card => {
        const cardMaSV = card.querySelector('.student-id').innerText;
        if (cardMaSV === maSV) {
            card.remove();
        }
    });
}

function capNhatMobileCard(oldMaSV, maSV, hoTen, email, gioiTinh, ngaySinh, ghiChu) {
    const cards = document.querySelectorAll('.student-card');
    cards.forEach(card => {
        const cardMaSV = card.querySelector('.student-id').innerText;
        if (cardMaSV === oldMaSV) {
            card.querySelector('.student-name').innerText = hoTen;
            card.querySelector('.student-id').innerText = maSV;
            
            const infoValues = card.querySelectorAll('.info-value');
            infoValues[0].innerText = email;
            infoValues[1].innerText = gioiTinh;
            infoValues[2].innerText = ngaySinh;
            infoValues[3].innerText = ghiChu;
        }
    });
}

function capNhatSTT() {
    const table = document.getElementById("bangSinhVien").getElementsByTagName("tbody")[0];
    const rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].innerText = i + 1;
    }
}

// Hàm hỗ trợ hiển thị thông báo (nếu chưa có)
function hienThiThongBao(message, type) {
    const thongBao = document.getElementById("thongBao");
    thongBao.innerText = message;
    thongBao.className = `thong-bao ${type}`;
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
        thongBao.innerText = "";
        thongBao.className = "thong-bao";
    }, 3000);
}

// Các hàm xử lý mobile card
function suaMobileCard(btn) {
    const card = btn.closest('.student-card');
    const maSV = card.querySelector('.student-id').innerText;
    
    // Tìm dòng tương ứng trong bảng desktop
    const table = document.getElementById("bangSinhVien").getElementsByTagName("tbody")[0];
    const rows = table.getElementsByTagName("tr");
    
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[1].innerText === maSV) {
            suaDong(rows[i].querySelector('.action-link'));
            break;
        }
    }
}

function xoaMobileCard(btn) {
    const card = btn.closest('.student-card');
    const maSV = card.querySelector('.student-id').innerText;
    
    // Tìm dòng tương ứng trong bảng desktop
    const table = document.getElementById("bangSinhVien").getElementsByTagName("tbody")[0];
    const rows = table.getElementsByTagName("tr");
    
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[1].innerText === maSV) {
            xoaDong(rows[i].querySelector('.action-link.delete'));
            break;
        }
    }
}