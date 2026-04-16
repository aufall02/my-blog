// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";

// https://astro.build/docs/configuration
export default defineConfig({
  site: "https://ngecode.id",
  output: "server",
  adapter: netlify(),
  integrations: [sitemap()],
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Roboto",
        cssVariable: "--font-roboto",
      },
    ],
  },
});
