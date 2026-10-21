/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /* Pictures and films uploaded in the studio are served from Sanity's own
       CDN, and nothing else off this site is remote. */
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
