import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Add compression and caching headers
	const headers = new Headers(response.headers);

	// Compression headers (handled by server, but we set expectations)
	headers.set('Vary', 'Accept-Encoding');

	// Cache static assets
	const pathname = event.url.pathname;
	if (
		pathname.startsWith('/_app/') ||
		pathname.match(/\.(js|css|woff2?|png|jpg|jpeg|webp|svg|ico)$/)
	) {
		headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	} else if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
		headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
	} else {
		// HTML pages - shorter cache
		headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
	}

	// Security headers
	headers.set('X-Content-Type-Options', 'nosniff');
	headers.set('X-Frame-Options', 'DENY');
	headers.set('X-XSS-Protection', '1; mode=block');
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	// Permissions-Policy: restrict access to browser features
	headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

	// Return new response with updated headers
	// Response body can be null for some responses (like redirects)
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};
