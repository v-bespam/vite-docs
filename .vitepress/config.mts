import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/vite-docs/",
  lang: "ru-RU",
  title: "📑 Документация Qtim",
  description: "",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Главная", link: "/" },
      { text: "Qtim Space", link: "/Qtim-Space" },
      { text: "Бакки", link: "/Бакки" },
      { text: "Онлайн школа", link: "/Онлайн-школа" },
      { text: "ОШ-1 сайт", link: "/ОШ-1-сайт" },
      { text: "Понимаю", link: "/Понимаю" },
    ],

    sidebar: [
      {
        "/Qtim-Space/": [
          {
            text: "База знаний администратора",
            items: [
              { text: "Index", link: "/Qtim-Space/" },
              { text: "One", link: "/Qtim-Space/admin/0-structure" },
              { text: "Two", link: "/Qtim-Space/two" },
            ],
          },
        ],

        "/Бакки/": [
          {
            text: "База знаний администратора",
            items: [
              { text: "Index", link: "/Бакки/" },
              { text: "One", link: "/Бакки/create-org" },
              { text: "Two", link: "/Qtim-Space/two" },
            ],
          },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/v-bespam/qtim" }],
  },
});
