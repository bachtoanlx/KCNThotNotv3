

  //Xử lý hành động gửi dữ liệu vào GG Sheet1 (gửi số nước)
  async function submitForm_1() {
    
    // Lấy thông tin người dùng đã đăng nhập từ localStorage
    var loggedInUser = localStorage.getItem('loggedInUser');

    if (!loggedInUser) {
        // Nếu người dùng chưa đăng nhập, hiển thị modal đăng nhập
        $('#loginModal').modal('show');
        return; // Dừng hàm submitForm ở đây để ngăn việc gửi dữ liệu khi chưa đăng nhập
    }

    // Hiển thị modal loading
    $('#loadingModal').modal('show');


// Xử lý file
const elInput = document.getElementById("file");
const file = elInput.files[0];
let fileData = null;
let fileName = '';
let input = document.getElementById("chi_so");
input.value = input.value.replace(/\./g, ""); // Xóa tất cả dấu chấm phân cách phần ngàn

if (file) {
    if (file.size > 5 * 1024 * 1024) { // Giới hạn kích thước file tối đa 5MB
        toastr.error('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.', 'Lỗi');
        $('#loadingModal').modal('hide'); // Ẩn modal loading
        return;
    }

    try {
        // Đọc file dưới dạng Data URL
        const reader = new FileReader();
        fileData = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result.split(",")[1]); // Lấy dữ liệu base64
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        // Tạo tên file mới dựa trên thông tin từ form
        const c_ty = document.getElementById('c_ty').value;
        const ngay_ghi = document.getElementById('ngay_ghi').value || getCurrentDate();
        fileName = `${c_ty}-${ngay_ghi}.${file.type.split('/')[1]}`; // Tạo tên file mới

    } catch (error) {
        console.error('Đã xảy ra lỗi khi đọc file:', error);
        toastr.error('Xảy ra lỗi khi đọc file', 'Lỗi');
        $('#loadingModal').modal('hide'); // Ẩn modal loading
        return;
    }
} else {
    // Sử dụng SweetAlert2 để cảnh báo
    const result = await Swal.fire({
        title: 'Chưa đính kèm hình ảnh',
        text: 'Bạn chưa đính kèm hình ảnh. Bạn có chắc chắn muốn gửi?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Hủy',
        reverseButtons: true
    });

    if (!result.isConfirmed) {
        $('#loadingModal').modal('hide'); // Ẩn modal loading
        return;
    }
}

// Tiếp tục xử lý dữ liệu form và gửi dữ liệu nếu file được đính kèm hoặc xác nhận gửi mà không có file
const c_ty = document.getElementById('c_ty').value;
const chi_so = document.getElementById('chi_so').value;
const ngay_ghi = document.getElementById('ngay_ghi').value || getCurrentDate();
const ghi_chu = document.getElementById('ghi_chu').value;

if (!c_ty || !chi_so) {
    toastr.error('Bạn chưa điền thông tin', 'Lỗi');
    $('#loadingModal').modal('hide'); // Ẩn modal loading
    return;
}

var formData = {
    sheetName: 'Sheet1',
    user: loggedInUser,
    c_ty: c_ty,
    chi_so: chi_so,
    ngay_ghi: ngay_ghi,
    ghi_chu: ghi_chu,
    fileData: fileData, // Chỉ thêm dữ liệu file nếu có
    name: fileName, // Sử dụng tên file mới nếu có
    type: file ? file.type : null
};

try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzg9lkoiVZeVE7kXcDV7gVa7lijeXjP-tAHukkv4lac5fXNzBJNOLYQEiSyu9cVgkmy/exec', {
        method: 'POST',
        body: JSON.stringify(formData)
    });

    const data = await response.json();
    console.log(data);
    if (data.result === 'success') {
        toastr.success('Dữ liệu đã được gửi thành công!', 'Thành công'); // Thông báo bằng Toastr
        document.getElementById('registrationForm').reset(); // Reset from sau khi thành công
        
    } else {
        toastr.error('Đã xảy ra lỗi khi gửi dữ liệu! Vui lòng thử lại.', 'Lỗi'); // Thông báo bằng Toastr
    }
    } catch (error) {
        console.error('Caught an error:', error);
        toastr.error('Đã xảy ra lỗi!', 'Lỗi'); // Thông báo bằng Toastr
    } finally {
        $('#loadingModal').modal('hide'); // Ẩn modal loading
    }

}

