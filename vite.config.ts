import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [viteReact(), tailwindcss()],
	test: {
		globals: true,
		environment: "jsdom",
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					// Split React and React DOM into separate chunk
					"react-vendor": ["react", "react-dom"],
					// Split router into separate chunk
					"router-vendor": ["@tanstack/react-router"],
					// Split MSAL (authentication) into separate chunk
					"auth-vendor": ["@azure/msal-browser", "@azure/msal-react"],
					// Split devtools (only loaded in dev mode anyway)
					"devtools-vendor": ["@tanstack/react-router-devtools"],
				},
			},
		},
		// Increase chunk size warning limit slightly
		chunkSizeWarningLimit: 600,
	},
});
