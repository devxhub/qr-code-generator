<script lang="ts">
	interface Props {
		title?: string;
		subtitle?: string;
		logoSrc?: string;
	}

	const {
		title = 'App',
		subtitle = 'Create & Customize',
		logoSrc = '/logo.webp'
	}: Props = $props();
</script>

<header class="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
		<div class="flex items-center gap-4">
			<img
				src={logoSrc}
				alt=""
				class="h-14 w-14 object-contain"
				width="56"
				height="56"
				loading="eager"
				fetchpriority="high"
				decoding="async"
				aria-hidden="true"
			/>
			<div class="flex flex-col">
				<h1 class="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
				<p class="text-sm font-medium text-slate-500">{subtitle}</p>
			</div>
		</div>
	</div>
</header>

<style>
	header {
		/* Use will-change for better performance */
		will-change: backdrop-filter;
		/* Optimize backdrop-filter for mobile - use simpler fallback */
		background-color: rgba(255, 255, 255, 0.98);
	}

	/* Only apply backdrop-filter on devices that can handle it */
	@media (prefers-reduced-motion: no-preference) {
		header {
			backdrop-filter: blur(10px);
		}
	}

	/* Disable backdrop-filter on mobile for better performance */
	@media (max-width: 768px) {
		header {
			backdrop-filter: none;
			background-color: rgba(255, 255, 255, 1);
		}
	}
</style>
