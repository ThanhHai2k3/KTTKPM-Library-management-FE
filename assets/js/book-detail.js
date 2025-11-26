const API_BOOK = "http://localhost:8080/api/books";

const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

const titleBox = document.getElementById("title");
const authorBox = document.getElementById("author");
const publisherBox = document.getElementById("publisher");
const categoryBox = document.getElementById("category");
const descBox = document.getElementById("description");

async function loadBookDetail() {
    try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${API_BOOK}/${bookId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        titleBox.value = data.title;
        authorBox.value = data.author;
        publisherBox.value = data.publisher;
        categoryBox.value = `${data.categoryName}`;
        descBox.value = data.description || "(Không có mô tả)";

    } catch (e) {
        alert("Không thể tải thông tin sách");
    }
}

document.getElementById("backBtn").onclick = () => {
    window.location.href = "list.html";
};

loadBookDetail();
