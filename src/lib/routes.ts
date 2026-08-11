import { jobs } from "../data/jobs";
import { products } from "../data/products";

export type Locale = "en" | "ja";
export type PathMatch = "exact" | "descendant";

type LocaleRoute = Record<Locale, string>;

const localizedStaticRoutes: readonly LocaleRoute[] = [
  { en: "/", ja: "/ja/" },
  { en: "/about", ja: "/ja/about" },
  { en: "/products", ja: "/ja/products" },
  { en: "/security-vuln", ja: "/ja/security-vuln" },
  { en: "/contact", ja: "/ja/contact" },
  { en: "/404", ja: "/ja/404" },
];

const productSlugs = new Set(products.map((product) => product.slug));
const openJobSlugs = new Set(
  jobs.filter((job) => job.isOpen).map((job) => job.slug),
);

export function normalizePath(path: string): string {
  let pathname = path.trim();

  if (/^[a-z][a-z\d+.-]*:\/\//i.test(pathname)) {
    pathname = new URL(pathname).pathname;
  } else {
    pathname = pathname.split(/[?#]/)[0];
  }

  pathname = `/${pathname.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "")}`;
  pathname = pathname.replace(/\/{2,}/g, "/");
  pathname = pathname.replace(/\/index(?:\.html)?$/i, "") || "/";
  pathname = pathname.replace(/\.html$/i, "");

  if (/^\/home$/i.test(pathname)) return "/";
  if (/^\/ja(?:\/home)?$/i.test(pathname)) return "/ja";

  return pathname;
}

export function resolveLocaleRoute(
  path: string,
  locale: Locale,
): string | undefined {
  const normalizedPath = normalizePath(path);
  const staticRoute = localizedStaticRoutes.find((route) =>
    Object.values(route).some(
      (routePath) => normalizePath(routePath) === normalizedPath,
    ),
  );

  if (staticRoute) return staticRoute[locale];

  const productMatch = normalizedPath.match(/^\/(?:ja\/)?products\/([^/]+)$/);
  if (productMatch && productSlugs.has(productMatch[1])) {
    return locale === "ja"
      ? `/ja/products/${productMatch[1]}`
      : `/products/${productMatch[1]}`;
  }

  const jobMatch = normalizedPath.match(/^\/careers(?:\/([^/]+))?$/);
  if (
    locale === "en" &&
    jobMatch &&
    (!jobMatch[1] || openJobSlugs.has(jobMatch[1]))
  ) {
    return jobMatch[1] ? `/careers/${jobMatch[1]}` : "/careers";
  }

  return undefined;
}

export function isActivePath(
  currentPath: string,
  targetPath: string,
  match: PathMatch = "exact",
): boolean {
  const current = normalizePath(currentPath);
  const target = normalizePath(targetPath);

  return (
    current === target ||
    (match === "descendant" && current.startsWith(`${target}/`))
  );
}

export function activeLinkClass(
  baseClass: string,
  currentPath: string,
  targetPath: string,
  match: PathMatch = "exact",
): string {
  return `${baseClass}${isActivePath(currentPath, targetPath, match) ? " w--current" : ""}`;
}

export function activeAriaCurrent(
  currentPath: string,
  targetPath: string,
  match: PathMatch = "exact",
): "page" | undefined {
  return isActivePath(currentPath, targetPath, match) ? "page" : undefined;
}
