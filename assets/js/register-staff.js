const apiBase = "http://localhost:8080";

const fullName = document.getElementById("fullName");
const usernameInput = document.getElementById("username");
const password = document.getElementById("password");
const position = document.getElementById("position");
const alertBox = document.getElementById("alertBox");
const form = document.getElementById("registerForm");

let usernameValid = false;

usernameInput.addEventListener("input", async () => {
    const username = usernameInput.value.trim();

    if (username.length < 3) {
        usernameInput.classList.remove("is-valid");
        usernameInput.classList.add("is-invalid");
        usernameValid = false;
        return;
    }

    try {
        const res = await fetch(`${apiBase}/api/auth/check-username?username=${username}`);

        if (!res.ok) {
            usernameInput.classList.remove("is-valid");
            usernameInput.classList.add("is-invalid");
            usernameValid = false;
            return;
        }

        const exists = await res.json();

        if (exists === true) {
            usernameInput.classList.remove("is-valid");
            usernameInput.classList.add("is-invalid");
            usernameValid = false;
        } else {
            usernameInput.classList.remove("is-invalid");
            usernameInput.classList.add("is-valid");
            usernameValid = true;
        }

    } catch (err) {
        console.error("Error checking username:", err);
        usernameInput.classList.remove("is-valid");
        usernameInput.classList.add("is-invalid");
        usernameValid = false;
    }
});

// Submit form
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!usernameValid) {
        alertBox.className = "alert alert-danger";
        alertBox.innerText = "Tên đăng nhập không hợp lệ!";
        alertBox.classList.remove("d-none");
        return;
    }

    const body = {
        fullName: fullName.value,
        username: usernameInput.value,
        password: password.value,
        position: position.value
    };

    try {
        const res = await fetch(`${apiBase}/api/auth/register/staff`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            alertBox.className = "alert alert-danger";
            alertBox.innerText = "Đăng ký thất bại!";
            alertBox.classList.remove("d-none");
            return;
        }

        window.location.href = "login.html";

    } catch (err) {
        console.error(err);
        alertBox.className = "alert alert-danger";
        alertBox.innerText = "Không thể kết nối server!";
        alertBox.classList.remove("d-none");
    }
});
