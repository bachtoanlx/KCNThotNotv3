

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





 

// Xử lý hành động gửi dữ liệu vào GG Sheet2 (gửi thông báo nghỉ)
async function submitForm_2() {
    // Lấy thông tin người dùng đã đăng nhập từ localStorage
    var loggedInUser = localStorage.getItem('loggedInUser');

    if (!loggedInUser) {
        // Nếu người dùng chưa đăng nhập, hiển thị modal đăng nhập
        $('#loginModal').modal('show');
        return; // Dừng hàm submitForm ở đây để ngăn việc gửi dữ liệu khi chưa đăng nhập
    }

    // Lấy các giá trị từ form
    var c_ty = document.getElementById('c_ty').value;
    var ngay_nghi = document.getElementById('ngay_nghi').value || getCurrentDate();
    var ghi_chu = document.getElementById('ghi_chu').value;

    // Kiểm tra nếu các trường cần thiết chưa được điền
    if (!c_ty || !ngay_nghi) {
        toastr.error('Bạn chưa điền đủ thông tin bắt buộc!', 'Lỗi');
        return; // Dừng hàm lại nếu thông tin chưa đầy đủ
    }

    // Hiển thị modal loading sau khi đã kiểm tra các trường cần thiết
    $('#loadingModal').modal('show');

    // Xử lý file đính kèm
    const elInput = document.getElementById("file");
    const file = elInput.files[0];
    let fileData = null;
    let fileName = '';

    if (file) {
        if (file.size > 5 * 1024 * 1024) { // Giới hạn kích thước file tối đa 5MB
            toastr.error('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.', 'Lỗi');
            $('#loadingModal').modal('hide'); // Ẩn modal loading
            return;
        }

        try {
            // Đọc file dưới dạng Data URL (base64)
            const reader = new FileReader();
            fileData = await new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result.split(",")[1]); // Lấy dữ liệu base64
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Tạo tên file mới dựa trên thông tin từ form
            const fileType = file.type.split('/')[1] || file.name.split('.').pop(); // Lấy đuôi file từ tên nếu không xác định được từ MIME type
            fileName = `${c_ty}-${ngay_nghi}.${fileType}`;

        } catch (error) {
            console.error('Đã xảy ra lỗi khi đọc file:', error);
            toastr.error('Xảy ra lỗi khi đọc file', 'Lỗi');
            $('#loadingModal').modal('hide'); // Ẩn modal loading
            return;
        }
    } else {
        // Nếu không có file đính kèm, hiển thị thông báo xác nhận
        const confirmNoFile = confirm('Bạn chưa đính kèm file. Bạn có muốn tiếp tục gửi không?');
        if (!confirmNoFile) {
            $('#loadingModal').modal('hide'); // Ẩn modal loading
            return; // Hủy gửi form nếu người dùng không muốn tiếp tục
        }
    }

    // Chia dữ liệu ngày thành một mảng các ngày
    var datesArray = ngay_nghi.split(',');

// Khởi tạo biến đếm số lượng ngày
var totalDates = datesArray.length;
var successCount = 0;
var errorCount = 0;

// Sử dụng Promise.all để xử lý bất đồng bộ song song
await Promise.all(datesArray.map(async function (date) {
    var formData = {
        sheetName: 'Sheet2',
        user: loggedInUser,
        c_ty: c_ty,
        ngay_nghi: date.trim(),
        ghi_chu: ghi_chu,
        fileData: fileData,
        name: fileName,
        type: file ? file.type : null
    };

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzg9lkoiVZeVE7kXcDV7gVa7lijeXjP-tAHukkv4lac5fXNzBJNOLYQEiSyu9cVgkmy/exec', {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.result === 'success') {
            successCount++;
            console.log(`Ngày ${date.trim()} gửi thành công.`);
        } else {
            errorCount++;
            console.error(`Ngày ${date.trim()} gửi thất bại:`, data);
            toastr.error(`Gửi ngày ${date.trim()} thất bại.`, 'Lỗi'); // Hiển thị lỗi ngay lập tức
        }
    } catch (error) {
        errorCount++;
        console.error(`Đã xảy ra lỗi khi gửi ngày ${date.trim()}:`, error);
        toastr.error(`Đã xảy ra lỗi khi gửi ngày ${date.trim()}.`, 'Lỗi'); // Hiển thị lỗi ngay lập tức
    }
})); // Chờ tất cả các fetch hoàn thành

// Sau khi tất cả các fetch đã hoàn thành
$('#loadingModal').modal('hide'); // Ẩn modal loading

// Tạo thông báo thành công với số ngày
const successMessage = `${successCount} dữ liệu đã được gửi thành công!`;

if (successCount === totalDates) {
    toastr.success(successMessage, 'Thành công'); // Sử dụng biến successMessage
    setTimeout(function () {
        window.location.reload();
    }, 2000);
} else if (successCount > 0) {
    toastr.warning(`${successCount} ngày được gửi thành công, ${errorCount} ngày bị lỗi.`, 'Chú ý');
} else {
    toastr.error('Đã xảy ra lỗi khi gửi dữ liệu! Vui lòng thử lại.', 'Lỗi');
}
}







  

/*Xử lý hành động gửi dữ liệu vào GG Sheet (mẫu dự phòng)
  function submitForm_2() {
    // Lấy thông tin người dùng đã đăng nhập từ localStorage
    var loggedInUser = localStorage.getItem('loggedInUser');
  
    if (!loggedInUser) {
        // Nếu người dùng chưa đăng nhập, hiển thị modal đăng nhập
        $('#loginModal').modal('show');
        return; // Dừng hàm submitForm ở đây để ngăn việc gửi dữ liệu khi chưa đăng nhập
    }
  
    // Hiển thị modal loading
    $('#loadingModal').modal('show');
  
    var c_ty = document.getElementById('c_ty').value;
    var ngay_nghi = document.getElementById('ngay_nghi').value || getCurrentDate();
    var ghi_chu = document.getElementById('ghi_chu').value;
  
    if (!c_ty || !ngay_nghi) {
        $('#errorModal').modal('show'); // Hiển thị modal lỗi
        $('#loadingModal').modal('hide'); // Ẩn modal loading
        return;
    }
  
    var formData = {
        sheetName: 'Sheet2',
        user: loggedInUser, // Thêm thông tin người dùng đăng nhập vào đây
        c_ty: c_ty,
        ngay_nghi: ngay_nghi,
        ghi_chu: ghi_chu  
    };
  
    console.log(formData);
    fetch('https://script.google.com/macros/s/AKfycbzg9lkoiVZeVE7kXcDV7gVa7lijeXjP-tAHukkv4lac5fXNzBJNOLYQEiSyu9cVgkmy/exec', {
        method: 'POST',
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.result === 'success') {
            // Hiển thị modal thành công
            $('#successModal').modal('show');
  
            // Tự động đóng modal sau 2 giây
            setTimeout(function () {
                $('#successModal').modal('hide');
            }, 2000);
  
            // Reset form
            document.getElementById('registrationForm').reset();
        } else {
            // Hiển thị modal lỗi
            $('#errorModal').modal('show');
        }
    })
    .catch(error => {
        console.error('Đã xảy ra lỗi:', error);
        $('#errorModal').modal('show'); // Hiển thị modal lỗi
    })
    .finally(() => {
        // Ẩn modal loading sau khi hoàn thành
        $('#loadingModal').modal('hide');
    });
  }
  */