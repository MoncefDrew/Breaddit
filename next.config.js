/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'uploadthing.com', 
      'lh3.googleusercontent.com', 
      'ufs.sh', // Allow UploadThing's CDN
      'vliep294nu.ufs.sh', // Specific subdomain if needed
      'utfs.io' // Allow UploadThing's new CDN domain
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
