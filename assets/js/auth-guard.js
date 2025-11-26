// Lấy token từ localStorage
const token = localStorage.getItem("accessToken");

if (!token) {
    window.location.href = "../auth/login.html";
}