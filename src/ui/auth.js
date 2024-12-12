import { registerUrl } from "../api/constants";
import { loginUrl } from "../api/constants";

const toggleFormBtn = document.getElementById("toggleFormBtn");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

toggleFormBtn.addEventListener("click", () => {
    registerForm.classList.toggle("hidden");
    loginForm.classList.toggle("hidden");

    toggleFormBtn.textContent = loginForm.classList.contains("hidden")
        ? "Switch to Login"
        : "Switch to Register";
});
const validNoroffEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
    return emailRegex.test(email);
};

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("password").value;
    const bio = document.getElementById("bio").value;
    const avatarUrl = document.getElementById("avatarUrl").value;
    const bannerUrl = document.getElementById("bannerUrl").value;

    if (!validNoroffEmail(email)) {
        alert("Email must end with @stud.noroff.no");
        return;
    }

    const registrationData = {
        name: name,
        email: email,
        password: password,
        bio: bio || undefined,
        avatar: avatarUrl ? { url: avatarUrl || "" } : undefined,
        banner: bannerUrl ? { url: bannerUrl || "" } : undefined,
    };

    fetch(registerUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
    })
        .then((response) => response.json())
        .then((data) => {})
        .catch((error) => {
            console.error("Error:", error);
        });
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("password").value;

    if (!validNoroffEmail(email)) {
        alert("Email must end with @stud.noroff.no");
        return;
    }

    const loginData = {
        email: email,
        password: password,
    };

    fetch(loginUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    })
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem("name", data.data.name);
            localStorage.setItem("bio", data.data.bio);
            localStorage.setItem("accessToken", data.data.accessToken);
            localStorage.setItem("avatar", data.data.avatar.url);
            localStorage.setItem("banner", data.data.banner.url);
            window.location.href = "/";
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});
