const API_BOOK = "http://localhost:8080/api/books";
const API_CATEGORY = "http://localhost:8080/api/categories";

const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const publisherInput = document.getElementById("publisher");
const categorySelect = document.getElementById("category");
const descInput = document.getElementById("description");

const titleError = document.getElementById("titleError");
const authorError = document.getElementById("authorError");
const publisherError = document.getElementById("publisherError");
const categoryError = document.getElementById("categoryError");

async function loadCategories() {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(API_CATEGORY, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const categories = await res.json();

    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat.id;
        opt.textContent = cat.name;
        categorySelect.appendChild(opt);
    });
}

async function loadBook() {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${API_BOOK}/${bookId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();

    titleInput.value = data.title;
    authorInput.value = data.author;
    publisherInput.value = data.publisher;
    categorySelect.value = data.categoryId;
    descInput.value = data.description || "";
}

function validateNotEmpty(input, errorBox, message) {
    if (input.value.trim() === "") {
        errorBox.textContent = message;
        errorBox.classList.remove("d-none");
        return false;
    }
    errorBox.classList.add("d-none");
    return true;
}

titleInput.oninput = () =>
    validateNotEmpty(titleInput, titleError, "Tên sách không được để trống");

authorInput.oninput = () =>
    validateNotEmpty(authorInput, authorError, "Tác giả không được để trống");

publisherInput.oninput = () =>
    validateNotEmpty(publisherInput, publisherError, "Nhà xuất bản không được để trống");

categorySelect.onchange = () =>
    validateNotEmpty(categorySelect, categoryError, "Vui lòng chọn thể loại");

document.getElementById("updateBtn").onclick = async () => {
    const ok1 = validateNotEmpty(titleInput, titleError, "Tên sách không được để trống");
    const ok2 = validateNotEmpty(authorInput, authorError, "Tác giả không được để trống");
    const ok3 = validateNotEmpty(publisherInput, publisherError, "Nhà xuất bản không được để trống");
    const ok4 = validateNotEmpty(categorySelect, categoryError, "Vui lòng chọn thể loại");

    if (!ok1 || !ok2 || !ok3 || !ok4) return;

    const token = localStorage.getItem("accessToken");

    const payload = {
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        publisher: publisherInput.value.trim(),
        description: descInput.value.trim(),
        categoryId: categorySelect.value
    };

    try {
        const res = await fetch(`${API_BOOK}/${bookId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Cập nhật sách thành công!");
            window.location.href = "list.html";
        } else {
            alert("Sách đã tồn tại");
        }
    } catch (err) {
        alert("Lỗi kết nối server");
    }
};

document.getElementById("backBtn").onclick = () =>
    window.location.href = "list.html";

(async () => {
    await loadCategories();
    await loadBook();
})();
