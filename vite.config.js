import { defineConfig, loadEnv } from 'vite';
import vuePlugin from '@vitejs/plugin-vue';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	return {
		base:'./',
		plugins: [
			vuePlugin({}),
			topLevelAwait({
				promiseExportName: '__tla',
				promiseImportName: (i) => `__tla_${i}`,
			}),
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		build: {
			outDir: path.resolve(__dirname, './dist'),
			assetsDir: './assets',
			rollupOptions: {
			  input: path.resolve(__dirname, 'h5.html'),
			}
		},
		server: {
			host: '0.0.0.0',
			port: env.VITE_APP_PORT || 5201,
			proxy: {
				'/api': {
					target: env.VITE_APP_BASE_URL,
					changeOrigin: true,
					ws: true,
					toProxy: false,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
	};
});
