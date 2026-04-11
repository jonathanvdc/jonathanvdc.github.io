# Jonathan Van der Cruysse

Source for my personal website at <https://jonathanvdc.github.io>.

The site is built with Astro and deployed to GitHub Pages. My resume PDF is generated from a separate private repository and published here as `files/resume.pdf`.

## Local Development

Install dependencies and start the Astro dev server:

```sh
npm install
npm run dev
```

Build the static site:

```sh
npm run build
```

The build copies `files/` and `images/` into Astro's `public/` directory before rendering, so assets can continue to be referenced from stable root-relative URLs such as `/files/resume.pdf`.
