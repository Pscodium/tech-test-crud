import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
    { 
        files: ["**/*.{js,mjs,cjs}"], 
        plugins: { js },
        rules: {
            indent: ["error", 4],
            semi: ["error", "always"],
            "no-unused-vars": ["error"]
        },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.browser } 
    },
]);
