/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        remotePatterns: [
            {
                hostname: 'www.decorilla.com',
            },
        ],
    },
};

export default nextConfig;
