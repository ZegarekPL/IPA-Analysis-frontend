import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = nextIntl({
	allowedDevOrigins: ['http://localhost:3001', 'http://192.168.158.107:3001'],
	output: 'standalone',
});

export default nextConfig;
