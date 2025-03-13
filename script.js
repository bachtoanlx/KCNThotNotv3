

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





 
// Xử lý hành động gửi dữ liệu vào GG Sheet2 (Thông báo nghỉ)
async function submitForm_2() {
    var loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        $('#loginModal').modal('show');
        return;
    }

    var c_ty = document.getElementById('c_ty').value;
    var ngay_nghi = document.getElementById('ngay_nghi').value || getCurrentDate();
    var ghi_chu = document.getElementById('ghi_chu').value;

    if (!c_ty || !ngay_nghi) {
        Swal.fire('Lỗi', 'Bạn chưa điền đủ thông tin bắt buộc!', 'error');
        return;
    }

    const elInput = document.getElementById("file");
    const file = elInput.files[0];
    let fileData = null;

    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire('Lỗi', 'File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.', 'error');
            return;
        }
        try {
            const reader = new FileReader();
            fileData = await new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result.split(",")[1]);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        } catch (error) {
            Swal.fire('Lỗi', 'Xảy ra lỗi khi đọc file', 'error');
            return;
        }
    } else {
        const confirmNoFile = await Swal.fire({
            title: "Không có file đính kèm?",
            text: "Bạn có muốn tiếp tục gửi không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Tiếp tục",
            cancelButtonText: "Hủy"
        });
        if (!confirmNoFile.isConfirmed) return;
    }

    var datesArray = ngay_nghi.split(',');
    var batchSize = 3; // Số ngày gửi mỗi nhóm
    var successCount = 0, errorCount = 0;

    Swal.fire({
        title: 'Đang gửi dữ liệu...',
        html: 'Vui lòng chờ trong giây lát',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    for (let i = 0; i < datesArray.length; i += batchSize) {
        let batch = datesArray.slice(i, i + batchSize);
        await Promise.all(batch.map(date => {
            let fileType = file?.type.split('/')[1] || file?.name.split('.').pop();
            if (!fileType) {
                fileType = "unknown";
            }
            if (!date.trim()) {
                console.error("date is empty");
                return;
            }
            if (!c_ty) {
                console.error("c_ty is empty");
                return;
            }

            let fileName = `${c_ty}-${date.trim()}.${fileType}`;
            return sendDataWithRetry(date.trim(), loggedInUser, c_ty, ghi_chu, fileData, fileName, file?.type);
        }))
        .then(results => {
            results.forEach(result => {
                if (result && result.success) successCount++;
                else if (result) errorCount++;
            });
        });
        await new Promise(resolve => setTimeout(resolve, 500)); // Nghỉ 500ms giữa các batch
    }

    Swal.close();

    if (successCount === datesArray.length) {
        Swal.fire('Thành công!', `${successCount} ngày đã được gửi!`, 'success').then(() => {
            window.location.reload();
        });
    } else if (successCount > 0) {
        Swal.fire('Chú ý', `${successCount} ngày gửi thành công, ${errorCount} ngày bị lỗi.`, 'warning');
    } else {
        Swal.fire('Lỗi', 'Tất cả yêu cầu gửi đều thất bại, vui lòng thử lại!', 'error');
    }
}

async function sendDataWithRetry(date, user, c_ty, ghi_chu, fileData, fileName, fileType, retries = 2) {
    var formData = {
        sheetName: 'Sheet2',
        user: user,
        c_ty: c_ty,
        ngay_nghi: date,
        ghi_chu: ghi_chu,
        fileData: fileData,
        name: fileName,
        type: fileType
    };

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbzg9lkoiVZeVE7kXcDV7gVa7lijeXjP-tAHukkv4lac5fXNzBJNOLYQEiSyu9cVgkmy/exec', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.result === 'success') {
                return { success: true };
            } else {
                console.error(`Thử lần ${attempt} thất bại:`, data);
            }
        } catch (error) {
            console.error(`Thử lần ${attempt} lỗi:`, error);
        }

        if (attempt <= retries) await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return { success: false };
}











