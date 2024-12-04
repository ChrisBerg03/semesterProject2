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

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const bio = document.getElementById("bio").value;
    const avatarUrl = document.getElementById("avatarUrl").value;
    const bannerUrl = document.getElementById("bannerUrl").value;

    const registrationData = {
        name: name,
        email: email,
        password: password,
        bio: bio || undefined,
        avatar: avatarUrl ? { url: avatarUrl || "" } : undefined,
        banner: bannerUrl ? { url: bannerUrl || "" } : undefined,
    };

    console.log("Registration Data:", registrationData);

    // Send registration data to the server
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

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

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
