const API_BASE = "http://localhost:8080/api/categories";

const form = document.getElementById("categoryForm");
const alertBox = document.getElementById("alertBox");

const nameInput = document.getElementById("name");
const descInput = document.getElementById("description");
const nameError = document.getElementById("nameError");

async function checkCategoryExists(name) {
    const token = localStorage.getItem("accessToken");

    try {
        const res = await fetch(`${API_BASE}/exists?name=${encodeURIComponent(name)}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        return await res.json();
    } catch (err) {
        console.error("Validation error", err);
        return false;
    }
}

nameInput.addEventListener("input", async () => {
    const name = nameInput.value.trim();
    nameError.classList.add("d-none");

    if (!name) return;

    const exists = await checkCategoryExists(name);
    if (exists) {
        nameError.classList.remove("d-none");
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    const token = localStorage.getItem("accessToken");

    const exists = await checkCategoryExists(name);
    if (exists) {
        nameError.classList.remove("d-none");
        return;
    }

    const body = { name, description };

    try {
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            alertBox.className = "alert alert-danger";
            alertBox.textContent = data.message || "Không thể tạo thể loại";
            alertBox.classList.remove("d-none");
            return;
        }

        alertBox.className = "alert alert-success";
        alertBox.textContent = "Thể loại đã được tạo thành công!";
        alertBox.classList.remove("d-none");

        form.reset();

    } catch (err) {
        alert("Không thể kết nối đến server!");
    }
});
