<script lang="ts">
	interface Props {
		title?: string;
		subtitle?: string;
		logoSrc?: string;
	}

	const { title = 'QR Code Generator', subtitle = 'Create & Customize', logoSrc = '/logo.webp' }: Props = $props();
</script>

<header class="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
		<div class="flex items-center gap-4">
			<!-- Company Logo -->
			<img src={logoSrc} alt="Devxhub Logo" class="h-14 w-14 object-contain" />

			<!-- Brand Info -->
			<div class="flex flex-col">
				<h1 class="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
				<p class="text-sm font-medium text-slate-500">{subtitle}</p>
			</div>
		</div>

		<!-- Optional: Right side slot for future navigation/actions -->
		<slot />
	</div>
</header>

<style>
	header {
		backdrop-filter: blur(10px);
		background-color: rgba(255, 255, 255, 0.95);
	}
</style>
