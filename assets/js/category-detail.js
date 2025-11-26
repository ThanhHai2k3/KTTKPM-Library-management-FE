const API_BASE = "http://localhost:8080/api/categories";

const params = new URLSearchParams(window.location.search);
const categoryId = params.get("id");

if (!categoryId) {
    window.location.href = "list.html";
}

const nameBox = document.getElementById("categoryName");
const descBox = document.getElementById("categoryDescription");
const countBox = document.getElementById("categoryBookCount");

async function loadCategoryDetail() {
    try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${API_BASE}/${categoryId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            if (res.status === 404) {
                alert("Không tìm thấy thể loại.");
                window.location.href = "list.html";
                return;
            }
            if (res.status === 401) {
                alert("Bạn chưa đăng nhập.");
                window.location.href = "../auth/login.html";
                return;
            }
            throw new Error("Lỗi tải dữ liệu.");
        }

        const data = await res.json();

        nameBox.textContent = data.name || "(Không có tên)";
        descBox.textContent = data.description || "(Không có mô tả)";
        countBox.textContent = data.bookCount ?? 0;

    } catch (err) {
        alert("Không thể tải thông tin thể loại");
    }
}

document.getElementById("backBtn").onclick = () => {
    window.location.href = "list.html";
};

loadCategoryDetail();
