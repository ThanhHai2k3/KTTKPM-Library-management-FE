const API_BASE = "http://localhost:8080/api/books";

let currentPage = 0;
let totalPages = 1;
let currentKeyword = "";

const table = document.getElementById("bookTable");
const tableBody = document.getElementById("bookTableBody");
const noResults = document.getElementById("noResults");
const pageInfo = document.getElementById("pageInfo");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function removeVietnameseTone(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .toLowerCase();
}

async function loadBooks(page = 0) {
    const token = localStorage.getItem("accessToken");

    const url = currentKeyword
        ? `${API_BASE}/search?keyword=${encodeURIComponent(currentKeyword)}&page=${page}&size=10`
        : `${API_BASE}?page=${page}&size=10`;

    const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();

    let books = data.content || [];

    totalPages = data.totalPages;
    currentPage = data.number;

    books.sort((a, b) =>
        removeVietnameseTone(a.title).localeCompare(removeVietnameseTone(b.title))
    );

    renderTable(books);
    updatePagination();
}

function renderTable(books) {
    tableBody.innerHTML = "";

    if (books.length === 0) {
        table.classList.add("d-none");
        noResults.classList.remove("d-none");
        return;
    }

    table.classList.remove("d-none");
    noResults.classList.add("d-none");

    books.forEach((book, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${index + 1 + currentPage * 10}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.categoryName}</td>
            <td>${book.publisher}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1"
                        onclick="viewBook(${book.id})">
                    Xem
                </button>

                <button class="btn btn-sm btn-outline-warning me-1"
                        onclick="editBook(${book.id})">
                    Sửa
                </button>

                <button class="btn btn-sm btn-outline-danger"
                        onclick="deleteBook(${book.id}, '${book.title}')">
                    Xóa
                </button>
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

function updatePagination() {
    pageInfo.textContent = `Trang ${currentPage + 1} / ${totalPages}`;

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
}

document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        currentKeyword = e.target.value.trim();
        currentPage = 0;
        loadBooks(0);
    }
});

// Pagination
prevBtn.onclick = () => {
    if (currentPage > 0) {
        loadBooks(currentPage - 1);
    }
};

nextBtn.onclick = () => {
    if (currentPage < totalPages - 1) {
        loadBooks(currentPage + 1);
    }
};

function viewBook(id) {
    window.location.href = `detail.html?id=${id}`;
}

function editBook(id) {
    window.location.href = `edit.html?id=${id}`;
}

async function deleteBook(id, title) {
    const ok = confirm(`Bạn có chắc muốn xóa sách "${title}" không?`);
    if (!ok) return;

    try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${API_BASE}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 204) {
            alert("Xóa thành công!");
            loadBooks(currentPage);
        } else {
            alert("Không thể xóa sách");
        }
    } catch (err) {
        alert("Không thể kết nối tới server");
    }
}

loadBooks();
