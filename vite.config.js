// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    appType: "mpa",
    assetsInclude: ["**/*.html"],
    plugins: [],
    base: "",
    build: {
        target: ["esnext"],
        rollupOptions: {
            input: {
                index: resolve(__dirname, "./index.html"),
                auth: resolve(__dirname, "./auth/index.html"),
                profile: resolve(__dirname, "./profile/index.html"),
                create: resolve(__dirname, "./create/index.html"),
                post: resolve(__dirname, "./post/index.html"),
            },
        },
    },
});
