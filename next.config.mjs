/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                hostname: 'www.decorilla.com',
            },
        ],
    },
};

export default nextConfig;
