// app/sitemap.js
export const dynamic = "force-static";

export default function sitemap() {
  const base = "https://mounjaro-taiwan.netlify.app";

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/faq`, lastModified: new Date() },
    { url: `${base}/health`, lastModified: new Date() },
    { url: `${base}/advanced`, lastModified: new Date() },
    { url: `${base}/dose`, lastModified: new Date() },
    { url: `${base}/threads`, lastModified: new Date() },
  ];
}
