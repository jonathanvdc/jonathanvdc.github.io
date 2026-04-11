export function toSlug(path, frontmatter = {}) {
  if (frontmatter.permalink) {
    return frontmatter.permalink.split('/').filter(Boolean).at(-1);
  }

  return path.split('/').pop().replace(/\.(md|mdx)$/i, '');
}

export function toUrl(collection, path, frontmatter = {}) {
  if (frontmatter.permalink) {
    return normalizeUrl(frontmatter.permalink);
  }

  return normalizeUrl(`/${collection}/${toSlug(path, frontmatter)}/`);
}

export function normalizeUrl(url) {
  if (url === '/') {
    return url;
  }

  return url.endsWith('/') ? url : `${url}/`;
}

export function toEntry(collection, path, module) {
  const frontmatter = module.frontmatter ?? {};

  return {
    path,
    collection,
    slug: toSlug(path, frontmatter),
    url: toUrl(collection, path, frontmatter),
    frontmatter,
    Content: module.default
  };
}

export function entriesFromGlob(collection, modules) {
  return Object.entries(modules)
    .map(([path, module]) => toEntry(collection, path, module))
    .filter((entry) => entry.frontmatter.published !== false);
}

export function byDateDesc(a, b) {
  return dateValue(b.frontmatter.date) - dateValue(a.frontmatter.date);
}

export function byDateAsc(a, b) {
  return dateValue(a.frontmatter.date) - dateValue(b.frontmatter.date);
}

export function dateValue(value) {
  if (!value) {
    return 0;
  }

  return new Date(value).getTime();
}

export function formatDate(value, options = {}) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('en-CA', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
    ...options
  }).format(date);
}

export function compact(values) {
  return values.filter(Boolean);
}
