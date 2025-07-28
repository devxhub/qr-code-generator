<script lang="ts">
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

<header class="bg-[#1E293B] p-4 text-white">
	<h1 class="text-xl font-bold">QR Code Generator</h1>
</header>

<main class="p-4">
	{@render children()}
</main>

<footer class="bg-[#0F172A] p-4 text-center text-white">
	<p>
		&copy; {new Date().getFullYear()}
		<a
			href="https://devxhub.com"
			target="_blank"
			rel="noopener noreferrer"
			class="text-blue-600 hover:underline dark:text-blue-400">Devxhub Pvt. Ltd.</a
		>. All rights reserved.
	</p>
</footer>
