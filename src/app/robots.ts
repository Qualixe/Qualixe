import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login', '/profile'],
      },
    ],
    sitemap: 'https://www.qualixe.com/sitemap.xml',
  };
}
