// Biến toàn cục để đếm số thứ tự
let sttCounter = 4; // Bắt đầu từ 4 vì đã có 3 sinh viên mẫu

document.getElementById("btnThem").addEventListener("click", function(event) {
    event.preventDefault(); // Ngăn form submit mặc định
    alert("Đã nhấn nút Thêm sinh viên!");
    themSinhVien(); // Gọi hàm thêm sinh viên
});

function themSinhVien() {
    // Lấy dữ liệu từ form
    const maSV = document.getElementById("maSV").value.trim();
    const hoTen = document.getElementById("hoTen").value.trim();
    const email = document.getElementById("email").value.trim();
    const ngaySinh = document.getElementById("ngaySinh").value;
    const gioiTinhElements = document.getElementsByName("gioiTinh");
    const ghiChu = document.getElementById("ghiChu").value.trim();

    // Kiểm tra dữ liệu đầu vào
    if (!maSV || !hoTen || !email) {
        hienThiThongBao("Vui lòng điền đầy đủ thông tin bắt buộc!", "error");
        return;
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        hienThiThongBao("Email không hợp lệ!", "error");
        return;
    }

    // Kiểm tra mã sinh viên đã tồn tại
    const table = document.getElementById("bangSinhVien").getElementsByTagName("tbody")[0];
    const rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[1].innerText === maSV) {
            hienThiThongBao("Mã sinh viên đã tồn tại!", "error");
            return;
        }
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
    const newRow = table.insertRow();
    newRow.insertCell(0).innerText = sttCounter;
    newRow.insertCell(1).innerText = maSV;
    newRow.insertCell(2).innerText = hoTen;
    newRow.insertCell(3).innerText = email;
    newRow.insertCell(4).innerText = gioiTinh;
    newRow.insertCell(5).innerText = ngaySinhFormatted;
    newRow.insertCell(6).innerHTML = `
        <a href="#" class="action-link" onclick="suaSinhVien(this)">Sửa</a>
        <a href="#" class="action-link delete" onclick="xoaDong(this)">Xóa</a>
    `;

    // Thêm card mới cho mobile
    themMobileCard(maSV, hoTen, email, gioiTinh, ngaySinhFormatted);

    // Tăng counter
    sttCounter++;

    hienThiThongBao("Thêm sinh viên thành công!", "success");
    
    // Reset form
    document.getElementById("formSinhVien").reset();
}

// Hàm thêm mobile card
function themMobileCard(maSV, hoTen, email, gioiTinh, ngaySinh) {
    const mobileContainer = document.getElementById("mobileCardContainer");
    
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
            </div>
            <div class="card-actions">
                <a href="#" class="mobile-action" onclick="suaSinhVien(this)">✏️ Sửa</a>
                <a href="#" class="mobile-action delete" onclick="xoaMobileCard(this)">🗑️ Xóa</a>
            </div>
        </div>
    `;
    
    mobileContainer.insertAdjacentHTML('beforeend', cardHTML);
}

function hienThiThongBao(message, type) {
    const thongBao = document.getElementById("thongBao");
    thongBao.innerText = message;
    thongBao.className = `thong-bao ${type}`;
    
    // Tự ẩn thông báo sau 3 giây
    setTimeout(() => {
        thongBao.innerText = "";
        thongBao.className = "thong-bao";
    }, 3000);
}

// Hàm xóa dòng trong bảng desktop
function xoaDong(element) {
    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
        const row = element.closest('tr');
        const maSV = row.cells[1].innerText;
        
        // Xóa dòng trong bảng
        row.remove();
        
        // Xóa card tương ứng trong mobile
        xoaMobileCardByMaSV(maSV);
        
        // Cập nhật lại STT
        capNhatSTT();
        
        hienThiThongBao("Đã xóa sinh viên thành công!", "success");
    }
}

// Hàm xóa mobile card
function xoaMobileCard(element) {
    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
        const card = element.closest('.student-card');
        const maSV = card.querySelector('.student-id').innerText;
        
        // Xóa card
        card.remove();
        
        // Xóa dòng tương ứng trong bảng desktop
        xoaDongByMaSV(maSV);
        
        // Cập nhật lại STT
        capNhatSTT();
        
        hienThiThongBao("Đã xóa sinh viên thành công!", "success");
    }
}

// Hàm xóa mobile card theo mã SV
function xoaMobileCardByMaSV(maSV) {
    const cards = document.querySelectorAll('.student-card');
    cards.forEach(card => {
        const cardMaSV = card.querySelector('.student-id').innerText;
        if (cardMaSV === maSV) {
            card.remove();
        }
    });
}

// Hàm xóa dòng bảng theo mã SV
function xoaDongByMaSV(maSV) {
    const table = document.getElementById("bangSinhVien").getElementsByTagName("tbody")[0];
    const rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[1].innerText === maSV) {
            rows[i].remove();
            break;
        }
    }
}

// Hàm cập nhật lại số thứ tự
function capNhatSTT() {
    const table = document.getElementById("bangSinhVien").getElementsByTagName("tbody")[0];
    const rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].innerText = i + 1;
    }
    sttCounter = rows.length + 1;
}

// Hàm sửa sinh viên (placeholder)
function suaSinhVien(element) {
    alert("Chức năng sửa chưa hoàn thiện!");
}

// Thêm hiệu ứng cho form khi load trang
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM đã load hoàn tất!");
    console.log("🎯 Tiết 1: Đã gắn sự kiện click cho nút 'Thêm sinh viên'");
    console.log("📋 Tiết 2: Đã chuẩn bị chức năng thêm dòng mới vào bảng");
    console.log("💬 Tiết 3: Đã chuẩn bị hệ thống thông báo và reset form");
});