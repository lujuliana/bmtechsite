import { defineConfig } from 'astro/config';
import { jobs } from './src/data/jobs';
import { products } from './src/data/products';
import { validateSiteData } from './src/data/validate';

const siteDataValidation = {
  name: 'site-data-validation',
  hooks: {
    'astro:build:start': () => {
      validateSiteData(products, jobs);
    },
  },
};

export default defineConfig({
  output: 'static',
  integrations: [siteDataValidation],
});
