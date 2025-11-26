const API_BASE = "http://localhost:8080/api/categories";

const params = new URLSearchParams(window.location.search);
const categoryId = params.get("id");

const nameInput = document.getElementById("nameInput");
const descInput = document.getElementById("descInput");
const nameError = document.getElementById("nameError");
const updateBtn = document.getElementById("updateBtn");

let oldName = "";
let typingTimer = null;

async function loadCategory() {
    try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${API_BASE}/${categoryId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        nameInput.value = data.name;
        descInput.value = data.description || "";
        oldName = data.name;

    } catch (err) {
        alert("Không thể tải dữ liệu");
    }
}

loadCategory();

async function checkNameExists(name) {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${API_BASE}/exists?name=${encodeURIComponent(name)}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    return await res.json(); // true / false
}


nameInput.addEventListener("input", () => {
    nameError.classList.add("d-none");

    clearTimeout(typingTimer);

    typingTimer = setTimeout(async () => {
        const val = nameInput.value.trim();

        if (val === "") {
            nameError.textContent = "Tên thể loại không được để trống";
            nameError.classList.remove("d-none");
            return;
        }

        if (val.toLowerCase() !== oldName.toLowerCase()) {
            const exists = await checkNameExists(val);
            if (exists) {
                nameError.textContent = "Tên thể loại đã tồn tại";
                nameError.classList.remove("d-none");
                return;
            }
        }

    }, 350);
});

updateBtn.onclick = async () => {
    const name = nameInput.value.trim();
    const desc = descInput.value.trim();

    if (!nameError.classList.contains("d-none")) {
        return;
    }

    if (name === "") {
        nameError.textContent = "Tên thể loại không được để trống";
        nameError.classList.remove("d-none");
        return;
    }

    try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${API_BASE}/${categoryId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                description: desc
            })
        });

        if (res.ok) {
            alert("Cập nhật thành công!");
            window.location.href = "list.html";
        } else {
            alert("Không thể cập nhật thể loại");
        }

    } catch (err) {
        alert("Không thể kết nối server");
    }
};
