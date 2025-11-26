const API_LOGIN = "http://localhost:8080/api/auth/login";

const form = document.getElementById("loginForm");
const errorAlert = document.getElementById("errorAlert");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim()
    };

    try {
        const res = await fetch(API_LOGIN, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            let msg = "Đăng nhập thất bại!";
            try {
                const data = await res.json();
                if (data.message) msg = data.message;
            } catch (_) {}
            throw new Error(msg);   
        }

        const data = await res.json();

        const token = data.token || data.data?.token;
        localStorage.setItem("accessToken", token);
        localStorage.setItem("username", data.username || data.data?.username || body.username);
        localStorage.setItem("fullName", data.fullName || data.data?.fullName || "");

        window.location.href = "../home/staff-dashboard.html";

    } catch (err) {
        errorAlert.innerText = err.message;
        errorAlert.classList.remove("d-none");
    }
});
