import type { RequestHandler } from './$types';

// Get site URL from environment variable or use default
// Set PUBLIC_SITE_URL in your .env file
const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://example.com';

// Prerender this route for static builds
export const prerender = true;

export const GET: RequestHandler = async () => {
	// Generate sitemap with current date
	const lastmod = new Date().toISOString().split('T')[0];
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${siteUrl}/</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
	</url>
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600'
		}
	});
};
