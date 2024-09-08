import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import AutoImport from "unplugin-auto-import/vite"
// import ReactivityTransform from "@vue-macros/reactivity-transform/vite"
// import Alias from 'vite-plugin-alias';
import path from "path"
// import {createTsConfigPathsPlugin } from 'vite-tsconfig-paths';
// import reactRefresh from '@vitejs/plugin-react-refresh';
// import '@dbfu/react-directive'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // reactRefresh(),
    react({
      jsxImportSource: '@dbfu/react-directive'
    }),
    // tsconfigPaths(),
    // ReactivityTransform(), //  $ref ...
    
   
    // AutoImport({
    //   imports: ["react", "react-dom", "react-router-dom"],
    // }),
  ],
  base: './',
  resolve: {
    alias:{
      "@":path.resolve(__dirname,"./src")
    }
  },
  server: {
    open: true,
    host: true,
    port: 4000,
  },

  build:{
    assetsDir: 'assets',
    rollupOptions: {
      plugins: [
        {
          name: 'image-asset-external',
          generateBundle(options, bundle) {
            Object.keys(bundle).forEach((fileName) => {
              const file = bundle[fileName];
              if (file.type === 'asset' && /\.(png|jpe?g|gif|svg)$/.test(file.name)) {
                // file.external = true;
              }
            });
          },
        },
      ],
    },
  }
  
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "@/styles/index.scss";`,
  //     },
  //   },
  // },
})
