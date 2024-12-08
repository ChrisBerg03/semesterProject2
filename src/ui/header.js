export function navHeader() {
    document.getElementById("profileImg").src =
        localStorage.getItem("avatar") ||
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";
    if (localStorage.getItem("accessToken")) {
        document
            .getElementById("login-button-container")
            .classList.add("hidden");
    }
    const userMenuButton = document.getElementById("user-menu-button");
    const userMenu = document.querySelector(
        '[aria-labelledby="user-menu-button"]'
    );
    const mobileMenuButton = document.querySelector(
        '[aria-controls="mobile-menu"]'
    );
    const mobileMenu = document.getElementById("mobile-menu");
    const signOutButton = document.getElementById("user-menu-item-2");

    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener("click", (event) => {
            event.stopPropagation();
            userMenu.classList.toggle("hidden");
        });
        document.addEventListener("click", (event) => {
            if (
                !userMenuButton.contains(event.target) &&
                !userMenu.contains(event.target)
            ) {
                userMenu.classList.add("hidden");
            }
        });
    }
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }
    if (signOutButton) {
        signOutButton.addEventListener("click", () => {
            if (confirm("Are you sure you want to sign out?")) {
                localStorage.clear();
                window.location.href = "/";
            }
        });
    }
}
