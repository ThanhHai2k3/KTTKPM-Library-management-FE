const API_BASE = "http://localhost:8080/api/categories";

const searchInput = document.getElementById("searchInput");
const table = document.querySelector("table");
const tableBody = document.getElementById("categoryTableBody");
const noResults = document.getElementById("noResults");

let categoryList = [];

function removeVietnameseTone(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")     // bỏ dấu
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .toLowerCase();
}

async function loadCategories() {
    try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(API_BASE, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        categoryList = await res.json();

        categoryList.sort((a, b) =>
            removeVietnameseTone(a.name).localeCompare(removeVietnameseTone(b.name))
        );

        renderTable(categoryList);

    } catch (err) {
        console.error("Error loading categories:", err);
    }
}

function renderTable(data) {
    tableBody.innerHTML = "";

    if (data.length === 0) {
        table.classList.add("d-none");
        noResults.classList.remove("d-none");
        return;
    }

    table.classList.remove("d-none");
    noResults.classList.add("d-none");

    data.forEach((cat, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${cat.name}</td>
            <td>${cat.description || ""}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1"
                        onclick="viewCategory(${cat.id})">
                    Xem
                </button>

                <button class="btn btn-sm btn-outline-warning me-1"
                        onclick="editCategory(${cat.id})">
                    Sửa
                </button>

                <button class="btn btn-sm btn-outline-danger"
                        onclick="deleteCategory(${cat.id}, '${cat.name}')">
                    Xóa
                </button>
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

function viewCategory(id) {
    window.location.href = `detail.html?id=${id}`;
}

function editCategory(id) {
    window.location.href = `edit.html?id=${id}`;
}

async function deleteCategory(id, name) {
    const ok = confirm(`Bạn có chắc muốn xóa thể loại "${name}" không?`);
    if (!ok) return;

    try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${API_BASE}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 204) {
            alert("Xóa thành công!");
            loadCategories();
            return;
        }

        let data = {};

        try {
            data = await res.json();
        } catch (_) {
            
        }
        alert("Thể loại này đang chứa sách, không thể xóa.");
    } catch (err) {
        alert("Không thể kết nối server");
    }
}

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const keyword = removeVietnameseTone(searchInput.value.trim());

        const filtered = categoryList.filter(cat =>
            removeVietnameseTone(cat.name).includes(keyword)
        );

        filtered.sort((a, b) =>
            removeVietnameseTone(a.name).localeCompare(removeVietnameseTone(b.name))
        );

        renderTable(filtered);
    }
});

loadCategories();
