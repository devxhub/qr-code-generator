<script lang="ts">
	import { Header } from '$lib/shared/components';
	import { generateSEOTags, generateSchemaMarkup } from '$lib/shared/utils/seo';
	// CSS is imported here but will be code-split by Vite
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();
	let Footer = $state<typeof import('$lib/shared/components').Footer | null>(null);

	// SEO config - keep it simple and fast
	const seoConfig = {
		title: 'QR Code Generator – Create QR Codes Online',
		description:
			'Generate QR codes for URLs, text, contacts, WiFi, SMS, and more. Free, fast, and privacy-friendly.',
		url: '/',
		image: '/preview.png',
		imageWidth: 1200,
		imageHeight: 630,
		imageAlt: 'QR Code Generator preview',
		siteName: 'QR Code Generator',
		locale: 'en_US'
	};

	const seoTags = generateSEOTags(seoConfig);

	// Get base URL for schema markup - use environment variable consistently for SSR/CSR hydration
	// Always use env var to avoid hydration mismatches (same logic as generateSEOTags)
	const baseUrl = import.meta.env.PUBLIC_SITE_URL || 'https://example.com';

	const schemaMarkup = generateSchemaMarkup({
		name: 'QR Code Generator',
		description: seoConfig.description,
		url: baseUrl,
		applicationCategory: 'WebApplication',
		operatingSystem: 'Any'
	});

	// Safely serialize JSON-LD to prevent XSS
	const schemaJson = JSON.stringify(schemaMarkup);
	const schemaScript = '<script type="application/ld+json">' + schemaJson + '<\/script>';

	// Lazy load Footer component (below the fold) to reduce initial bundle
	// onMount only runs on client, so window is safe here
	onMount(async () => {
		// Use requestIdleCallback for better performance, fallback to setTimeout
		if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
			requestIdleCallback(async () => {
				const module = await import('$lib/shared/components');
				Footer = module.Footer;
			});
		} else {
			setTimeout(async () => {
				const module = await import('$lib/shared/components');
				Footer = module.Footer;
			}, 0);
		}
	});
</script>

<svelte:head>
	<title>{seoTags.title}</title>
	<meta name="description" content={seoTags.description} />

	<!-- Canonical URL -->
	<link rel="canonical" href={seoTags.canonical} />

	<!-- Critical Open Graph tags -->
	<meta property="og:type" content={seoTags['og:type']} />
	<meta property="og:url" content={seoTags['og:url']} />
	<meta property="og:title" content={seoTags['og:title']} />
	<meta property="og:description" content={seoTags['og:description']} />
	<meta property="og:image" content={seoTags['og:image']} />
	<meta property="og:image:width" content={seoTags['og:image:width']} />
	<meta property="og:image:height" content={seoTags['og:image:height']} />
	{#if seoTags['og:image:alt']}
		<meta property="og:image:alt" content={seoTags['og:image:alt']} />
	{/if}
	<meta property="og:site_name" content={seoTags['og:site_name']} />
	<meta property="og:locale" content={seoTags['og:locale']} />

	<!-- Twitter Card tags -->
	<meta name="twitter:card" content={seoTags['twitter:card']} />
	<meta name="twitter:title" content={seoTags['twitter:title']} />
	<meta name="twitter:description" content={seoTags['twitter:description']} />
	<meta name="twitter:image" content={seoTags['twitter:image']} />
	{#if seoTags['twitter:site']}
		<meta name="twitter:site" content={seoTags['twitter:site']} />
	{/if}
	{#if seoTags['twitter:creator']}
		<meta name="twitter:creator" content={seoTags['twitter:creator']} />
	{/if}

	<!-- Schema.org JSON-LD - JSON.stringify is safe for controlled data -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html schemaScript}
</svelte:head>

<Header />

<main
	id="main-content"
	class="bg-gradient-to-b from-slate-200 to-slate-50 dark:from-slate-900 dark:to-slate-950  flex flex-1 flex-col"
	tabindex="-1"
>
	<div class="mx-auto w-full max-w-7xl px-6 py-8">
		{@render children()}
	</div>
</main>

{#if Footer}
	<Footer />
{:else}
	<!-- Footer placeholder to prevent layout shift -->
	<footer
		class="border-t border-slate-200 bg-slate-900"
		aria-hidden="true"
		style="min-height: 200px;"
	></footer>
{/if}
