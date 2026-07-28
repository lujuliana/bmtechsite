import { products, type Product } from '../data/products';

export function getProductStaticPaths() {
  return products.map((product) => ({ params: { slug: product.slug } }));
}

export function getProductBySlug(slug: string | undefined): Product {
  const product = products.find((candidate) => candidate.slug === slug);

  if (!product) {
    throw new Error(`Product not found for slug: ${slug}`);
  }

  return product;
}
