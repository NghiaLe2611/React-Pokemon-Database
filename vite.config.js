// @ts-nocheck
import react from '@vitejs/plugin-react-swc';
import {defineConfig, transformWithEsbuild} from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import fs from 'node:fs';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		jsconfigPaths(),
		{
			name: 'treat-js-files-as-jsx',
			async transform(code, id) {
				if (!id.match(/src\/.*\.js$/)) return null;

				// Use the exposed transform from vite, instead of directly
				// transforming with esbuild
				return transformWithEsbuild(code, id, {
					loader: 'jsx',
					jsx: 'automatic',
				});
			},
		},
	],
	optimizeDeps: {
		force: true,
		esbuildOptions: {
			loader: {
				'.js': 'jsx',
			},
		},
	},
	// Treat js as jsx file to run and build
	//  esbuild: { loader: 'jsx', include: /src\/.*\.jsx?$/, exclude: [] },
	//  optimizeDeps: {
	//      esbuildOptions: {
	//          plugins: [
	//              {
	//                  name: 'load-js-files-as-jsx',
	//                  setup(build) {
	//                      build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => {
	//                          return { loader: 'jsx', contents: await fs.readFile(args.path, 'utf8') };
	//                      });
	//                  }
	//              }
	//          ]
	//      }
	//  },
});
