import type { Job } from './jobs';
import type { Product } from './products';

type Slugged = {
  slug: string;
};

function findDuplicateSlugs(items: readonly Slugged[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const { slug } of items) {
    if (seen.has(slug)) {
      duplicates.add(slug);
    }

    seen.add(slug);
  }

  return [...duplicates].sort();
}

/** Throws before a production build emits routes for invalid site data. */
export function validateSiteData(
  products: readonly Product[],
  jobs: readonly Job[],
): void {
  const errors: string[] = [];
  const duplicateProductSlugs = findDuplicateSlugs(products);
  const duplicateJobSlugs = findDuplicateSlugs(jobs);

  if (duplicateProductSlugs.length > 0) {
    errors.push(`Duplicate product slugs: ${duplicateProductSlugs.join(', ')}`);
  }

  if (duplicateJobSlugs.length > 0) {
    errors.push(`Duplicate job slugs: ${duplicateJobSlugs.join(', ')}`);
  }

  const productSlugs = new Set(products.map((product) => product.slug));

  for (const product of products) {
    for (const relatedSlug of product.relatedProductSlugs ?? []) {
      if (!productSlugs.has(relatedSlug)) {
        errors.push(
          `Product "${product.slug}" references unknown related product "${relatedSlug}".`,
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Site data validation failed:\n- ${errors.join('\n- ')}`);
  }
}
