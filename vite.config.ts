import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		cssMinify: true,
		// esbuild is the default minifier (faster than terser, no extra dependency)
		minify: 'esbuild',
		chunkSizeWarningLimit: 400, // Stricter limit for better performance
		cssCodeSplit: true, // Enable CSS code splitting
		target: 'esnext', // Use modern JS for smaller bundles
		// Reduce critical request chains by optimizing module loading
		modulePreload: {
			polyfill: false // Disable polyfill for modern browsers
		},
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					// Split node_modules into separate chunks for better parallel loading
					if (id.includes('node_modules')) {
						if (id.includes('svelte')) {
							return 'vendor-svelte';
						}
						if (id.includes('@sveltejs')) {
							return 'vendor-sveltekit';
						}
						return 'vendor';
					}
				},
				// Optimize chunk names for better caching
				chunkFileNames: 'chunks/[name]-[hash].js',
				entryFileNames: 'entries/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]',
				// Compact output for smaller bundles
				compact: true
			},
			// Tree shake more aggressively
			treeshake: {
				moduleSideEffects: false
			}
		}
	},
	// Optimize dependencies
	optimizeDeps: {
		include: ['svelte'],
		exclude: []
	},
	// CDN configuration - set VITE_CDN_URL environment variable
	// Example: VITE_CDN_URL=https://cdn.example.com npm run build
	base: (import.meta.env?.VITE_CDN_URL as string | undefined) || '/'
});
