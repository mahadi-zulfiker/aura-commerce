/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "source.unsplash.com",
      "images.pexels.com",
      "res.cloudinary.com",
    ],
  },
};

export default nextConfig;
