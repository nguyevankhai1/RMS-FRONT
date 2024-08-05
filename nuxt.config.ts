// https://nuxt.com/docs/api/configuration/nuxt-config
import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

export default defineNuxtConfig({
  build: {
    transpile: ["@vuepic/vue-datepicker"], // told by the library
  },
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: "123",
    // Keys within public are also exposed client-side
    public: {
      apiBase: process.env.API_BASE,
      BASE_URL_SSO: process.env.API_BASE + "/auth",
      APP_ID: process.env.APP_ID,
    },
  },
  vite: {
    plugins: [
      ckeditor5({ theme: require.resolve("@ckeditor/ckeditor5-theme-lark") }),
    ],
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "@/assets/sass/_colors.sass" as *\n',
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          compact: true,
          minifyInternalExports: true,
          generatedCode: {
            constBindings: true,
          },
        },
      },
    },
    esbuild: {
      legalComments: "none", //used to remove jsdoc in ckeditor5 dependencies
    },
  },
  app: {
    buildAssetsDir: "/_nuxt/",
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "RMS",
      meta: [{ name: "description", content: "My amazing site." }],
      link: [
        {
          href: "/css/tooltip.css",
          rel: "stylesheet",
        },
        { rel: "icon", type: "image/png", href: "/img/logo-head.ico" },
      ],
      script: [
        {
          src: "/js/bootstrap.bundle.min.js",
        },
      ],
      htmlAttrs: {
        lang: "vi",
        // "data-bs-theme": "light",
      },
      bodyAttrs: {
        id: "kt_body",
        class:
          "header-fixed header-tablet-and-mobile-fixed toolbar-enabled aside-fixed aside-default-enabled",
      },
    },
  },
  modules: [
    [
      "nuxt-purgecss",
      {
        enabled: true,
        dynamicAttributes: ["data-kt-aside-minimize"],
        content: [
          "./public/**/*.{js,ts}",
          "./composables/useNotify.ts",
          "./assets/**/*.{js,ts}",
          "./node_modules/vue-ctk-date-time-picker/dist/*.js",
          "./node_modules/@maptiler/sdk/dist/**/*.{js,ts}",
          "./node_modules/@maptiler/geocoding-control/**/*.{js,ts}",
        ],
        css: ["assets/**/*.{css,sass?,svg?}"],
        safelist: [
          /multiselect/,
          /menu-state-primary/,
          /form-control*/,
          /a/,
          /bg-.*/,
          /btn-.*/,
          /:root/,
          /cropper-*/,
          /dp__/,
          /ck/,
          /ck*/,
        ],
      },
    ],
    "@nuxtjs/i18n",
    "nuxt-icon",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
    "@nuxt/image-edge",
    "@nuxt/image",
  ],
  image: {
    provider: "ipx",
  },
  i18n: {
    locales: [
      {
        code: "vi",
        file: "vi-VN.json",
        iso: "vi-VN",
        icon: "emojione:flag-for-vietnam",
      },
      {
        code: "en",
        file: "en_US.json",
        iso: "en_US",
        icon: "emojione:flag-for-liberia",
      },
    ],
    lazy: true,
    langDir: "lang/",
    defaultLocale: "vi",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root", // recommended
      cookieCrossOrigin: true,
    },
  },
  // components: [
  //   {
  //     path: "~/components",
  //     pathPrefix: false,
  //   },
  // ],
  typescript: {
    strict: true,
  },
  routeRules: {
    "/*": { swr: true },
  },
  ssr: false,
});
