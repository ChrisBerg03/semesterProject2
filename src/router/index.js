export default async function router(pathname = window.location.pathname) {
    switch (pathname) {
        case "/":
            await import("../feed/index.js");
            break;
        case "/post/":
            await import("../ui/singlePost.js");
            break;
        case "/auth/":
            await import("../ui/auth.js");
            break;
        case "/bid/":
            await import("../ui/bid.js");
            break;
        case "/profile/":
            await import("../ui/profile.js");
            break;
        default:
            console.warn("page was not found" + pathname);
            break;
    }
}
