// Xử lý Menu -->
function toggleMenu() {
  var menu = document.querySelector('.menu');
  menu.style.display = (menu.style.display === 'block' || menu.style.display === '') ? 'none' : 'block';
}
// Hàm để đóng menu
function closeMenu() {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse.classList.contains('show')) {
        // Nếu menu đang mở, đóng nó
        const collapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        });
        collapse.hide();
    }
}
$(document).ready(function() {
  // Ẩn tất cả nội dung khi trang tải xong
  $('.protected-content').addClass('hidden-content');

  // Đọc dữ liệu từ tệp JSON và xử lý đăng nhập
  $.getJSON('accounts.json', function(data) {
      // Lưu danh sách tài khoản vào localStorage
      localStorage.setItem('accounts', JSON.stringify(data.accounts));

      // Kiểm tra nếu đã đăng nhập trước đó
      var savedUser = localStorage.getItem('loggedInUser');
      if (savedUser) {
          var accounts = JSON.parse(localStorage.getItem('accounts'));
          var user = accounts.find(account => account.username === savedUser);

          if (user) {
              $('#navbarTitle').text('Xin chào, ' + savedUser);
              $('#loginButton').text('Đăng xuất');

              if (user.role === 'admin') {
                  $('.protected-content').removeClass('hidden-content'); // Hiển thị nội dung cho admin
              } else {
                  $('.protected-content').removeClass('hidden-content'); // Hiển thị nội dung cho user
                  $('.admin-content').addClass('blur-content'); // Làm mờ nội dung chỉ dành cho admin
              }
          }
      } else {
          // Hiển thị modal đăng nhập khi người dùng chưa đăng nhập
          $('#loginModal').modal('show');
      }
  });

  // Xử lý sự kiện khi click Đăng nhập hoặc Đăng xuất
  $('#loginButton').click(function() {
      var buttonText = $(this).text();

      if (buttonText === 'Đăng nhập') {
          $('#loginModal').modal('show');
      } else if (buttonText === 'Đăng xuất') {
          $('#navbarTitle').text('Giải pháp công nghệ số');
          $('#loginButton').text('Đăng nhập');
          $('#userInfo').hide();
          localStorage.removeItem('loggedInUser');
          toastr.success('Bạn đã đăng xuất thành công!', 'Đăng xuất'); // Thông báo bằng Toastr
          closeMenu(); // Đóng menu khi đăng xuất
          $('.protected-content').addClass('hidden-content'); // Ẩn tất cả nội dung khi đăng xuất
      }
  });

  // Xử lý sự kiện khi click Đăng nhập trong modal
  $('#loginSubmitButton').click(function() {
      var username = $('#username').val();
      var password = $('#password').val();
      var accounts = JSON.parse(localStorage.getItem('accounts'));

      var loggedInUser = accounts.find(function(account) {
          return account.username === username && account.password === password;
      });

      if (loggedInUser) {
          $('#navbarTitle').text('Xin chào, ' + username);
          $('#loginButton').text('Đăng xuất');
          $('#loginModal').modal('hide');
          localStorage.setItem('loggedInUser', username);

          if (loggedInUser.role === 'admin') {
              closeMenu(); // Đóng menu khi đăng nhập admin
              $('.protected-content').removeClass('hidden-content'); // Hiển thị nội dung cho admin
          } else {
              closeMenu(); // Đóng menu khi đăng xnhập user
              $('.protected-content').removeClass('hidden-content'); // Hiển thị nội dung cho user
              $('.admin-content').addClass('blur-content'); // Làm mờ nội dung chỉ dành cho admin
          }
      } else {
          toastr.error('Tên đăng nhập hoặc mật khẩu không chính xác!', 'Lỗi'); // Thông báo bằng Toastr 
      }
  });
});
