import { navHeader } from "../ui/header";
navHeader();

document.getElementById("profileImg").src =
    localStorage.getItem("avatar") ||
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";
