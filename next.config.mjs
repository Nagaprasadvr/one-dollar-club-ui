/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // or http
        hostname: "**",
      },
    ],
    domains: [
      "arweave.net",
      "*.ipfs.nftstorage.link",
      "bafkreibk3covs5ltyqxa272uodhculbr6kea6betidfwy3ajsav2vjzyum.ipfs.nftstorage.link",
    ],
  },
};

export default nextConfig;
