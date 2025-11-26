const API_BOOK = "http://localhost:8080/api/books";
const API_CATEGORY = "http://localhost:8080/api/categories";

const titleInput = document.getElementById("titleInput");
const categorySelect = document.getElementById("categorySelect");
const authorInput = document.getElementById("authorInput");
const publisherInput = document.getElementById("publisherInput");
const descInput = document.getElementById("descInput");

const titleError = document.getElementById("titleError");
const categoryError = document.getElementById("categoryError");
const authorError = document.getElementById("authorError");
const publisherError = document.getElementById("publisherError");
const createBtn = document.getElementById("createBtn");

async function loadCategories() {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(API_CATEGORY, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const categories = await res.json();

    categories.forEach(c => {
        categorySelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

loadCategories();

titleInput.addEventListener("input", () => {
    if (titleInput.value.trim() === "") {
        titleError.classList.remove("d-none");
    } else {
        titleError.classList.add("d-none");
    }
});

authorInput.addEventListener("input", () => {
    authorError.classList.toggle("d-none", authorInput.value.trim() !== "");
});

publisherInput.addEventListener("input", () => {
    publisherError.classList.toggle("d-none", publisherInput.value.trim() !== "");
});

categorySelect.addEventListener("change", () => {
    categoryError.classList.toggle("d-none", categorySelect.value !== "");
});


createBtn.onclick = async () => {

    let valid = true;

    if (titleInput.value.trim() === "") {
        titleError.classList.remove("d-none");
        valid = false;
    }
    if (categorySelect.value === "") {
        categoryError.classList.remove("d-none");
        valid = false;
    }
    if (authorInput.value.trim() === "") {
        authorError.classList.remove("d-none");
        valid = false;
    }
    if (publisherInput.value.trim() === "") {
        publisherError.classList.remove("d-none");
        valid = false;
    }

    if (!valid) return;

    const token = localStorage.getItem("accessToken");

    const body = {
        title: titleInput.value.trim(),
        categoryId: Number(categorySelect.value),
        author: authorInput.value.trim(),
        publisher: publisherInput.value.trim(),
        description: descInput.value.trim()
    };

    try {
        const res = await fetch(API_BOOK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            alert("Thêm sách thành công!");
            window.location.href = "list.html";
        } else {
            alert("Sách đã tồn tại");
        }

    } catch (err) {
        alert("Không thể kết nối server");
    }
};
