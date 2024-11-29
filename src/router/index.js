export default async function router(pathname = window.location.pathname) {
    switch (pathname) {
        case "/":
            await import("../feed/index.js");
            break;
        case "/post/":
            await import("../router/singlePost.js");
            break;
        default:
            console.warn("page was not found" + pathname);
            break;
    }
}
