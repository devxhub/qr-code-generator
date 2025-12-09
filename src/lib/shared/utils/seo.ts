export interface SEOConfig {
	title: string;
	description: string;
	url?: string;
	image?: string;
	imageWidth?: number;
	imageHeight?: number;
	imageAlt?: string;
	type?: string;
	siteName?: string;
	locale?: string;
	canonicalUrl?: string;
	twitterCard?: 'summary' | 'summary_large_image';
	twitterSite?: string;
	twitterCreator?: string;
}

export function generateSEOTags(config: SEOConfig) {
	const {
		title,
		description,
		url = '',
		image = '/preview.png',
		imageWidth = 1200,
		imageHeight = 630,
		imageAlt = '',
		type = 'website',
		siteName = 'App',
		locale = 'en_US',
		canonicalUrl,
		twitterCard = 'summary_large_image',
		twitterSite = '',
		twitterCreator = ''
	} = config;

	// Get base URL from environment or use default
	// Set PUBLIC_SITE_URL in your .env file or environment
	// Always use env var to avoid hydration mismatches
	const baseUrl = import.meta.env.PUBLIC_SITE_URL || 'https://example.com';
	const fullUrl = url ? (url.startsWith('http') ? url : `${baseUrl}${url}`) : baseUrl;
	const canonical = canonicalUrl || fullUrl;
	const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

	return {
		title,
		description,
		canonical: canonical,
		// Open Graph tags
		'og:title': title,
		'og:description': description,
		'og:url': fullUrl,
		'og:image': fullImage,
		'og:image:width': imageWidth.toString(),
		'og:image:height': imageHeight.toString(),
		...(imageAlt && { 'og:image:alt': imageAlt }),
		'og:type': type,
		'og:site_name': siteName,
		'og:locale': locale,
		// Twitter Card tags
		'twitter:card': twitterCard,
		'twitter:title': title,
		'twitter:description': description,
		'twitter:image': fullImage,
		...(twitterSite && { 'twitter:site': twitterSite }),
		...(twitterCreator && { 'twitter:creator': twitterCreator })
	};
}

export function generateSchemaMarkup(config: {
	name: string;
	description: string;
	url?: string;
	applicationCategory?: string;
	operatingSystem?: string;
	offers?: {
		price?: string;
		priceCurrency?: string;
	};
}) {
	// Get base URL from environment or use default
	// Always use env var to avoid hydration mismatches
	const baseUrl = import.meta.env.PUBLIC_SITE_URL || 'https://example.com';

	const {
		name,
		description,
		url = baseUrl,
		applicationCategory = 'WebApplication',
		operatingSystem = 'Any',
		offers
	} = config;

	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name,
		description,
		url,
		applicationCategory,
		operatingSystem,
		...(offers && { offers: { '@type': 'Offer', ...offers } })
	};
}
