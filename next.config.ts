import { NextConfig } from "next";

const config: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.public.blob.vercel-storage.com",
                pathname: "/images/**",
            },
            {
                protocol: "https",
                hostname: "authjs.dev",
                pathname: "/img/providers/**",
            },
        ],
    },
};

export default config;
