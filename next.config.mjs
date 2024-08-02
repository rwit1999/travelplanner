/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        instrumentationHook:true,
    },
    typescript:{
        ignoreBuildErrors:true
    },
    eslint:{
        ignoreDuringBuilds:true
    },
    env:{
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:"pk_test_51PbklTRuyAQFQG5OhTVcxVvwuoXRt1McEaHwhYun6KwXFwQyrK5xmCZ7D1G42unfi1B8x6axr3HCG7GOQronfhd100SudcWkIA"
    },
    images:{
        remotePatterns:[
            {hostname:"imgcld.yatra.com"}
        ]
    }
};

export default nextConfig;
