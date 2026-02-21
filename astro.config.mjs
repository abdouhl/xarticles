import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: 'https://xarticles.com',
  integrations: [react(), partytown(
    {
      config: {
        forward: ["dataLayer.push"],
      },
    }
  ), sitemap()],

  adapter: cloudflare()
});