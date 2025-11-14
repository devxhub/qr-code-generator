<script lang="ts">
	import { Footer, Header } from '$lib/shared/components';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>QR Code Generator – Create, Customize & Download</title>
	<meta
		name="description"
		content="Generate custom QR codes for URLs, contacts, text, WiFi, and more. Download in PNG, JPEG, or PDF. Built with Svelte 5 and Tailwind CSS."
	/>

	<!-- Optional: Open Graph / Social Sharing -->
	<meta property="og:title" content="QR Code Generator" />
	<meta
		property="og:description"
		content="Create custom QR codes instantly and download them as images or PDFs."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://qr.devxhub.com" />
	<meta property="og:image" content="https://qr.devxhub.com/preview.png" />

	<!-- Optional: Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="QR Code Generator" />
	<meta name="twitter:description" content="Create and export beautiful QR codes for free." />
	<meta name="twitter:image" content="https://qr.devxhub.com/preview.png" />
</svelte:head>

<Header title="QR Code Generator" subtitle="Create & Customize" />

<main class="flex flex-1 flex-col bg-gradient-to-b from-slate-50 to-white">
	<div class="mx-auto w-full max-w-7xl px-6 py-8">
		{@render children()}
	</div>
</main>

<Footer
	brandName="QR Generator"
	description="Create beautiful, customizable QR codes for any purpose."
	sections={[
		{
			title: 'Features',
			items: ['URL QR Codes', 'Contact Cards', 'WiFi Networks', 'SMS & Email']
		},
		{
			title: 'Export Options',
			items: ['PNG Format', 'JPEG Format', 'PDF Export', 'Custom Colors']
		},
		{
			title: 'Products',
			items: ['Password Generator', 'Calculator', 'QR Code Generator']
		}
	]}
/>
