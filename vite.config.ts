import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import ElementPlus from "unplugin-element-plus/vite";

export default defineConfig({
    plugins: [
        vue({
            // reactivityTransform: true,
        }),
        // ElementPlus(),
    ],
    build: {
        assetsInlineLimit: 0,
    },
    base: "",
});
