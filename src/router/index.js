export default async function router(pathname = window.location.pathname) {
    switch (pathname) {
        case "/":
            await import("../feed/index.js");
            break;
        // case "/auth/":
        //     await import("");
        //     break;
        default:
            await import("../notFound/index.html");
            break;
    }
}
