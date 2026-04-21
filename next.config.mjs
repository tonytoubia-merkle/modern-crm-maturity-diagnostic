/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Backwards-compatible redirects for the pre-rename CRM routes. Any
  // bookmark pointing at /project/... or /assessment/... still works.
  // /results/[shareId] and /survey/[inviteToken] intentionally stayed at
  // the top level — those are externally shared URLs.
  async redirects() {
    return [
      { source: "/project", destination: "/crm/project", permanent: true },
      {
        source: "/project/:path*",
        destination: "/crm/project/:path*",
        permanent: true,
      },
      {
        source: "/assessment",
        destination: "/crm/assessment",
        permanent: true,
      },
      {
        source: "/assessment/:path*",
        destination: "/crm/assessment/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
